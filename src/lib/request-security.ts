const WINDOW_MS = 10 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LIMIT = 5;
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

type RateLimitEntry = { count: number; resetAt: number };
const requests = new Map<string, RateLimitEntry>();
const globalForSecurity = globalThis as typeof globalThis & {
  trenntLoginAttempts?: Map<string, RateLimitEntry>;
};
const loginAttempts = globalForSecurity.trenntLoginAttempts ?? new Map<string, RateLimitEntry>();
globalForSecurity.trenntLoginAttempts = loginAttempts;

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

function pruneLoginAttempts(now: number): void {
  for (const [key, entry] of loginAttempts) {
    if (entry.resetAt <= now) loginAttempts.delete(key);
  }
}

function loginKeys(request: NextAuthRequestLike | undefined, email: string): string[] {
  return [
    `ip:${loginClientIp(request)}`,
    `email:${email.trim().toLowerCase()}`,
  ];
}

export function isLoginRateLimited(
  request: NextAuthRequestLike | undefined,
  email: string
): boolean {
  const now = Date.now();
  pruneLoginAttempts(now);
  return loginKeys(request, email).some((key) => {
    const entry = loginAttempts.get(key);
    return entry !== undefined && entry.resetAt > now && entry.count >= LOGIN_LIMIT;
  });
}

export function recordLoginFailure(
  request: NextAuthRequestLike | undefined,
  email: string
): void {
  const now = Date.now();
  pruneLoginAttempts(now);
  for (const key of loginKeys(request, email)) {
    const entry = loginAttempts.get(key);
    if (!entry || entry.resetAt <= now) {
      loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    } else {
      entry.count += 1;
    }
  }
}

export function clearLoginFailures(
  request: NextAuthRequestLike | undefined,
  email: string
): void {
  for (const key of loginKeys(request, email)) loginAttempts.delete(key);
}

function allowedOrigins(): string[] {
  const configured = process.env.ALLOWED_FORM_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];
  const defaults = ["https://trennt.sa", "https://www.trennt.sa"];

  if (process.env.NODE_ENV !== "production") {
    defaults.push("http://localhost", "https://localhost", "http://127.0.0.1", "https://127.0.0.1");
  }

  return [...new Set([...defaults, ...configured])];
}

function hasAllowedOrigin(request: Request): boolean {
  const source = request.headers.get("origin") ?? request.headers.get("referer");
  if (!source) return false;

  try {
    const origin = new URL(source).origin;
    return allowedOrigins().some((allowed) => origin === allowed || origin.startsWith(`${allowed}:`));
  } catch {
    return false;
  }
}

function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export function protectPublicPost(request: Request, endpoint: string, limit: number): Response | null {
  if (!hasAllowedOrigin(request)) {
    return Response.json({ ok: false, error: "forbidden origin" }, { status: 403 });
  }

  const now = Date.now();
  const key = `${endpoint}:${clientIp(request)}`;
  const entry = requests.get(key);
  if (!entry || entry.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (entry.count >= limit) {
    return Response.json(
      { ok: false, error: "too many requests; please try again in 10 minutes" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)) } }
    );
  }

  entry.count += 1;
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
