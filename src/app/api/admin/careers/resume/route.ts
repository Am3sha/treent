// GET /api/admin/careers/resume?id=<applicationId> — authenticated CV download.
// Serves both storage eras: NEW rows store a Vercel Blob public URL (we 307
// redirect to it); LEGACY rows may still contain an inline data:<mime>;base64
// URL (we decode and stream it as an attachment). Kept out of the careers list
// payload so one page load of /admin/careers never serializes megabytes of CVs.

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { decodeDataUrl, isBlobUrl } from "@/lib/blob-storage";

const MIME_EXTENSIONS: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/x-docx": "docx",
  "application/octet-stream": "bin",
};

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
      return Response.json({ ok: false, error: "Missing id parameter" }, { status: 400 });
    }

    const application = await db.careerApplication.findUnique({
      where: { id },
      select: { resume: true, name: true, roleSlug: true },
    });
    if (!application || !application.resume) {
      return Response.json({ ok: false, error: "not found" }, { status: 404 });
    }

    const safeBase = `cv-${(application.roleSlug || application.name || "applicant").replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 60)}`;

    // New-style: stored object URL -> redirect straight to the blob CDN.
    if (!application.resume.startsWith("data:") && /^https?:\/\//.test(application.resume)) {
      if (!isBlobUrl(application.resume)) {
        // Unknown external URL — do not redirect to it from an authenticated context.
        return Response.json({ ok: false, error: "invalid stored resume url" }, { status: 500 });
      }
      return Response.redirect(application.resume.toString(), 307);
    }

    // Legacy inline base64 data URL.
    const decoded = decodeDataUrl(application.resume);
    if (!decoded) {
      return Response.json({ ok: false, error: "stored resume could not be decoded" }, { status: 500 });
    }
    const ext = MIME_EXTENSIONS[decoded.mime] ?? "bin";
    return new Response(new Uint8Array(decoded.buffer), {
      status: 200,
      headers: {
        "Content-Type": decoded.mime,
        "Content-Disposition": `attachment; filename="${safeBase}.${ext}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[Careers Resume Download API Error]:", error);
    return Response.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
