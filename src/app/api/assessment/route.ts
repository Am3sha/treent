// POST /api/assessment — the core capture endpoint for the Internal Audit
// Capability Benchmark. Validates the respondent's answers, computes
// authoritative scores server-side via src/lib/benchmark-scoring.ts
// (per-domain + overall on the earned/78 x 100 scale), determines the
// maturity tier, computes a percentile against the existing benchmark
// dataset, and persists the Assessment with all individual
// AssessmentAnswer rows in a single nested create.
//
// SCORING (single source of truth: benchmark-scoring.ts)
//   Each question: A=3, B=2, C=1, D=0. Domain score = earned/max x 100,
//   where max points are governance 15, risk 15, execution 18,
//   reporting 15, capability 15 (total 78). Overall = earned/78 x 100.
//   Tier: initial (0-20), developing (21-40), defined (41-60),
//   established (61-80), advanced (81-100).
//   PERCENTILE: after inserting, count OTHER assessments with overallScore
//   <= this overall. percentile = (lowerOrEqualOthers / totalOthers) * 100,
//   rounded. If there are no other assessments yet, percentile = 50.

import { COMPANY_SIZES } from "@/lib/benchmark-constants";
import type { CompanySize } from "@/lib/benchmark-constants";
import { db } from "@/lib/db";
import {
  BENCHMARK_QUESTIONS,
  DOMAIN_MAX_POINTS,
  calculateOverallScore,
  getMaturityLevel,
  type AnswerRecord,
} from "@/lib/benchmark-scoring";
import {
  optionalSanitizedText,
  protectPublicPost,
  rejectOversizedBody,
  sanitizeText,
  validateTextLengths,
} from "@/lib/request-security";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOMAINS = ["governance", "risk", "execution", "reporting", "capability"] as const;
type Domain = (typeof DOMAINS)[number];
const DOMAIN_SET = new Set<string>(DOMAINS);
const LETTERS = new Set(["A", "B", "C", "D"]);

interface IncomingAnswer {
  questionId?: unknown;
  selectedOption?: unknown;
  domain?: unknown;
  score?: unknown;
}

