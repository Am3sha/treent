// GET /api/assessment/[id] — fetch a single Assessment's non-sensitive results.
// This endpoint remains public for compatibility, but never returns respondent PII
// or individual responses. Full records are available only through authenticated admin APIs.
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
    });

    if (!assessment) {
      return Response.json({ ok: false, error: "not found" }, { status: 404 });
    }

    return Response.json(
      { ok: true, reporting: {
        id: assessment.id,
        overall: assessment.overallScore,
        scores: {
          governance: assessment.governanceScore,
          risk: assessment.riskScore,
          execution: assessment.executionScore,
          reporting: assessment.reportingScore,
          capability: assessment.capabilityScore,
        },
        tier: assessment.tier,
        questionCount: assessment.questionCount,
        durationSec: assessment.durationSec,
        createdAt: assessment.createdAt.toISOString(),
      } },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/assessment/[id]] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
