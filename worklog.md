# Meridian Advisory — Project Worklog

This is the single shared worklog for the Meridian Advisory company website + built-in
Digital Maturity Benchmark tool. All agents MUST read this before working and append
their own section (starting with `---`) after finishing.

---
Task ID: 1
Agent: main (orchestrator)
Task: Foundation — theme, Prisma schema, shared types, Zustand nav store, content data, layout shell (header/footer), page router, dev server.

Work Log:
- Explored project scaffold (Next.js 16, shadcn/ui, Prisma/SQLite, zustand, framer-motion, recharts).
- Designed brand: "Meridian Advisory" — strategic advisory & digital transformation consultancy.
  Benchmark tool = "Digital Maturity Benchmark" (5 dimensions × 3 questions = 15 questions).
- Rewrote `src/app/globals.css` with a sophisticated emerald + amber palette (no indigo/blue),
  warm parchment background, refined scrollbars, grid/radial utilities.
- Rewrote `prisma/schema.prisma` with models: ContactInquiry, CareerApplication,
  NewsletterSubscriber, Assessment, AssessmentResponse, AssessmentFollowUp. Ran `bun run db:push` successfully.
- Created `src/lib/types.ts` — shared TypeScript contracts (ViewKey, Dimension, BenchmarkQuestion,
  AssessmentResult, MaturityTier, RespondentProfile, BenchmarkStats, ServiceItem, CareerItem, etc.).
- Created `src/lib/content.ts` — all company content: COMPANY, STATS, SERVICES (6), METHODOLOGY (4),
  LEADERSHIP (6), TESTIMONIALS (3), CASE_STUDIES (3), CAREERS (5), PERKS (6), DIMENSIONS (5),
  BENCHMARK_QUESTIONS (15), scoreToTier(), TIER_META.
- Created `src/lib/store.ts` — Zustand `useNav` store: view state (+ URL hash sync), assessment
  session (responses, respondent, result, startedAt), computeLocalScores() helper.
- Created `src/components/theme-provider.tsx` (next-themes wrapper) and updated `src/app/layout.tsx`
  with proper metadata + theme provider.
- Created site shell components: `logo.tsx` (SVG meridian mark), `icon.tsx` (dynamic lucide renderer),
  `theme-toggle.tsx`, `reveal.tsx` (framer-motion Reveal + Eyebrow + SectionHeading), `header.tsx`
  (sticky nav with desktop nav + mobile Sheet + benchmark CTA), `footer.tsx` (sticky footer with
  newsletter signup, nav columns, contact, socials).
- Created `src/app/page.tsx` — single-route router that renders one of 9 view components based on
  `useNav.view`, with hashchange sync and Suspense fallback. Footer is sticky (min-h-screen flex flex-col, footer mt-auto).
- Created 9 stub view files in `src/components/views/` so the project compiles; subagents will replace them.
- Configured `allowedDevOrigins` in `next.config.ts` to silence the preview cross-origin warning.
- Dev server running stably on port 3000 (launched via `setsid sh -c '... &'` to orphan to init).
  `GET /` returns HTTP 200.

Stage Summary:
- Foundation complete and compiling. Dev server healthy on :3000.
- Architecture decision: EVERYTHING lives under the `/` route. Navigation between the 9 "pages"
  (home, about, services, contact, careers, benchmark-landing, benchmark-quiz, benchmark-results,
  benchmark-followup) is driven by the `useNav` Zustand store, persisted to `location.hash`
  (e.g. `#/about`) so deep-linking + browser back/forward work.
- Benchmark flow: landing → quiz (15 questions across 5 dimensions) → respondent profile capture
  → submit to `/api/assessment` → results page (score, tier, percentile vs benchmark, per-dimension
  radar) → optional follow-up → `/api/assessment/followup`. All responses stored in `Assessment` +
  `AssessmentResponse` tables for aggregation/reporting.