export async function POST(req: Request) {
  const blocked = protectPublicPost(req, "assessment", 3);
  if (blocked) return blocked;
  const oversized = rejectOversizedBody(req, 64 * 1024);
  if (oversized) return oversized;
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
    }

    const answersRaw = Array.isArray(body.answers) ? (body.answers as IncomingAnswer[]) : [];
    if (answersRaw.length === 0) {
      return Response.json({ ok: false, error: "answers must be a non-empty array" }, { status: 400 });
    }
    if (answersRaw.length !== BENCHMARK_QUESTIONS.length) {
      return Response.json(
        { ok: false, error: `answers must contain exactly ${BENCHMARK_QUESTIONS.length} questions` },
        { status: 400 }
      );
    }

    // Validate each answer against the canonical question set.
    const answers: AnswerRecord[] = [];
    const canonicalQuestions = new Map(BENCHMARK_QUESTIONS.map((q) => [q.id, q]));
    const seenQuestionIds = new Set<string>();
    for (let i = 0; i < answersRaw.length; i++) {
      const r = answersRaw[i];
      const questionId = typeof r.questionId === "string" ? sanitizeText(r.questionId) : "";
      const domain = typeof r.domain === "string" ? r.domain.trim() : "";
      const selectedOption =
        typeof r.selectedOption === "string" ? r.selectedOption.trim().toUpperCase() : "";

      const textError = validateTextLengths(
        { questionId, domain, selectedOption },
        { questionId: 100, domain: 50, selectedOption: 5 },
      );
      if (textError) {
        return Response.json({ ok: false, error: `answers[${i}].${textError}` }, { status: 400 });
      }

      if (!questionId) {
        return Response.json({ ok: false, error: `answers[${i}].questionId is required` }, { status: 400 });
      }
      const canonicalQuestion = canonicalQuestions.get(questionId);
      if (!canonicalQuestion) {
        return Response.json({ ok: false, error: `answers[${i}].questionId is invalid` }, { status: 400 });
      }
      if (seenQuestionIds.has(questionId)) {
        return Response.json({ ok: false, error: `answers[${i}].questionId is duplicated` }, { status: 400 });
      }
      seenQuestionIds.add(questionId);
      if (!DOMAIN_SET.has(domain)) {
        return Response.json({ ok: false, error: `answers[${i}].domain is invalid` }, { status: 400 });
      }
      if (canonicalQuestion.domain !== domain) {
        return Response.json({ ok: false, error: `answers[${i}].domain does not match questionId` }, { status: 400 });
      }
      if (!LETTERS.has(selectedOption) || !canonicalQuestion.options.some((o) => o.letter === selectedOption)) {
        return Response.json(
          { ok: false, error: `answers[${i}].selectedOption must be one of the question's valid options` },
          { status: 400 },
        );
      }

      answers.push({
        questionId,
        domain: domain as Domain,
        selectedOption,
        score: canonicalQuestion.options.find((o) => o.letter === selectedOption)?.score ?? 0,
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

    const respondentName = optionalSanitizedText(respondent.name);
    const companyName = optionalSanitizedText(respondent.company);
    const companySize = optionalSanitizedText(respondent.companySize);
    if (companySize && !COMPANY_SIZES.includes(companySize as CompanySize)) {
      return Response.json(
        { ok: false, error: "Invalid companySize" },
        { status: 400 },
      );
    }
    const companySizeTyped = companySize ? (companySize as CompanySize) : undefined;
    const industry = optionalSanitizedText(respondent.industry);
    const country = optionalSanitizedText(respondent.country);
    const role = optionalSanitizedText(respondent.role);

    const textError = validateTextLengths(
      {
        respondentName,
        respondentEmail,
        company: companyName,
        companySize,
        industry,
        country,
        role,
      },
      {
        respondentName: 200,
        respondentEmail: 320,
        company: 200,
        companySize: 100,
        industry: 200,
        country: 100,
        role: 200,
      },
    );
    if (textError) return Response.json({ ok: false, error: textError }, { status: 400 });

    const durationSec =
      typeof body.durationSec === "number" && Number.isFinite(body.durationSec) && body.durationSec >= 0
        ? Math.round(body.durationSec)
        : null;

    // ---- Compute scores server-side (authoritative, single source of truth) ----
    const overallScore = Math.round(calculateOverallScore(answers));
    const tier = getMaturityLevel(overallScore).level;
    const domainScores: Record<Domain, number> = {
      governance: 0,
      risk: 0,
      execution: 0,
      reporting: 0,
      capability: 0,
    };
    for (const a of answers) {
      domainScores[a.domain as Domain] += a.score;
    }
    const governanceScore = Math.round((domainScores.governance / DOMAIN_MAX_POINTS.governance) * 100);
    const riskScore = Math.round((domainScores.risk / DOMAIN_MAX_POINTS.risk) * 100);
    const executionScore = Math.round((domainScores.execution / DOMAIN_MAX_POINTS.execution) * 100);
    const reportingScore = Math.round((domainScores.reporting / DOMAIN_MAX_POINTS.reporting) * 100);
    const capabilityScore = Math.round((domainScores.capability / DOMAIN_MAX_POINTS.capability) * 100);
    const questionCount = answers.length;

    // ---- Persist Assessment with all individual answers in one nested create ----
    const created = await db.assessment.create({
      data: {
        respondentName,
        respondentEmail,
        companyName,
        companySize: companySizeTyped,
        industry,
        country,
        role,
        consentContact,
        overallScore,
        governanceScore,
        riskScore,
        executionScore,
        reportingScore,
        capabilityScore,
        tier,
        questionCount,
        durationSec,
        answers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            domain: a.domain,
            selectedOption: a.selectedOption ?? "",
            score: a.score,
          })),
        },
      },
    });

    // ---- Percentile vs other assessments (excluding self) ----
    const [totalOthers, lowerOrEqualOthers] = await Promise.all([
      db.assessment.count({
        where: { id: { not: created.id } },
      }),
      db.assessment.count({
        where: {
          id: { not: created.id },
          overallScore: { lte: overallScore },
        },
      }),
    ]);
    let percentile: number;
    if (totalOthers === 0) {
      percentile = 50;
    } else {
      percentile = Math.round((lowerOrEqualOthers / totalOthers) * 100);
    }

    return Response.json(
      {
        ok: true,
        data: {
          id: created.id,
          overall: created.overallScore,
          scores: {
            governance: created.governanceScore,
            risk: created.riskScore,
            execution: created.executionScore,
            reporting: created.reportingScore,
            capability: created.capabilityScore,
          },
          tier: created.tier,
          percentile,
          questionCount: created.questionCount,
          createdAt: created.createdAt.toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[api/assessment] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
