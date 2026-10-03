# TRENNT - Benchmark Flow Consolidation (Item 2) - Product Requirements Document

## Overview
- **Summary**: Consolidate the benchmark quiz flow from a two-pass (details → questions → return-to-details-for-submit) into a single-pass (details upfront → questions → direct submit). Promote `companySize` and `industry` to required fields at the Step 1 gate. Eliminate the review summary screen in favour of direct submission from the last question step.
- **Purpose**: Simplify user journey, reduce friction, ensure industry/companySize are always captured for sector comparison, and remove the confusing "return to details form" step after completing questions.
- **Target Users**: TRENNT website visitors initiating the Internal Audit Maturity Benchmark assessment.

## Goals
- Single-pass flow: Step 1 (details) → Steps 2-6 (5 dimension question sets) → Step 6 CTA submits directly to results page.
- `companySize` and `industry` required to proceed past Step 1 (canAdvance gate).
- `company`, `country`, `role` remain optional per approved decision.
- No intermediate review screen between last question and results.
- API payload shape unchanged: `{answers, respondent, durationSec}`.
- Results page sector comparison works correctly (industry always populated).
- Both English and Arabic languages fully supported.
- Previous-result banner still works for returning users.
- Back-button navigation is non-broken across all steps.
- TypeScript and Next.js build pass cleanly.

## Non-Goals
- No structural changes to `store.ts` (existing consolidated Zustand state retained).
- No deletion of unused translation strings (`detailsStepFinal`, `detailsTitleFinal`, `buttonGetResults`) — leave in place for future cleanup.
- No changes to scoring, results rendering, or API route handler.
- No change to consent/email/name requirements (already required).

## Background & Context
The current flow in `benchmark-quiz-view.tsx`:
1. DetailsStep (step 0) collects respondent info with optional companySize/industry.
2. User clicks "Start the questions" → 5 dimension steps (step 1..5 = STEPS.length).
3. On the last dimension step, CTA says "Get my report" but actually **returns the user to DetailsStep** via `setDoneWithQuestions(true); setStep(0)`.
4. In DetailsStep, `finalMode`/`questionsDone` branch flips the CTA to "Get my results" which finally calls `handleSubmit()`.

This two-pass design confuses users (they thought they were submitting, are sent back), and allows sector-comparison data (industry) to be blank, degrading the results experience. The approved plan converts to a linear single-pass.

Approved decisions:
1. `companySize` + `industry` promoted to REQUIRED at canAdvance gate.
2. Option B: direct submit from last question step, NO review summary screen.
3. `company`, `country`, `role` stay optional.

## Functional Requirements
- **FR-1 (Step Navigation)**: When on the final question step (step === STEPS.length, i.e. dimension 5 of 5), clicking the CTA "Get my report" must immediately call `handleSubmit(profile)` using respondent data from the Zustand store, then navigate to benchmark-results. It must NOT set step back to 0.
- **FR-2 (Progress Calculation)**: `overallPct` must use `Math.round((step / TOTAL_STEPS) * 100)` uniformly for all steps, removing the special `isDetailsStep ? (answeredCount >= TOTAL_QUESTIONS ? 100 : 0) : ...` branch.
- **FR-3 (DetailsStep Header)**: DetailsStep header/step counter must always show "Step 1 of 6 — Your details" (and Arabic equivalent), removing the `answeredCount >= TOTAL_QUESTIONS` branch that showed "Step 6 of 6 — Final step".
- **FR-4 (Remove doneWithQuestions)**: The `doneWithQuestions` state variable, `finalMode` DetailsStep prop, and all `questionsDone`-keyed conditional branches inside DetailsStep must be removed. DetailsStep renders exactly one mode (upfront profile collection).
- **FR-5 (Remove goBack branch R5)**: The `goBack()` branch `isDetailsStep && doneWithQuestions` must be deleted; back from DetailsStep is simply Exit (step === 0 → handleExit) or step - 1 otherwise.
- **FR-6 (canAdvance Gate)**: `canAdvance = nameValid && emailValid && consent && companySize && industry`. User cannot advance past Step 1 without selecting companySize and industry.
- **FR-7 (Field Required Visuals)**: CompanySize and Industry fields in DetailsStep should show the required asterisk `*` to match their new gate status.
- **FR-8 (CTA on last step)**: The bottom-nav CTA when `step === STEPS.length` must submit inline (trigger handleSubmit + navigate), not jump back to details.
- **FR-9 (Validation messages)**: Step 1 inline validation should surface companySize/industry missing cases alongside name/email/consent.
- **FR-10 (Existing respondent survives)**: Live-sync of DetailsStep fields into Zustand `respondent` must continue so edits propagate and the final submit on step 5 uses the latest values.
- **FR-11 (Previous result banner)**: The `resultExists` banner ("You have a previous benchmark on file") and its "Go to results" action must continue working unchanged.
- **FR-12 (Back navigation)**: From step N (2..6 = dimension index 1..5), Back must go to step N-1. From step 1 (first dimension), Back must go to step 0 (details). From step 0, Back = Exit.

