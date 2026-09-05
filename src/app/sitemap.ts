import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-config";

const PATHS = [
  "",
  "/#/about",
  "/#/services",
  "/#/internal-audit-outsourcing",
  "/#/internal-audit-co-sourcing",
  "/#/internal-audit-function-establishment",
  "/#/internal-audit-transformation",
  "/#/quality-assurance-and-improvement-program",
  "/#/framework-agreements",
  "/#/contact",
  "/#/careers",
  "/#/legal",
  "/#/benchmark-landing",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();

  return PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/#/services" || path === "/#/careers" || path === "/#/benchmark-landing" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : path === "/#/services" ? 0.9 : path === "/#/legal" ? 0.5 : 0.8,
  }));
}
