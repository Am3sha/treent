import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-config";
import { SITEMAP_VIEWS } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();

  return SITEMAP_VIEWS.map(({ view, changeFrequency, priority }) => ({
    url: view === "home" ? `${baseUrl}/` : `${baseUrl}/#/${view}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