## Non-Functional Requirements
- **NFR-1 (Payload Stability)**: POST to `/api/assessment` must use the exact same `{answers, respondent, durationSec}` shape as before. No new or renamed fields.
- **NFR-2 (Type Safety)**: `npx tsc --noEmit` exits 0.
- **NFR-3 (Build)**: `npm run build` succeeds (Next.js Turbopack build).
- **NFR-4 (i18n)**: Both English (LTR) and Arabic (RTL) render correctly at every step; no untranslated labels; RTL direction applied via `dir` attribute where already in place.
- **NFR-5 (Regression)**: Sector comparison on benchmark-results must not error when industry is absent (it now never is, but code defensiveness remains fine).

## Constraints
- **Technical**: Only modify `benchmark-quiz-view.tsx`. No store.ts structural changes. No API route changes.
- **Business**: Unused copy strings (final-mode labels) stay in code, not deleted. Local changes only; no git add/commit.
- **Dependencies**: Existing Zustand store, Framer Motion AnimatePresence, Shadcn UI field components.

## Assumptions
- Respondent data synced into Zustand store (via `setRespondent`) before user reaches step 5 is complete and valid (name/email/consent/companySize/industry all populated because canAdvance blocked Step 1 otherwise).
- User cannot bypass canAdvance via browser dev-tools (canAdvance is a UX guard; API has its own server-side validation if needed — out of scope).
- `submitting` state correctly prevents double-submit during the inline-submit CTA.

## Acceptance Criteria

### AC-1: Single-pass flow — no return to details after last question
- **Type**: `rule`
- **Given**: User is on Step 6 (final dimension / step === STEPS.length) with all questions answered.
- **When**: User clicks "Get my report".
- **Then**: `handleSubmit` is called immediately; network request to `/api/assessment` fires; user navigates to `benchmark-results`; step never becomes 0 again after questions start; the details form does not reappear.
- **Pass Condition**: Observed in browser: no intermediate details-form render; network tab shows POST then route change.
- **Evidence**: Browser DevTools network log + step transition observation in both EN and AR.

### AC-2: companySize + industry block Step 1 advance
- **Type**: `rule`
- **Given**: User on Step 1 (details) with valid name, valid email, consent checked; companySize empty OR industry empty.
- **When**: User clicks "Start the questions".
- **Then**: Button disabled OR click no-ops; inline validation message appears indicating the missing field(s); step stays at 0.
- **Pass Condition**: canAdvance === false; advanceFromDetails not invoked; fields show required asterisk.
- **Evidence**: Manual test clicking with missing companySize, then missing industry, then both present — confirm advance only fires when both selected. EN + AR.

### AC-3: company/country/role remain optional
- **Type**: `rule`
- **Given**: User on Step 1 with name, email, consent, companySize, industry all set; company, country, role all empty strings.
- **When**: User clicks "Start the questions".
- **Then**: canAdvance === true; advance fires; step advances to 1 (first dimension).
- **Pass Condition**: Step becomes 1 with company/country/role still ""; no validation error for these fields.
- **Evidence**: Manual run through Step 1 with company/country/role blank.