- Contracts the subagents MUST follow:
  - Views are named exports in `src/components/views/<name>-view.tsx` (see page.tsx imports).
  - Navigate via `useNav((s) => s.navigate)(viewKey)` or `setView`. Read current view via `useNav((s) => s.view)`.
  - Assessment session: `useNav` exposes responses, setResponse, resetResponses, respondent,
    setRespondent, result, setResult, startAssessment, computeLocalScores.
  - Use existing shadcn/ui components from `@/components/ui/*`. Use `Icon` from
    `@/components/site/icon` for dynamic lucide icons by name (content uses string icon names).
  - Use `Reveal`, `Eyebrow`, `SectionHeading` from `@/components/site/reveal` for consistent animation.
  - Use `Logo` from `@/components/site/logo`. Color tokens: emerald primary, amber accent — NO indigo/blue.
  - Content lives in `@/lib/content` and types in `@/lib/types` — import from there, do not redefine.
- Next: dispatch subagents to build the 9 views (corporate + benchmark) and the backend APIs.

---
Task ID: 4
Agent: backend-api-builder
Task: Built all 7 backend API routes for the Meridian Advisory site + Digital Maturity Benchmark tool, matching the exact frontend contracts.

Work Log:
- Read worklog.md, prisma/schema.prisma, src/lib/db.ts, src/lib/types.ts, and src/lib/content.ts (scoreToTier reference) to align with the established architecture.
- Created `src/app/api/contact/route.ts` — POST contact inquiry. Validates name/email/message, defaults topic to "general", persists to ContactInquiry.
- Created `src/app/api/careers/route.ts` — POST career application. Validates name/email/roleSlug/roleTitle, persists to CareerApplication (optional phone, yearsExp, linkedin, portfolio, message, resume).
- Created `src/app/api/newsletter/route.ts` — POST newsletter subscribe. Validates email. Handles P2002 (unique email) by returning `{ ok:true, alreadySubscribed:true, id: existing.id }` instead of erroring. Normalises email to lowercase.
- Created `src/app/api/assessment/route.ts` — THE CORE capture endpoint.
  - Validates responses array (non-empty, each with questionId/value 1-5/dimension in {strategy,technology,culture,data,operations}/questionText).
  - Validates respondent.email (valid format); consentContact coerced to boolean.
  - Computes scores server-side (authoritative): per-dimension and overall via `norm(avg) = clamp(round(((avg-1)/4)*100), 0, 100)`. tier = inline `scoreToTier` (<35 Nascent, <55 Developing, <75 Established, else Leading) — re-implemented inline to avoid client/server boundary concerns with @/lib/content.
  - Single nested create: `db.assessment.create({ data: { ..., responses: { create: [...] } } })` — works fine with Prisma+SQLite.
  - Percentile computed AFTER insert (excluding self): if totalOthers=0 → 50, else round(lowerOrEqualOthers / totalOthers * 100). Returned in response (not persisted).
- Created `src/app/api/assessment/[id]/route.ts` — GET single Assessment including responses. Uses Next.js 16 pattern `params: Promise<{ id: string }>` and awaits it. Returns 404 if not found. percentile omitted (computed at submit time only).
- Created `src/app/api/assessment/followup/route.ts` — POST follow-up request. Validates name/email/interest (one of consultation|report|workshop|partnership). DECISION: assessmentId is REQUIRED (returns 400 if empty) because the Prisma relation is non-nullable; verifies the parent Assessment exists. Documented in the route comment.
- Created `src/app/api/benchmark/stats/route.ts` — GET aggregate stats. Uses `aggregate` for averages + `groupBy` for tier distribution. Empty dataset returns zeros. Averages rounded to integers.
- All routes use `export async function POST/GET`, `import { db } from "@/lib/db"`, `Response.json(...)`, and try/catch with `console.error` + 500 on unexpected errors.

