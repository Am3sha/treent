import {
  LOGIN_LIMIT,
  checkPublicRateLimit,
  clearLoginAttempts,
  loginAttemptCount,
  recordLoginAttempt,
} from "./rate-limit";

const PUBLIC_WINDOW_SEC = 10 * 60;
const DEFAULT_TEXT_LIMITS: Record<string, number> = {
  name: 200,
  email: 320,
  company: 200,
  phone: 50,
  roleSlug: 200,
  roleTitle: 200,
  interest: 50,
  topic: 50,
  linkedin: 2048,
  portfolio: 2048,
  resume: 4096,
  message: 5000,
};

// Rate-limit counters live in src/lib/rate-limit.ts (Upstash Redis with an
// in-memory fallback). This module only adds the origin gate + IP/identity
// key derivation on top of them.

export function rejectOversizedBody(request: Request, maxBytes: number): Response | null {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number.isFinite(Number(contentLength)) && Number(contentLength) > maxBytes) {
    return Response.json({ ok: false, error: "request body is too large" }, { status: 400 });
  }
  return null;
}

export function validateTextLengths(
  fields: Record<string, unknown>,
  limits: Record<string, number> = DEFAULT_TEXT_LIMITS
): string | null {
  for (const [field, value] of Object.entries(fields)) {
    const limit = limits[field];
    if (limit !== undefined && typeof value === "string" && value.length > limit) {
      return `${field} exceeds maximum length of ${limit} characters`;
    }
  }
  return null;
}

type NextAuthRequestLike = {
  headers?: Headers | Record<string, string | string[] | undefined>;
};

function headerValue(request: NextAuthRequestLike | undefined, name: string): string | undefined {
  const headers = request?.headers;
  if (!headers) return undefined;
  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name) ?? undefined;
  }
  const value = (headers as Record<string, string | string[] | undefined>)[name]
    ?? (headers as Record<string, string | string[] | undefined>)[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function loginClientIp(request: NextAuthRequestLike | undefined): string {
  return headerValue(request, "x-forwarded-for")?.split(",")[0]?.trim()
    || headerValue(request, "x-real-ip")
    || "unknown";
}

function loginKeys(request: NextAuthRequestLike | undefined, email: string): string[] {
  return [
    `ip:${loginClientIp(request)}`,
    `email:${email.trim().toLowerCase()}`,
  ];
}

export async function isLoginRateLimited(
  request: NextAuthRequestLike | undefined,
  email: string
): Promise<boolean> {
  const counts = await Promise.all(loginKeys(request, email).map((key) => loginAttemptCount(key)));
  return counts.some((count) => count >= LOGIN_LIMIT);
}

export async function recordLoginFailure(
  request: NextAuthRequestLike | undefined,
  email: string
): Promise<void> {
  await Promise.all(loginKeys(request, email).map((key) => recordLoginAttempt(key)));
}

export async function clearLoginFailures(
  request: NextAuthRequestLike | undefined,
  email: string
): Promise<void> {
  await Promise.all(loginKeys(request, email).map((key) => clearLoginAttempts(key)));
}

import { getAllowedOrigins } from "./site-config";

function allowedOrigins(): string[] {
  return getAllowedOrigins();
}

function hasAllowedOrigin(request: Request): boolean {
  const originHeader = request.headers.get("origin");
  const refererHeader = request.headers.get("referer");
  const source = originHeader ?? refererHeader;

  if (!source) {
    console.warn("[origin] no origin/referer header — blocking");
    return false;
  }

  try {
    const origin = new URL(source).origin;
    const allowed = allowedOrigins();
    const matched = allowed.some((allowedOrigin) => origin === allowedOrigin || origin.startsWith(`${allowedOrigin}:`));

    return matched;
  } catch {
    console.warn("[origin] failed to parse source as URL");
    return false;
  }
}

function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function protectPublicPost(
  request: Request,
  endpoint: string,
  limit: number
): Promise<Response | null> {
  if (!hasAllowedOrigin(request)) {
    return Response.json({ ok: false, error: "forbidden origin" }, { status: 403 });
  }

  const outcome = await checkPublicRateLimit(endpoint, clientIp(request), limit, PUBLIC_WINDOW_SEC);
  if (!outcome.allowed) {
    return Response.json(
      { ok: false, error: "too many requests; please try again in 10 minutes" },
      { status: 429, headers: { "Retry-After": String(outcome.retryAfterSec) } }
    );
  }
  return null;
}

/** Escapes user-provided text before persistence so later rendering cannot become stored XSS. */
export function sanitizeText(value: string): string {
  return value
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function optionalSanitizedText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const sanitized = sanitizeText(value);
  return sanitized || null;
}

/**
 * Normalizes a phone number to digits, spaces, dashes, parentheses, leading plus.
 * Returns null only if non-string; otherwise returns a sanitized, whitespace-trimmed phone string.
 * Rejects any input that contains disallowed characters after normalizing.
 */
export function sanitizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const cleaned = trimmed.replace(/[^\d+\s\-()]/g, "");
  if (cleaned.length !== trimmed.length) return null;
  return cleaned.replace(/\s+/g, " ").trim();
}