### AC-4: API payload shape unchanged
- **Type**: `rule`
- **Given**: Full submission from Step 6 inline CTA.
- **When**: POST to `/api/assessment` captured.
- **Then**: Request body has exactly top-level keys `answers`, `respondent`, `durationSec`; `respondent` contains all fields: `{name, email, company, companySize, industry, country, role, consentContact}`; `answers` is array of 26 items with `{questionId, selectedOption, domain, questionText}`.
- **Pass Condition**: Payload byte-for-byte structurally identical (modulo values) to pre-change submission.
- **Evidence**: DevTools → Network → `/api/assessment` → Payload tab, captured EN and AR.

### AC-5: DetailsStep always shows Step 1 of 6 heading (no final-mode headings)
- **Type**: `rule`
- **Given**: Any state of DetailsStep render (including returning-user with `resultExists`).
- **When**: Step 0 mounts.
- **Then**: Step label shows "Step 1 of 6 — Your details" (or Arabic equivalent `quizUI.detailsStepFirst`); H1 shows "A few details, then the questions." (or Arabic `quizUI.detailsTitleFirst`); `detailsStepFinal`/`detailsTitleFinal` strings never render.
- **Pass Condition**: DOM inspection shows no final-mode copy.
- **Evidence**: Screenshot or DOM snapshot of Step 0 in both EN and AR.

### AC-6: Progress percentage linear across steps
- **Type**: `rule`
- **Given**: User at each step 0..5 (6 steps total).
- **When**: Progress bar renders.
- **Then**: overallPct values are: step 0 → 0, step 1 → 17 (1/6), step 2 → 33 (2/6), step 3 → 50, step 4 → 67, step 5 → 83; or equivalent rounded percentages consistent with `Math.round(step / 6 * 100)`.
- **Pass Condition**: Progress value attribute matches formula for each step.
- **Evidence**: Snapshot of `<Progress value>` at each step.

### AC-7: Back-button navigation correctness
- **Type**: `rule`
- **Given**: User at step N (1 ≤ N ≤ 5).
- **When**: Back clicked.
- **Then**: Goes to N-1. From step 1 → step 0 (details). From step 0 → Exit (benchmark-landing). No `doneWithQuestions` jump-to-last-step branch triggers.
- **Pass Condition**: Every step back yields the decremented step or exit landing.
- **Evidence**: Manual walk forward 0→1→2→3→4→5 then back 5→4→3→2→1→0→exit, EN+AR.

### AC-8: Previous-result banner intact
- **Type**: `rule`
- **Given**: Zustand store has `result !== null` (returning user).
- **When**: BenchmarkQuizView mounts, step = 0.
- **Then**: Banner with "You have a previous benchmark on file" (or Arabic) and "Go to results" button renders above form; clicking button navigates to benchmark-results without requiring fields.
- **Pass Condition**: Banner present and action works.
- **Evidence**: Screenshot or DOM + navigation result.

### AC-9: TypeScript and build pass
- **Type**: `rule`
- **Given**: Source files after implementation.
- **When**: `npx tsc --noEmit` runs from repo root, then `npm run build` runs.
- **Then**: Both exit code 0 with no error output.
- **Pass Condition**: Command exit codes and output.
- **Evidence**: Captured terminal stdout/stderr.

### AC-10: Bilingual correctness (EN + AR)
- **Type**: `rubric`
- **Dimension**: Fidelity of i18n/RTL rendering across the consolidated flow.
- **Scale**: 1-5
- **Anchors**:
  - 1 = Missing translations, broken RTL layout, reversed icons, unreadable text in at least one step.
  - 3 = Both languages render, but minor alignment issues in RTL or 1-2 untranslated labels remain.
  - 5 = Every step renders with correct EN text, correct AR translations, `dir=rtl` applied in AR, arrow icons correctly rotated 180 in RTL, form inputs (name/company/role) use rtl dir, email/country stay ltr.
- **Pass Threshold**: >= 4
- **Evidence**: Side-by-side screenshots of Step 0 through Step 5 CTA in both EN and AR, plus Step 6 submit confirmation.

## Open Questions
- None — all decisions approved in the user's request.