Verification (curl tests against running dev server on :3000):
- POST /api/contact (valid) → `{"ok":true,"id":"cmqnr6qyo..."}` ✓
- POST /api/contact (bad email) → `{"ok":false,"error":"valid email is required"}` (400) ✓
- POST /api/careers (valid) → `{"ok":true,"id":"cmqnr6w8w..."}` ✓
- POST /api/newsletter (new) → `{"ok":true,"id":"cmqnr6wcd..."}` ✓
- POST /api/newsletter (duplicate) → `{"ok":true,"alreadySubscribed":true,"id":"cmqnr6wcd..."}` ✓
- GET /api/benchmark/stats (empty) → `{"totalAssessments":0,...zeros}` ✓
- POST /api/assessment (6 responses, mixed scores) → `{"id":"...","overall":63,"scores":{strategy:63,technology:100,culture:25,data:50,operations:75},"tier":"Established","percentile":50,"questionCount":6,"createdAt":"..."}` ✓ (math verified)
- POST /api/assessment (5 high) → overall:95, tier:Leading, percentile:100 ✓
- POST /api/assessment (5 low) → overall:10, tier:Nascent, percentile:0 ✓
- GET /api/assessment/<id> → full result with responses array ✓
- GET /api/assessment/nonexistent → HTTP 404 ✓
- GET /api/benchmark/stats (after 3 submissions) → `{"totalAssessments":3,"averageOverall":56,"dimensionAverages":{strategy:54,technology:75,culture:33,data:58,operations:58},"tierDistribution":{Nascent:1,Developing:0,Established:1,Leading:1}}` ✓
- POST /api/assessment/followup (valid) → `{"ok":true,"id":"cmqnr73od..."}` ✓
- POST /api/assessment/followup (missing assessmentId) → `{"ok":false,"error":"assessmentId required"}` (400) ✓
- POST /api/assessment validation: empty responses / bad value (9) / bad dimension ("marketing") all rejected with 400 ✓
- `bun run lint` clean. Dev log shows 200/404/400 responses, no 500s, no compile errors.

Stage Summary:
- Files created (7):
  1. `src/app/api/contact/route.ts`
  2. `src/app/api/careers/route.ts`
  3. `src/app/api/newsletter/route.ts`
  4. `src/app/api/assessment/route.ts`
  5. `src/app/api/assessment/[id]/route.ts`
  6. `src/app/api/assessment/followup/route.ts`
  7. `src/app/api/benchmark/stats/route.ts`
- Key decisions:
  - Scores computed server-side and treated as authoritative (client scores ignored).
  - scoreToTier re-implemented inline in the assessment route (avoids importing @/lib/content which pulls types — keeps the API route clean and pure-server).
  - Percentile computed post-insert against OTHER assessments only; neutral 50 returned when dataset has 1 entry. Not persisted (computed on demand at submit time; omitted from GET /api/assessment/[id]).
  - Newsletter duplicate emails return 200 with `alreadySubscribed:true` (no error).
  - Followup requires a non-empty, valid assessmentId (frontend always has result.id available since followup only appears post-submit).
  - All averages in /api/benchmark/stats rounded to integers for a clean readout.
- No issues. All 7 endpoints behave per contract. Frontend agents can wire forms directly to these URLs.

---
Task ID: 3a
Agent: corporate-views-builder
Task: Built the 5 corporate view components (home, about, services, contact, careers) for the Meridian Advisory single-route site.

Work Log:
- Read worklog.md, content.ts, types.ts, store.ts, reveal.tsx, icon.tsx, header.tsx, logo.tsx, globals.css, use-toast.ts, page.tsx, and the relevant shadcn primitives (button, card, accordion, dialog, select, input, textarea, label) to understand the established contracts.
- Wrote `src/components/views/home-view.tsx` (~580 lines): hero (bg-radial-fade + bg-grid + maturity snapshot card visual), trust bar, stats band (4 STATS), services preview (6 cards, click → services), prominent emerald Benchmark feature band ("5 dimensions · 15 questions · 8 minutes"), methodology (4 cards), case studies (3 cards with sector + result + metric), testimonials (3 figure cards), leadership preview (4 of 6), final CTA band.
- Wrote `src/components/views/about-view.tsx` (~385 lines): hero (company description + founded year + HQ card), story/purpose narrative (3 paragraphs), stats band, full 6-person leadership grid with initials avatars, 4 offices as cards, 6 VALUES I wrote (Outcomes over outputs / Independent always / Capability not dependency / Evidence over opinion / Candour is kindness / Long games short cycles), CTA band.
- Wrote `src/components/views/services-view.tsx` (~360 lines): hero with quick-jump chips, alternating-layout service cards for all 6 SERVICES (left: icon + title + tagline + description + CTA; right: Outcomes ✓ list + Deliverables bullet list), methodology band reuse, engagement model section (4 phases with duration ranges + 3-stat strip: team size 2-8 / weekly governance / 6wk-18mo), CTA band.
- Wrote `src/components/views/contact-view.tsx` (~530 lines): hero, 2-col layout (form + aside). Form: controlled state with manual validation (name/email/message required, email regex, message min 20 chars), topic Select (general|services|partnership|press), loading spinner on submit, success state replaces form with confirmation, error/success toasts. POST /api/contact. Aside: direct contact card (email/phone/HQ/response time), offices card, social card (LinkedIn/Twitter/YouTube).
- Wrote `src/components/views/careers-view.tsx` (~710 lines): hero with culture stats card (94% retention, 26 wk parental, £4k learning, 4 wk WFA), open roles as Accordion (5 CAREERS) — each row shows title/team/level + location + type badges, expands to summary + responsibilities + requirements + Apply button. Apply opens a Dialog with controlled form (name, email, phone, yearsExp number, linkedin, portfolio, message; roleSlug+roleTitle pre-filled from active role) → POST /api/careers, success toast + close dialog. Perks grid (6 PERKS with icons), culture section (4 CULTURE_VALUES I wrote + 2 paragraphs of narrative), CTA for open applications.
- Ran `bun run lint`: 0 errors, 0 warnings in my 5 files (only a pre-existing warning in benchmark-quiz-view.tsx).
- Verified dev.log: GET / returns HTTP 200, no compile errors.
- Wrote agent-ctx summary at /home/z/my-project/agent-ctx/3a-corporate-views-builder.md.

