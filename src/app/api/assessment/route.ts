// POST /api/assessment — the core capture endpoint for the Strategic Benchmark Assessment.
// Validates the respondent's responses, computes authoritative scores server-side
// (per-dimension + overall normalised to 0-100), determines the maturity tier, computes
// a percentile against the existing benchmark dataset, and persists the Assessment +
// all individual AssessmentResponse rows in a single nested create.
//
// SCORING / NORMALISATION
//   Each Likert answer is 1-5. We normalise to a 0-100 maturity scale:
//       norm(value) = ((value - 1) / 4) * 100        // 1 -> 0, 3 -> 50, 5 -> 100
//   - dimension score = round(((avgOfDimValues - 1) / 4) * 100), clamped 0..100
//   - overall score   = round(((avgOfAllValues  - 1) / 4) * 100), clamped 0..100
//   - tier            = scoreToTier(overall): <35 Nascent, <55 Developing,
//                       <75 Established, else Leading.
//   PERCENTILE: after inserting, count OTHER assessments with overallScore <= this overall.
//   percentile = (lowerOrEqualOthers / totalOthers) * 100, rounded. If there are no other
//   assessments yet, percentile = 50 (neutral middle).

import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIMENSIONS = ["strategy", "technology", "culture", "data", "operations"] as const;
type Dimension = (typeof DIMENSIONS)[number];
const DIM_SET = new Set<string>(DIMENSIONS);

function scoreToTier(score: number): "Nascent" | "Developing" | "Established" | "Leading" {
  if (score < 35) return "Nascent";
  if (score < 55) return "Developing";
  if (score < 75) return "Established";
  return "Leading";
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

interface IncomingResponse {
  questionId?: unknown;
  value?: unknown;
  dimension?: unknown;
  questionText?: unknown;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
    }

    const responsesRaw = Array.isArray(body.responses) ? (body.responses as IncomingResponse[]) : [];
    if (responsesRaw.length === 0) {
      return Response.json({ ok: false, error: "responses must be a non-empty array" }, { status: 400 });
    }

    // Validate + normalise each response.
    const responses: {
      questionId: string;
      value: number;
      dimension: Dimension;
      questionText: string;
    }[] = [];
    for (let i = 0; i < responsesRaw.length; i++) {
      const r = responsesRaw[i];
      const questionId = typeof r.questionId === "string" ? r.questionId.trim() : "";
      const questionText = typeof r.questionText === "string" ? r.questionText.trim() : "";
      const dimension = typeof r.dimension === "string" ? r.dimension.trim() : "";
      const value =
        typeof r.value === "number"
          ? r.value
          : typeof r.value === "string"
            ? Number(r.value)
            : NaN;

      if (!questionId) {
        return Response.json({ ok: false, error: `responses[${i}].questionId is required` }, { status: 400 });
      }
      if (!questionText) {
        return Response.json({ ok: false, error: `responses[${i}].questionText is required` }, { status: 400 });
      }
      if (!DIM_SET.has(dimension)) {
        return Response.json({ ok: false, error: `responses[${i}].dimension is invalid` }, { status: 400 });
      }
      if (!Number.isFinite(value) || value < 1 || value > 5) {
        return Response.json({ ok: false, error: `responses[${i}].value must be 1-5` }, { status: 400 });
      }

      responses.push({
        questionId,
        questionText,
        dimension: dimension as Dimension,
        value: Math.round(value),
      });
    }

    // Validate respondent.
    const respondent = (body.respondent ?? {}) as Record<string, unknown>;
    const respondentEmail =
      typeof respondent.email === "string" ? respondent.email.trim() : "";
    if (!respondentEmail || !EMAIL_RE.test(respondentEmail)) {
      return Response.json({ ok: false, error: "respondent.email is required and must be valid" }, { status: 400 });
    }
    const consentContact = respondent.consentContact === true;

    const respondentName =
      typeof respondent.name === "string" && respondent.name.trim().length > 0
        ? respondent.name.trim()
        : null;
    const companyName =
      typeof respondent.company === "string" && respondent.company.trim().length > 0
        ? respondent.company.trim()
        : null;
    const companySize =
      typeof respondent.companySize === "string" && respondent.companySize.trim().length > 0
        ? respondent.companySize.trim()
        : null;
    const industry =
      typeof respondent.industry === "string" && respondent.industry.trim().length > 0
        ? respondent.industry.trim()
        : null;
    const country =
      typeof respondent.country === "string" && respondent.country.trim().length > 0
        ? respondent.country.trim()
        : null;
    const role =
      typeof respondent.role === "string" && respondent.role.trim().length > 0
        ? respondent.role.trim()
        : null;

    const durationSec =
      typeof body.durationSec === "number" && Number.isFinite(body.durationSec) && body.durationSec >= 0
        ? Math.round(body.durationSec)
        : null;

    // ---- Compute scores server-side (authoritative) ----
    const byDim: Record<Dimension, number[]> = {
      strategy: [],
      technology: [],
      culture: [],
      data: [],
      operations: [],
    };
    const allValues: number[] = [];
    for (const r of responses) {
      byDim[r.dimension].push(r.value);
      allValues.push(r.value);
    }

    const dimAvg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
    const norm = (avg: number) => clamp(Math.round(((avg - 1) / 4) * 100), 0, 100);

    const strategyScore = norm(dimAvg(byDim.strategy));
    const technologyScore = norm(dimAvg(byDim.technology));
    const cultureScore = norm(dimAvg(byDim.culture));
    const dataScore = norm(dimAvg(byDim.data));
    const operationsScore = norm(dimAvg(byDim.operations));
    const overallScore = norm(dimAvg(allValues));
    const tier = scoreToTier(overallScore);
    const questionCount = responses.length;

    // ---- Build responses JSON object ----
  const responsesJson: Record<string, number> = {}
  for (const r of responses) {
    responsesJson[r.questionId] = r.value
  }
  
  // ---- Persist Assessment with JSON responses in one create ----
  const created = await db.assessment.create({
    data: {
      respondentName,
      respondentEmail,
      companyName,
      companySize,
      industry,
      country,
      role,
      consentContact,
      overallScore,
      strategyScore,
      technologyScore,
      cultureScore,
      dataScore,
      operationsScore,
      tier,
      questionCount,
      durationSec,
      responses: responsesJson,
    },
  });

    // ---- Percentile vs other assessments (excluding self) ----
    const totalOthers = await db.assessment.count({
      where: { id: { not: created.id } },
    });
    let percentile: number;
    if (totalOthers === 0) {
      percentile = 50;
    } else {
      const lowerOrEqualOthers = await db.assessment.count({
        where: {
          id: { not: created.id },
          overallScore: { lte: overallScore },
        },
      });
      percentile = Math.round((lowerOrEqualOthers / totalOthers) * 100);
    }

    return Response.json(
      {
        id: created.id,
        overall: created.overallScore,
        scores: {
          strategy: created.strategyScore,
          technology: created.technologyScore,
          culture: created.cultureScore,
          data: created.dataScore,
          operations: created.operationsScore,
        },
        tier: created.tier,
        percentile,
        questionCount: created.questionCount,
        createdAt: created.createdAt.toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/assessment] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
