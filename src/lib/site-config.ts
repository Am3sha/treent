/**
 * Central site configuration utility for TRENNT.
 * Serves as the single source of truth for site URL, domain name, public contact email, and CORS/allowed origins.
 */

const DEFAULT_SITE_URL = "https://trennt.net";

/**
 * Returns the primary public website URL without a trailing slash.
 * Single source of truth: NEXT_PUBLIC_SITE_URL
 */
export function getSiteUrl(): string {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!envUrl) return DEFAULT_SITE_URL;
    const trimmed = envUrl.trim().replace(/^["']|["']$/g, "");
    return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

/**
 * Returns the site domain hostname (e.g., "trennt.net" or "trennt.sa").
 */
export function getSiteDomain(): string {
    try {
        const url = new URL(getSiteUrl());
        return url.hostname.replace(/^www\./i, "");
    } catch {
        return "trennt.net";
    }
}

/**
 * Returns the site domain hostname formatted for display (e.g., "trennt.net" or "trennt.sa").
 */
export function getDisplayDomain(): string {
    return getSiteDomain();
}

/**
 * Returns the primary public site contact email.
 * Single source of truth: NEXT_PUBLIC_SITE_EMAIL, falling back to info@{siteDomain}.
 */
export function getSiteEmail(): string {
    const envEmail = process.env.NEXT_PUBLIC_SITE_EMAIL;
    if (envEmail) {
        return envEmail.trim().replace(/^["']|["']$/g, "");
    }
    return `info@${getSiteDomain()}`;
}

/**
 * Returns an array of allowed origins for public form submissions (contact, newsletter, careers, benchmark).
 * Automatically incorporates NEXT_PUBLIC_SITE_URL (with www and non-www variants),
 * ALLOWED_FORM_ORIGINS env var, NEXTAUTH_URL, and local dev origins.
 */
export function getAllowedOrigins(): string[] {
    const siteUrl = getSiteUrl();
    const origins = new Set<string>();

    // Primary site URL
    origins.add(siteUrl);

    try {
        const parsed = new URL(siteUrl);
        const host = parsed.hostname;
        const protocol = parsed.protocol;
        // Add www variant if non-www, or non-www variant if www
        if (host.startsWith("www.")) {
            origins.add(`${protocol}//${host.slice(4)}`);
        } else {
            origins.add(`${protocol}//www.${host}`);
        }
    } catch {
        // ignore parse failure
    }

    // Configured origins from ALLOWED_FORM_ORIGINS env
    const rawFormOrigins = process.env.ALLOWED_FORM_ORIGINS;
    if (rawFormOrigins) {
        const split = rawFormOrigins.split(",");
        for (const item of split) {
            const trimmed = item.trim().replace(/^["']|["']$/g, "");
            if (trimmed) {
                origins.add(trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed);
            }
        }
    }

    // NextAuth URL if defined
    const authUrl = process.env.NEXTAUTH_URL;
    if (authUrl) {
        const trimmed = authUrl.trim().replace(/^["']|["']$/g, "");
        if (trimmed) {
            origins.add(trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed);
        }
    }

    // Development defaults
    if (process.env.NODE_ENV !== "production") {
        origins.add("http://localhost");
        origins.add("https://localhost");
        origins.add("http://localhost:3000");
        origins.add("http://127.0.0.1");
        origins.add("http://127.0.0.1:3000");
    }

    return Array.from(origins);
}
