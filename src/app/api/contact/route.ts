// POST /api/contact — capture a contact inquiry from the public contact form.
// Validates name/email/message, defaults topic to "general", persists to ContactInquiry.

import { db } from "@/lib/db";
import { optionalSanitizedText, protectPublicPost, rejectOversizedBody, sanitizeText, validateTextLengths } from "@/lib/request-security";

const VALID_TOPICS = new Set(["general", "services", "framework", "other"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const blocked = protectPublicPost(req, "contact", 5);
  if (blocked) return blocked;
  const oversized = rejectOversizedBody(req, 32 * 1024);
  if (oversized) return oversized;
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
    }

    const name = typeof body.name === "string" ? sanitizeText(body.name) : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? sanitizeText(body.message) : "";
    const company = optionalSanitizedText(body.company);
    const phone = optionalSanitizedText(body.phone);
    const topic =
      typeof body.topic === "string" && VALID_TOPICS.has(body.topic)
        ? body.topic
        : "general";

    const textError = validateTextLengths({ name, email, company, phone, topic, message });
    if (textError) return Response.json({ ok: false, error: textError }, { status: 400 });

    if (!name) {
      return Response.json({ ok: false, error: "name is required" }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return Response.json({ ok: false, error: "valid email is required" }, { status: 400 });
    }
    if (!message) {
      return Response.json({ ok: false, error: "message is required" }, { status: 400 });
    }

    const created = await db.contactInquiry.create({
      data: { name, email, company, phone, topic, message },
    });

    return Response.json({ ok: true, data: { id: created.id } }, { status: 200 });
  } catch (err) {
    console.error("[api/contact] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
