import type { MetadataRoute } from "next";

const BASE_URL = "https://trennt.sa";

const PUBLIC_URLS = [
  { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE_URL}/#/about`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/#/services`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE_URL}/#/internal-audit-outsourcing`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/#/internal-audit-co-sourcing`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/#/internal-audit-function-establishment`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/#/internal-audit-transformation`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/#/quality-assurance-and-improvement-program`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/#/framework-agreements`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/#/contact`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/#/careers`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/#/legal`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/#/benchmark-landing`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/#/benchmark-insights`, changeFrequency: "weekly", priority: 0.7 },
  // Quiz, results, and follow-up are session-specific benchmark flow states, not indexable destinations.
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return PUBLIC_URLS.map(({ url, changeFrequency, priority }) => ({
    url,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
