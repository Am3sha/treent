// GET /api/assessment/[id] — fetch a single Assessment's full results, including
// all individual responses. Returns 404 if not found.
// NOTE: percentile was computed at submit time and is NOT persisted; it is omitted here
// (the submit-time response carries it; the frontend uses that).

import { db } from "@/lib/db";
import { BENCHMARK_QUESTIONS } from "@/lib/content";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return Response.json({ ok: false, error: "id is required" }, { status: 400 });
    }

    const assessment = await db.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      return Response.json({ ok: false, error: "not found" }, { status: 404 });
    }

    // Transform responses JSON to array format for frontend
    const responsesArray = BENCHMARK_QUESTIONS.map((q) => ({
      questionId: q.id,
      dimension: q.dimension,
      value: (assessment.responses as Record<string, number>)?.[q.id] || 0,
      questionText: q.prompt,
    }));

    return Response.json(
      {
        id: assessment.id,
        overall: assessment.overallScore,
        scores: {
          strategy: assessment.strategyScore,
          technology: assessment.technologyScore,
          culture: assessment.cultureScore,
          data: assessment.dataScore,
          operations: assessment.operationsScore,
        },
        tier: assessment.tier,
        questionCount: assessment.questionCount,
        durationSec: assessment.durationSec,
        createdAt: assessment.createdAt.toISOString(),
        respondent: {
          name: assessment.respondentName,
          company: assessment.companyName,
          companySize: assessment.companySize,
          industry: assessment.industry,
          role: assessment.role,
        },
        responses: responsesArray,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/assessment/[id]] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
