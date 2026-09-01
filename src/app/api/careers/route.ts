// POST /api/careers — capture a career application.
// Validates name/email/roleSlug/roleTitle, verifies CV upload magic bytes & size, persists to CareerApplication.

import { db } from "@/lib/db";
import { optionalSanitizedText, protectPublicPost, rejectOversizedBody, sanitizeText, validateTextLengths } from "@/lib/request-security";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB

function validateCvFile(resumeRaw: unknown): { ok: boolean; error?: string; sanitizedResume?: string } {
  if (!resumeRaw || typeof resumeRaw !== "string") {
    return { ok: true, sanitizedResume: undefined };
  }

  const str = resumeRaw.trim();
  if (!str) return { ok: true, sanitizedResume: undefined };

  // Expect data URL: data:<mime>;base64,<data>
  const match = str.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return { ok: false, error: "Invalid CV file format" };
  }

  const mime = match[1].toLowerCase();
  const base64Data = match[2];

  // Allowed MIMEs
  const isPdfMime = mime === "application/pdf";
  const isDocxMime =
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mime === "application/msword" ||
    mime === "application/x-docx" ||
    mime === "application/octet-stream";

  if (!isPdfMime && !isDocxMime) {
    return { ok: false, error: "Only PDF and DOCX files are allowed." };
  }

  const buffer = Buffer.from(base64Data, "base64");
  if (buffer.length > MAX_CV_SIZE) {
    return { ok: false, error: "File size exceeds maximum limit of 5MB." };
  }

  // Magic Byte Check
  if (isPdfMime) {
    // PDF Magic Bytes: %PDF- -> [0x25, 0x50, 0x44, 0x46]
    const header = buffer.subarray(0, 4).toString("utf-8");
    if (!header.startsWith("%PDF")) {
      return { ok: false, error: "Corrupted or invalid PDF file header." };
    }
  } else if (isDocxMime) {
    // DOCX Zip Container Magic Bytes: PK\x03\x04 -> [0x50, 0x4B, 0x03, 0x04]
    if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b || buffer[2] !== 0x03 || buffer[3] !== 0x04) {
      return { ok: false, error: "Corrupted or invalid DOCX file header." };
    }
  }

  return { ok: true, sanitizedResume: str };
}

export async function POST(req: Request) {
  const blocked = protectPublicPost(req, "careers", 5);
  if (blocked) return blocked;

  // Allow up to 8MB request body to handle base64 encoded CV files up to 5MB
  const oversized = rejectOversizedBody(req, 8 * 1024 * 1024);
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
    const message = optionalSanitizedText(body.message);
    const yearsExp =
      typeof body.yearsExp === "number" && Number.isFinite(body.yearsExp)
        ? Math.round(body.yearsExp)
        : null;

    // Validate CV upload
    const cvValidation = validateCvFile(body.resume);
    if (!cvValidation.ok) {
      return Response.json({ ok: false, error: cvValidation.error }, { status: 400 });
    }

    const textError = validateTextLengths(
      { name, email, phone, roleSlug, roleTitle, linkedin, message },
      { name: 200, email: 320, phone: 50, roleSlug: 200, roleTitle: 200, linkedin: 2048, message: 5000 }
    );
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
        message,
        resume: cvValidation.sanitizedResume || null,
      },
    });

    return Response.json({ ok: true, data: { id: created.id } }, { status: 200 });
  } catch (err) {
    console.error("[api/careers] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
