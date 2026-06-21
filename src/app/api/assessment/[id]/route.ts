// GET /api/assessment/[id] — fetch a single Assessment's full results, including
// all individual responses. Returns 404 if not found.
// NOTE: percentile was computed at submit time and is NOT persisted; it is omitted here
// (the submit-time response carries it; the frontend uses that).

import { db } from "@/lib/db";

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
      include: { responses: true },
    });

    if (!assessment) {
      return Response.json({ ok: false, error: "not found" }, { status: 404 });
    }

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
        responses: assessment.responses.map((r) => ({
          questionId: r.questionId,
          dimension: r.dimension,
          value: r.value,
          questionText: r.questionText,
        })),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/assessment/[id]] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
