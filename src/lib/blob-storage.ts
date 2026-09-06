import { put, del } from "@vercel/blob";
import { randomUUID } from "node:crypto";

/**
 * Object storage for uploaded CV/résumé files.
 *
 * Why: CareerApplication.resume previously held the full `data:<mime>;base64,...`
 * string (up to ~5MB/applicant). On Neon's free tier (~512MB) roughly 75 CVs could
 * exhaust the entire database, and every admin careers/dashboard load re-serialized
 * those blobs. We now upload to Vercel Blob and store only the public URL.
 *
 * Provisioning: set BLOB_READ_WRITE_TOKEN (injected automatically by the Vercel
 * Blob store integration). Without it, uploads are REJECTED rather than falling
 * back to base64-in-Postgres, so the storage risk can never silently return.
 */

const EXT_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "doc",
};

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN.trim());
}

/** Uploads decoded resume bytes and returns the public blob URL to persist. */
export async function storeResume(
  buffer: Buffer,
  mime: string
): Promise<string> {
  if (!blobConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }
  const ext = EXT_BY_MIME[mime] ?? "bin";
  const blob = await put(`resumes/${randomUUID()}.${ext}`, buffer, {
    access: "public",
    contentType: mime,
  });
  return blob.url;
}

/** Best-effort delete of a stored resume; only touches our own blob host. */
export async function deleteResumeByUrl(url: string | null | undefined): Promise<void> {
  if (!url || !isBlobUrl(url) || !blobConfigured()) return;
  try {
    await del(url);
  } catch (err) {
    // Orphaned blobs are a storage leak, not a correctness issue - log and move on.
    console.warn("[blob-storage] failed to delete resume blob:", err instanceof Error ? err.message : err);
  }
}

export function isBlobUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host.endsWith(".blob.vercel-storage.com") || host.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/** Decodes a `data:<mime>;base64,<data>` URL (used for legacy inline rows on download). */
export function decodeDataUrl(dataUrl: string): { buffer: Buffer; mime: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  try {
    return { buffer: Buffer.from(match[2], "base64"), mime: match[1] };
  } catch {
    return null;
  }
}
