import type { ViewKey } from "./types";

/**
 * Single source of truth for the public hash-router route table.
 * Keep ViewKey (src/lib/types.ts) and the VIEWS component map in
 * src/app/page.tsx in sync with this list - the Record<ViewKey, ...> typing
 * on VIEWS makes the compiler flag any drift.
 */
export const ALL_VIEWS = [
  "home",
  "about",
  "services",
  "internal-audit-outsourcing",
  "internal-audit-co-sourcing",
  "internal-audit-function-establishment",
  "internal-audit-transformation",
  "quality-assurance-and-improvement-program",
  "framework-agreements",
  "contact",
  "careers",
  "legal",
  "benchmark-landing",
  "benchmark-quiz",
  "benchmark-results",
  "benchmark-followup",
  "benchmark-insights",
  "not-found",
] as const satisfies readonly ViewKey[];

// Compile-time guard: every ViewKey must appear in ALL_VIEWS above. If a new
// view is added to types.ts but not listed here, this line fails `next build`.
export const ALL_VIEWS_COVERS_VIEW_KEY: [Exclude<ViewKey, (typeof ALL_VIEWS)[number]>] extends [never] ? true : {
  error: "ALL_VIEWS is missing routes declared in ViewKey";
  missing: Exclude<ViewKey, (typeof ALL_VIEWS)[number]>;
} = true;

export function isValidView(segment: string): segment is ViewKey {
  return (ALL_VIEWS as readonly string[]).includes(segment);
}

/**
 * Routes that should appear in sitemap.xml.
 * Excluded: not-found (branded 404), benchmark-results + benchmark-followup
 * (personal, post-submission pages), benchmark-insights (public view is
 * gated off by PUBLIC_BENCHMARK_INSIGHTS_ENABLED in src/app/page.tsx).
 */
export const SITEMAP_VIEWS: {
  view: ViewKey;
  changeFrequency: "weekly" | "monthly";
  priority: number;
}[] = [
  { view: "home", changeFrequency: "weekly", priority: 1.0 },
  { view: "about", changeFrequency: "monthly", priority: 0.8 },
  { view: "services", changeFrequency: "weekly", priority: 0.9 },
  { view: "internal-audit-outsourcing", changeFrequency: "monthly", priority: 0.8 },
  { view: "internal-audit-co-sourcing", changeFrequency: "monthly", priority: 0.8 },
  { view: "internal-audit-function-establishment", changeFrequency: "monthly", priority: 0.8 },
  { view: "internal-audit-transformation", changeFrequency: "monthly", priority: 0.8 },
  { view: "quality-assurance-and-improvement-program", changeFrequency: "monthly", priority: 0.8 },
  { view: "framework-agreements", changeFrequency: "monthly", priority: 0.8 },
  { view: "benchmark-landing", changeFrequency: "weekly", priority: 0.9 },
  { view: "benchmark-quiz", changeFrequency: "weekly", priority: 0.9 },
  { view: "contact", changeFrequency: "monthly", priority: 0.8 },
  { view: "careers", changeFrequency: "weekly", priority: 0.8 },
  { view: "legal", changeFrequency: "monthly", priority: 0.5 },
];
