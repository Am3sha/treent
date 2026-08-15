// POST /api/careers — capture a career application.
// Validates name/email/roleSlug/roleTitle, persists to CareerApplication.

import { db } from "@/lib/db";
import { optionalSanitizedText, protectPublicPost, rejectOversizedBody, sanitizeText, validateTextLengths } from "@/lib/request-security";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const blocked = protectPublicPost(req, "careers", 5);
  if (blocked) return blocked;
  const oversized = rejectOversizedBody(req, 64 * 1024);
  if (oversized) return oversized;
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
    }

    const name = typeof body.name === "string" ? sanitizeText(body.name) : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const roleSlug = typeof body.roleSlug === "string" ? sanitizeText(body.roleSlug) : "";
    const roleTitle = typeof body.roleTitle === "string" ? sanitizeText(body.roleTitle) : "";

    const phone = optionalSanitizedText(body.phone);
    const linkedin = optionalSanitizedText(body.linkedin);
    const portfolio = optionalSanitizedText(body.portfolio);
    const message = optionalSanitizedText(body.message);
    const resume = optionalSanitizedText(body.resume);
    const yearsExp =
      typeof body.yearsExp === "number" && Number.isFinite(body.yearsExp)
        ? Math.round(body.yearsExp)
        : null;

    const textError = validateTextLengths({ name, email, phone, roleSlug, roleTitle, linkedin, portfolio, message, resume });
    if (textError) return Response.json({ ok: false, error: textError }, { status: 400 });

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

    return Response.json({ ok: true, data: { id: created.id } }, { status: 200 });
  } catch (err) {
    console.error("[api/careers] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