Stage Summary:
- Files written (overwrote stubs):
  - src/components/views/home-view.tsx — HomeView
  - src/components/views/about-view.tsx — AboutView
  - src/components/views/services-view.tsx — ServicesView
  - src/components/views/contact-view.tsx — ContactView
  - src/components/views/careers-view.tsx — CareersView
- Design discipline kept: emerald primary + amber accent only (no indigo/blue), `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` containers, `py-20 md:py-28` section padding, `rounded-xl border border-border/70 bg-card hover:border-primary/30 hover:shadow-sm` card pattern, `bg-primary/8 text-primary rounded-lg p-2.5` icon tiles, `text-4xl md:text-5xl font-semibold text-primary` for stat values. Used `Reveal` + staggered `delay` throughout, `Eyebrow` + `SectionHeading` for consistent section heads.
- Forms: controlled state (no react-hook-form — simpler for this scope, fewer deps), manual validation, loading state with Loader2 spinner, success toast via `useToast`, error toast with message from API response. Submit disabled while pending. Apply dialog resets on open, closes on success.
- API contracts honoured: contact POSTs `{ name, email, company?, phone?, topic, message }`, careers POSTs `{ name, email, phone?, roleSlug, roleTitle, yearsExp?, linkedin?, portfolio?, message? }`.
- All navigation via `useNav((s) => s.navigate)(viewKey)` — no Link, no router. Hero CTAs route to benchmark-landing, services, about, contact as specified.
- Mobile-first: grids collapse 4→2→1, hero typography scales `text-4xl sm:text-5xl md:text-6xl`, touch targets ≥44px (h-11 buttons), nav strip wraps, dialog scrolls.

---
Task ID: 3b
Agent: benchmark-views-builder
Task: Built the four Digital Maturity Benchmark view components (landing, quiz, results, followup) — full production-grade implementations wired to the `useNav` store, the `/api/assessment`, `/api/assessment/followup`, and `/api/benchmark/stats` contracts.

