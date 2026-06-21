// POST /api/assessment/followup — capture a follow-up request from a respondent
// who has just completed the benchmark and wants to be contacted.
//
// Validation: name, email, interest, and a non-empty assessmentId are required.
// DECISION: assessmentId is REQUIRED here because the schema enforces the relation
// (AssessmentFollowUp.assessmentId is non-null). The frontend only shows the follow-up
// form AFTER the assessment has been submitted (so a result.id always exists). If an
// empty/missing assessmentId is sent we return 400 rather than synthesising a
// placeholder Assessment — that keeps the data clean.
// If a non-empty assessmentId is provided but doesn't exist, we also return 400.

import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_INTERESTS = new Set(["consultation", "report", "workshop", "partnership"]);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
    }

    const assessmentId =
      typeof body.assessmentId === "string" ? body.assessmentId.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const interest =
      typeof body.interest === "string" && VALID_INTERESTS.has(body.interest)
        ? body.interest
        : "";

    const company =
      typeof body.company === "string" && body.company.trim().length > 0
        ? body.company.trim()
        : null;
    const phone =
      typeof body.phone === "string" && body.phone.trim().length > 0
        ? body.phone.trim()
        : null;
    const message =
      typeof body.message === "string" && body.message.trim().length > 0
        ? body.message.trim()
        : null;

    if (!assessmentId) {
      return Response.json({ ok: false, error: "assessmentId required" }, { status: 400 });
    }
    if (!name) {
      return Response.json({ ok: false, error: "name is required" }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return Response.json({ ok: false, error: "valid email is required" }, { status: 400 });
    }
    if (!interest) {
      return Response.json({ ok: false, error: "interest is required (consultation | report | workshop | partnership)" }, { status: 400 });
    }

    // Verify the parent Assessment exists.
    const exists = await db.assessment.findUnique({ where: { id: assessmentId }, select: { id: true } });
    if (!exists) {
      return Response.json({ ok: false, error: "assessment not found" }, { status: 400 });
    }

    const created = await db.assessmentFollowUp.create({
      data: {
        assessmentId,
        name,
        email,
        company,
        phone,
        message,
        interest,
      },
    });

    return Response.json({ ok: true, id: created.id }, { status: 200 });
  } catch (err) {
    console.error("[api/assessment/followup] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
