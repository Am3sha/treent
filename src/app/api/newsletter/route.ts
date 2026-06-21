// POST /api/newsletter — subscribe an email to the newsletter.
// On duplicate email (P2002) returns 200 with alreadySubscribed:true instead of erroring.

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source =
      typeof body.source === "string" && body.source.trim().length > 0
        ? body.source.trim()
        : "footer";

    if (!email || !EMAIL_RE.test(email)) {
      return Response.json({ ok: false, error: "valid email is required" }, { status: 400 });
    }

    try {
      const created = await db.newsletterSubscriber.create({
        data: { email, source },
      });
      return Response.json({ ok: true, id: created.id }, { status: 200 });
    } catch (err) {
      // Prisma unique-constraint violation code (P2002): email already subscribed.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const existing = await db.newsletterSubscriber.findUnique({
          where: { email },
        });
        return Response.json(
          { ok: true, alreadySubscribed: true, id: existing?.id ?? null },
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
