// POST /api/contact — capture a contact inquiry from the public contact form.
// Validates name/email/message, defaults topic to "general", persists to ContactInquiry.

import { db } from "@/lib/db";

const VALID_TOPICS = new Set(["general", "services", "partnership", "press"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const company =
      typeof body.company === "string" && body.company.trim().length > 0
        ? body.company.trim()
        : null;
    const phone =
      typeof body.phone === "string" && body.phone.trim().length > 0
        ? body.phone.trim()
        : null;
    const topic =
      typeof body.topic === "string" && VALID_TOPICS.has(body.topic)
        ? body.topic
        : "general";

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

    return Response.json({ ok: true, id: created.id }, { status: 200 });
  } catch (err) {
    console.error("[api/contact] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
