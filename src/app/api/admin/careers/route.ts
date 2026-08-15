import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const careers = await db.careerApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ ok: true, data: careers });
  } catch (error) {
    console.error("[Careers API Error]:", error);
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
      resource: "careerApplication",
      id,
      timestamp: new Date().toISOString(),
    });

    await db.careerApplication.delete({
      where: { id },
    });

    return Response.json({ ok: true, data: { success: true } });
  } catch (error) {
    console.error("[Careers DELETE API Error]:", error);
    return Response.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
