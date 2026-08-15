import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ ok: true, data: subscribers });
  } catch (error) {
    console.error("[Newsletter API Error]:", error);
    return Response.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return Response.json({ ok: false, error: "Missing id parameter" }, { status: 400 });
    }

    console.warn("[ADMIN AUDIT]", {
      admin: session.user?.email ?? session.user?.id ?? "unknown",
      action: "delete",
      resource: "newsletterSubscriber",
      id,
      timestamp: new Date().toISOString(),
    });

    await db.newsletterSubscriber.delete({
      where: { id },
    });

      return Response.json({ ok: true, data: { success: true } });
  } catch (error) {
    console.error("[Newsletter DELETE API Error]:", error);
    return Response.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
