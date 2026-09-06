import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { deleteResumeByUrl } from "@/lib/blob-storage";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Never ship the resume column in the list: new rows hold a small blob URL
    // but LEGACY rows can each hold up to ~5MB of base64. The CV is fetched on
    // demand through /api/admin/careers/resume?id=... (handles both forms).
    const [careers, rowsWithResume] = await Promise.all([
      db.careerApplication.findMany({
        orderBy: { createdAt: "desc" },
        omit: { resume: true },
      }),
      db.careerApplication.findMany({
        where: { resume: { not: null } },
        select: { id: true },
      }),
    ]);
    const hasResume = new Set(rowsWithResume.map((r) => r.id));
    const data = careers.map((c) => ({ ...c, resumeAvailable: hasResume.has(c.id) }));
    return Response.json({ ok: true, data });
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

    const existing = await db.careerApplication.findUnique({
      where: { id },
      select: { resume: true },
    });

    await db.careerApplication.delete({
      where: { id },
    });

    // Best-effort: drop the stored file so deleted applications don't leak blobs.
    await deleteResumeByUrl(existing?.resume);

    return Response.json({ ok: true, data: { success: true } });
  } catch (error) {
    console.error("[Careers DELETE API Error]:", error);
    return Response.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
