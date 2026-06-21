# Task 3b — benchmark-views-builder

Built the four Digital Maturity Benchmark view components for Meridian Advisory.

## Files written
- `src/components/views/benchmark-landing-view.tsx`
- `src/components/views/benchmark-quiz-view.tsx`
- `src/components/views/benchmark-results-view.tsx`
- `src/components/views/benchmark-followup-view.tsx`

## Summary of each view

### BenchmarkLandingView
Hero (`bg-radial-fade` + `bg-grid`) with "How digitally mature is your organisation, really?" headline, primary CTA (Start the assessment → `startAssessment()` + `navigate('benchmark-quiz')`) and secondary "Talk to us". Stats strip fetching `/api/benchmark/stats` with loading/empty/error states. Four "What you'll get" outcome cards. The five `DIMENSIONS` as preview cards. Three-step "How it works". Methodology + tier chips + trust note. FAQ accordion. Final CTA. Honors existing `result` with "View your last result" affordance.

### BenchmarkQuizView
6-step flow: 5 dimension steps (3 questions each) + 1 details step. Sticky progress header (Step X/6, dimension label, X/15 answered, Exit). framer-motion `AnimatePresence` transitions. Custom Likert selector (1×5 grid, stacked on mobile, 5-across on desktop, selected = `bg-primary text-primary-foreground`). Back/Next gating. Details form captures `RespondentProfile` + consent, POSTs to `/api/assessment` with `{ responses, respondent, durationSec }`, then `setResult` + `setRespondent` + `navigate('benchmark-results')`. Returning users with prior result see "Go to results" banner.

### BenchmarkResultsView
Empty state when no `result`. Hero score card (overall/100, tier badge colored via `TIER_META[tier].color`, tier summary, percentile). Recharts `RadarChart` of 5 dimensions (with benchmark overlay when stats loaded). "You vs benchmark" `BarChart`. Tier distribution mini-bars with "You" badge. Per-dimension rows with score, Progress, tier, interpretation. Strengths (top 2) + Focus areas (bottom 2) cards. "What your tier means" with bespoke per-tier recommendations. CTA panel (Request briefing / Retake / Share via `navigator.share` or `window.print()`). Trust note with truncated assessment ID.

### BenchmarkFollowupView
Hero ("Turn your benchmark into action"). Form: interest `RadioGroup` (consultation/report/workshop/partnership), name, email, company, phone, message. POSTs to `/api/assessment/followup` with `{ assessmentId: result?.id ?? null, ... }`. Success → Confirmation state ("Meridian partner in touch within 2 business days"). Aside: "What to expect" + "Prefer email?" card (`mailto:hello@meridianadvisory.com`). Pre-fills from store `respondent`.

## Verification
- `bun run lint`: 0 errors, 0 warnings.
- `GET /` → 200.
- All `#/benchmark-*` hash routes → 200.
- Dev log: no compile/runtime errors from these 4 files (errors observed are from sibling agents' stubs, e.g. `careers-view.tsx`).

## Notes for the API agent
- `interest` sent as literal `consultation|report|workshop|partnership`.
- `assessmentId` may be `null` on the follow-up form when a non-benchmark visitor uses it — backend should accept null/omitted.
- `/api/benchmark/stats` consumed on landing (stats strip) + results (radar overlay + comparison bars + tier distribution).
- `/api/assessment` POST body shape exactly matches the contract.
