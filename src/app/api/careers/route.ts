// POST /api/careers — capture a career application.
// Validates name/email/roleSlug/roleTitle, persists to CareerApplication.

import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const roleSlug = typeof body.roleSlug === "string" ? body.roleSlug.trim() : "";
    const roleTitle = typeof body.roleTitle === "string" ? body.roleTitle.trim() : "";

    const phone =
      typeof body.phone === "string" && body.phone.trim().length > 0
        ? body.phone.trim()
        : null;
    const linkedin =
      typeof body.linkedin === "string" && body.linkedin.trim().length > 0
        ? body.linkedin.trim()
        : null;
    const portfolio =
      typeof body.portfolio === "string" && body.portfolio.trim().length > 0
        ? body.portfolio.trim()
        : null;
    const message =
      typeof body.message === "string" && body.message.trim().length > 0
        ? body.message.trim()
        : null;
    const resume =
      typeof body.resume === "string" && body.resume.trim().length > 0
        ? body.resume.trim()
        : null;
    const yearsExp =
      typeof body.yearsExp === "number" && Number.isFinite(body.yearsExp)
        ? Math.round(body.yearsExp)
        : null;

    if (!name) {
      return Response.json({ ok: false, error: "name is required" }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return Response.json({ ok: false, error: "valid email is required" }, { status: 400 });
    }
    if (!roleSlug) {
      return Response.json({ ok: false, error: "roleSlug is required" }, { status: 400 });
    }
    if (!roleTitle) {
      return Response.json({ ok: false, error: "roleTitle is required" }, { status: 400 });
    }

    const created = await db.careerApplication.create({
      data: {
        name,
        email,
        phone,
        roleSlug,
        roleTitle,
        yearsExp,
        linkedin,
        portfolio,
        message,
        resume,
      },
    });

    return Response.json({ ok: true, id: created.id }, { status: 200 });
  } catch (err) {
    console.error("[api/careers] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