Work Log:
- Read worklog.md, store.ts, types.ts, content.ts (DIMENSIONS, BENCHMARK_QUESTIONS, TIER_META, scoreToTier), reveal.tsx, icon.tsx, page.tsx, ui primitives (button/card/progress/radio-group/select/accordion/checkbox/textarea/skeleton), and the existing `/api/assessment/route.ts` to lock down the response shape `{ id, overall, scores, tier, percentile, questionCount, createdAt }`.
- Wrote `benchmark-landing-view.tsx`: hero with `bg-radial-fade` + `bg-grid` + dual CTA; stats strip that fetches `/api/benchmark/stats` with loading (Skeleton), empty ("Be the first"), and error states; "What you'll get" 4-card grid; 5 dimensions preview cards using `Icon` for the glyph; 3-step "How it works" panel; methodology + trust note with the 4 tier chips; FAQ accordion; final CTA. Honors existing `result` in store with a "View your last result" affordance.
- Wrote `benchmark-quiz-view.tsx`: 6-step flow (5 dimension steps × 3 questions + 1 details step). Sticky progress header (Step X/6, dimension label, X/15 answered, Exit link, Progress bar). Each step uses framer-motion `AnimatePresence` for smooth transitions. Each question is a card with a numbered/checked indicator, prompt, optional help, and a custom Likert selector (1×5 responsive grid: stacked on mobile, 5-across on desktop; selected = `bg-primary text-primary-foreground`). Back/Next navigation with `stepComplete` gating (Next disabled until all 3 questions answered; final dim step button reads "Review details"). Details step captures `RespondentProfile` (name, email, company, companySize Select, industry Select, country, role) + consent Checkbox; Submit disabled until name+email+consent valid. On submit: builds responses array from `BENCHMARK_QUESTIONS`, computes `durationSec` from `startedAt`, POSTs to `/api/assessment`, then `setResult` + `setRespondent` + `navigate('benchmark-results')`. Toasts on error. Edge case handled: returning users with a prior result see a "Go to results" banner on the details step. Auto-starts a fresh session via `startAssessment()` if no responses and no `startedAt`.
- Wrote `benchmark-results-view.tsx`: empty state if no `result` in store. Hero score card with tier-colored stripe, big `overall / 100`, tier badge, tier summary, percentile line ("You're in the top X%" / "Higher than X%"). Recharts `RadarChart` (5 dimensions, plus a dashed benchmark overlay when stats are loaded). "You vs the benchmark" `BarChart` (vertical layout, emerald=you, amber=avg). Tier distribution mini-bars with "You" badge on the user's tier. Per-dimension rows (icon, label, tier, score, Progress, interpretation). Strengths (top 2) + Focus areas (bottom 2) two-column cards with derived interpretive copy per dimension × score band. "What your tier means" card with `TIER_META.summary` plus 3 tier-specific recommendations (bespoke copy per Nascent/Developing/Established/Leading). CTA panel (Request a briefing → followup; Retake → resetResponses+startAssessment+navigate quiz; Share → `navigator.share`/`window.print()`). Trust note with truncated assessment ID. Skeletons for all stats-dependent blocks.
- Wrote `benchmark-followup-view.tsx`: hero ("Turn your benchmark into action"), form with interest `RadioGroup` (4 options: consultation/report/workshop/partnership, each with icon + description), name/email/company/phone/message fields, Submit disabled until name+email valid. POSTs to `/api/assessment/followup` with `{ assessmentId: result?.id ?? null, name, email, company, phone, message, interest }`. Success → Confirmation state ("A Meridian partner will be in touch within two business days") + Back to home button. Aside: "What to expect" card (response time, senior partner not sales rep, no obligation) + dashed "Prefer email?" card linking `mailto:hello@meridianadvisory.com` and phone. Pre-fills name/email/company from store `respondent` if available.
- Verified: `bun run lint` → 0 errors, 0 warnings. `GET /` returns 200. All four `#/benchmark-*` hash routes return 200 (server renders the shell; view switching is client-side via `useNav`). Only dev.log errors are from other agents' stubs (e.g. `careers-view.tsx` `Users is not defined`), not from these views.

Stage Summary:
- Files written (4): `src/components/views/benchmark-landing-view.tsx`, `src/components/views/benchmark-quiz-view.tsx`, `src/components/views/benchmark-results-view.tsx`, `src/components/views/benchmark-followup-view.tsx`.
- Design: emerald primary + amber accent only, no indigo/blue/purple. Mobile-first throughout. Touch targets ≥44px (12 unit heights on buttons, 68px min on Likert cards). `Reveal`/`Eyebrow`/`SectionHeading` used for editorial consistency. `bg-radial-fade` + `bg-grid` on landing hero.
- Store wiring verified end-to-end: landing → `startAssessment()` + `navigate('benchmark-quiz')` → `setResponse` per question → `setRespondent` + `setResult` on submit → `navigate('benchmark-results')` → `navigate('benchmark-followup')` → confirmation → `navigate('home')`. `resetResponses` + `startAssessment` used for "Retake". `respondent` pre-fills the follow-up form.
- API integration: POST `/api/assessment` with full `{ responses, respondent, durationSec }` payload (validated against the contract body shape); GET `/api/benchmark/stats` consumed on landing (stats strip) + results (radar overlay + comparison bars + tier distribution); POST `/api/assessment/followup` with `{ assessmentId, name, email, company, phone, message, interest }`. All fetches use relative paths with `cache: "no-store"`; all error/loading/empty states handled gracefully so the views render even if the parallel API agent hasn't shipped a route yet.
- Open notes for the API agent: `interest` is sent as the literal string `consultation|report|workshop|partnership`; `assessmentId` may be `null` when a non-benchmark visitor uses the follow-up form — backend should accept null/omitted.

