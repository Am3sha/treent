// POST /api/newsletter — subscribe an email to the newsletter.
// On duplicate email (P2002) returns 200 with alreadySubscribed:true instead of erroring.

import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { protectPublicPost, rejectOversizedBody, sanitizeText, validateTextLengths } from "@/lib/request-security";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const blocked = protectPublicPost(req, "newsletter", 5);
  if (blocked) return blocked;
  const oversized = rejectOversizedBody(req, 16 * 1024);
  if (oversized) return oversized;
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source =
      typeof body.source === "string" && body.source.trim().length > 0
        ? sanitizeText(body.source)
        : "footer";

    const textError = validateTextLengths({ email, source }, { email: 320, source: 200 });
    if (textError) return Response.json({ ok: false, error: textError }, { status: 400 });

    if (!email || !EMAIL_RE.test(email)) {
      return Response.json({ ok: false, error: "valid email is required" }, { status: 400 });
    }

    try {
      const created = await db.newsletterSubscriber.create({
        data: { email, source },
      });
      return Response.json({ ok: true, data: { id: created.id } }, { status: 200 });
    } catch (err) {
      // Prisma unique-constraint violation code (P2002): email already subscribed.
      if (
        err instanceof PrismaClientKnownRequestError && 
        (err as PrismaClientKnownRequestError & { code?: string }).code === "P2002"
      ) {
        const existing = await db.newsletterSubscriber.findUnique({
          where: { email },
        });
        return Response.json(
          { ok: true, data: { alreadySubscribed: true, id: existing?.id ?? null } },
          { status: 200 }
        );
      }
      throw err;
    }
  } catch (err) {
    console.error("[api/newsletter] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