---
Task ID: 5 + 6
Agent: main (orchestrator)
Task: Integration verification + agent-browser end-to-end QA + final wiring.

Work Log:
- Ran `bun run lint` → clean (0 errors, 0 warnings) across all 9 views + 7 API routes.
- Resolved a transient `Users is not defined` compile error in careers-view.tsx that appeared during parallel subagent builds (self-healed; verified file is clean, only a valid `void data;` remains).
- Seeded 12 realistic benchmark assessments via /api/assessment (varied scores across all tiers) → 15 total in DB for meaningful peer comparison. Distribution: Nascent 3, Developing 3, Established 4, Leading 5.
- agent-browser end-to-end verification (all passed):
  - Home: renders all sections (hero, stats, services, benchmark feature, methodology, case studies, testimonials, leadership, CTA, footer). VLM: "Strong, clean, professional, no visual bugs." HTTP 200.
  - Benchmark landing (#/benchmark-landing): hero, stats strip (fetched /api/benchmark/stats live), 5 dimensions, 3-step flow, methodology, FAQ accordion, CTA. Hash deep-linking works.
  - Quiz (#/benchmark-quiz): 6-step flow (5 dimensions × 3 Qs + details). Likert scale with clear selected states, progress bar, step indicator, gated Next/Back, Exit link. Validation requires all questions answered + name/email/consent on details step.
  - Assessment submit: POST /api/assessment 200 — server computed scores (all 4s → 75/100, Leading), persisted Assessment + 15 AssessmentResponse rows, computed percentile (top 27%).
  - Results (#/benchmark-results): full report — overall 75/100, Leading tier badge, percentile "top 27%", recharts RadarChart (5 dimensions), "You vs benchmark" bar comparison (vs 16 assessments), tier distribution with "You" marker, per-dimension breakdown (all 75/Leading), strengths & focus areas, tier recommendations, CTAs (Request briefing / Retake / Share / Download). VLM confirmed score + radar render correctly.
  - Follow-up (#/benchmark-followup): form pre-filled name/email/company from assessment (nice UX), interest radio group, POST /api/assessment/followup 200, confirmation state shown.
  - Contact (#/contact): form (name/email/company/phone/topic/message) POST /api/contact 200, success toast "Message received — Thanks, Sarah. Reference cmqnr...".
  - Careers (#/careers): role accordions expand to show responsibilities/requirements; Apply dialog opens pre-filled with role; application POST /api/careers 200, dialog closes on success.
  - About/Services: render with hero headings, HTTP 200.
  - Mobile (390px): VLM confirmed responsive single-column, hamburger menu, stacked sections, no overflow/bugs. Footer complete at bottom.
  - Sticky footer: min-h-screen flex flex-col + mt-auto — verified present and well-formed at page bottom on both mobile and desktop.
- Note: one agent-browser quirk — submit buttons below the fold needed `scrollintoview` before click registered. Not an app bug; a browser-automation detail. All submits succeeded once scrolled into view.

Stage Summary:
- COMPLETE & VERIFIED. The full Meridian Advisory website + Digital Maturity Benchmark tool is live, functional, and visually polished.
- All data capture works end-to-end: contact inquiries, career applications, newsletter, assessment responses (+ per-question capture), follow-ups — all persisted to SQLite via Prisma and aggregatable via /api/benchmark/stats.
- 9 views, 7 API routes, 6 Prisma models, single / route with hash-based deep-linking.
- Dev server healthy on :3000. Lint clean.
- Known minor follow-ups for the recurring webDevReview cron (not blockers):
  - Could add an admin/reporting view to visualise aggregated benchmark data (currently only the JSON API).
  - Results "Download report" uses window.print(); a true PDF export could be added.
  - Could add team/bulk benchmark invites.
  - The seeded test data (15 assessments with seed@example.com) should be cleared before production.
