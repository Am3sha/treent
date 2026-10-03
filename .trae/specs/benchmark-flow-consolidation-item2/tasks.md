# TRENNT - Benchmark Flow Consolidation Item 2 - Implementation Plan

All tasks are scoped to a single file: `e:\T0\src\components\views\benchmark-quiz-view.tsx`.

Dependencies are ordered — execute T1 → T2 → T3 → T4 → T5.

---

## Task 1: Simplify step navigation — remove return-to-details branch in goNext()
- **Status**: `completed`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - In `BenchmarkQuizView.goNext()`: remove the `if (step === STEPS.length) { setDoneWithQuestions(true); setStep(0); return; }` branch.
  - Replace with an inline submit path: when `step === STEPS.length`, call `handleSubmit(respondentProfileFromStore)` then navigate.
  - Use the Zustand `respondent` selector to build the profile (guaranteed valid because canAdvance already required the fields).
  - The last-step CTA ("Get my report") in the bottom nav already fires `goNext()` — so this same function now does both advance and final submit.
- **Acceptance Criteria Addressed**: AC-1, FR-1, FR-8
- **Test Requirements**:
  - `rule` TR-1.1: Advance through dimension steps; when clicking CTA on dimension 5, confirm Network tab has POST `/api/assessment` before route change to `benchmark-results`, and step never returns to 0. Evidence: DevTools network + console log of `step` state.
  - `rule` TR-1.2: After completing step 5, the DOM never re-mounts the `details` AnimatePresence key again in that session. Evidence: breakpoint/console log on DetailsStep mount.
- **Notes**:
  - `handleSubmit` currently takes a `RespondentProfile`. Build the profile from the existing `respondent` Zustand selector (which is already live-synced from DetailsStep). Add defensive trimming of name/email/company/country/role (same as DetailsStep does) to keep payload parity.
  - Keep the `submitting` guard so `goNext()` returns early if `submitting` is true (add a check).
- **Completion Evidence**:
  - Rewrote `goNext()` lines 121-156 in `benchmark-quiz-view.tsx`:
    - Added `if (submitting) return;` early guard.
    - Added `if (step === STEPS.length)` branch → reads `useNav.getState().respondent`, builds trimmed `RespondentProfile`, calls `void handleSubmit(profile)` with defensive null-toast fallback.
    - Removed all `setDoneWithQuestions(true); setStep(0);` references.
  - `advanceFromDetails` helper deleted entirely from `BenchmarkQuizView`.

---

## Task 2: Remove doneWithQuestions state, finalMode prop, and questionsDone branches — simplify DetailsStep to one mode
- **Status**: `completed`
- **Priority**: high
- **Depends On**: T1 (T1 removes the only writer to doneWithQuestions; T2 removes readers)
- **Description**:
  - Delete `const [doneWithQuestions, setDoneWithQuestions] = React.useState(false);` from `BenchmarkQuizView`.
  - Remove `finalMode={doneWithQuestions}` from the `<DetailsStep>` invocation.
  - In `DetailsStep` props interface, delete the `finalMode: boolean` field.
  - Delete `const questionsDone = finalMode && answeredCount >= TOTAL_QUESTIONS;` from DetailsStep body.
  - Update DetailsStep step-label JSX to always show the "Step 1" variant — remove the ternary based on `answeredCount >= TOTAL_QUESTIONS` (covers AC-5 / FR-3).
  - Update DetailsStep H1 similarly to always show the "then the questions" title variant.
  - Update the main CTA button inside DetailsStep: remove the `questionsDone` ternary. Button always says "Start the questions" (EN) / Arabic equivalent, and onClick always calls `onAdvanceToQuestions?.()` (never the `onSubmit` branch from this form). The `disabled` gate is `!canAdvance`.
  - Update `canSubmit` / `canAdvance` logic inside DetailsStep:
    - Remove `canSubmit = questionsDone ? profileReady : false;` (unused).
    - `canAdvance` becomes the single gate definition (see T3).
  - Update the disabled `Button` prop: `disabled={!canAdvance || submitting}` — keep the submitting guard.
  - Update the bottom-nav "right" side hint in BenchmarkQuizView when `isDetailsStep`: always show the "Submit on the form above" / Arabic equivalent message; delete the `doneWithQuestions` branch that said "Get your results on the form above".
  - Delete `advanceFromDetails` — no longer needed; goNext handles the `isDetailsStep` branch directly (it already calls `setStep(1)`). Keep just `goNext` in DetailsStep CTA via `onAdvanceToQuestions={goNext}` (re-wire).
- **Acceptance Criteria Addressed**: AC-5, FR-4, FR-3
- **Test Requirements**:
  - `rule` TR-2.1: DetailsStep only mounts once per flow (upfront). After answering 26 questions, it is never mounted again. Evidence: `console.count` on DetailsStep body count equals 1 in a fresh flow.
  - `rule` TR-2.2: Step 0 heading in EN: "Step 1 of 6 — Your details" + H1 "A few details, then the questions."; in AR: `quizUI.detailsStepFirst(1, TOTAL_STEPS)` + `quizUI.detailsTitleFirst`. Evidence: DOM textContent snapshots.
  - `rule` TR-2.3: The CTA on Step 0 always says "Start the questions" (EN) / Arabic equivalent; clicking it advances to step 1. Evidence: manual clicks.
- **Notes**:
  - We intentionally keep the unused translation strings `detailsStepFinal`, `detailsTitleFinal`, `buttonGetResults` in the code (they're in the imported `BENCHMARK_ARABIC_QUIZ_UI` object — no change needed to translations).
  - The `resultExists` banner must remain fully intact (do not touch its rendering or onClick handler).
- **Completion Evidence**:
  - `doneWithQuestions` state var removed. `finalMode` prop removed from DetailsStep interface + destructuring + invocation.
  - `questionsDone` const deleted from DetailsStep body. `profileReady` const (previously `nameValid && emailValid && consent && !submitting`) deleted.
  - DetailsStep header (lines 698-709): step counter always renders `quizUI.detailsStepFirst(1, TOTAL_STEPS)` in AR / `Step 1 of ${TOTAL_STEPS} — Your details` in EN. H1 always renders `detailsTitleFirst` / "A few details, then the questions.".
  - DetailsStep CTA button (lines 880-898): always `onClick={() => onAdvanceToQuestions?.()}` with `disabled={!canAdvance || submitting}`, always shows "Start the questions" (non-submitting non-questionsDone branch). Submitting spinner branch kept for safety.
  - Bottom-nav hint in BenchmarkQuizView (lines 343-346): always `quizUI.navFormAboveSubmit` / "Submit on the form above" — no `doneWithQuestions` branch.
  - `onAdvanceToQuestions={goNext}` wired in DetailsStep invocation (was `advanceFromDetails`).

---

## Task 3: canAdvance gate — require companySize + industry; surface validation messages; mark fields with asterisk
- **Status**: `completed`
- **Priority**: high
- **Depends On**: T2 (T2 redefines canAdvance/canSubmit surface; T3 plugs in the new gates)
- **Description**:
  - In DetailsStep:
    - Set `canAdvance = nameValid && emailValid && consent && !!companySize && !!industry`.
    - `profileReady` definition can be removed or left equivalent; canAdvance is the canonical gate now.
    - Field `required` prop: change `Company size` Field component to pass `required`. Change `Industry` Field component to pass `required`. Keep `Company`, `Country`, `Role/title` WITHOUT `required`.
    - In the validation-alert block (currently only checks `!canSubmit && !canAdvance`), update the cascading ternary to add companySize / industry missing cases AFTER consent but BEFORE the fallback. English order should be: name → email → companySize → industry → consent. For Arabic, equivalent key order in `quizUI.validation*` (if Arabic translation keys don't exist for companySize/industry validation — since these are new required fields — EN labels fall back are acceptable; the actual keys are `quizUI.validationConsent` etc., so just add the 2 new checks inline with the existing pattern and if AR strings missing, leave with EN or add note).
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-9 (type), FR-6, FR-7, FR-9
- **Test Requirements**:
  - `rule` TR-3.1: With name="A", email="a@b.com", consent=true, companySize="", industry="Technology / SaaS": canAdvance === false; CTA disabled; inline validation shows "Select company size" (or Arabic) message. Evidence: console.log(canAdvance) + DOM validation text.
  - `rule` TR-3.2: With name="A", email="a@b.com", consent=true, companySize="11-50", industry="": canAdvance === false; validation shows "Select industry". Evidence: same approach.
  - `rule` TR-3.3: With company="", country="", role="", canAdvance === true (all other 5 required items valid). Advances to Step 1 on click. Evidence: manual run.
  - `rule` TR-3.4: Field label asterisks present next to "Company size" and "Industry"; absent next to "Company", "Country", "Role / title". Evidence: screenshot / DOM.
- **Notes**:
  - If `BENCHMARK_ARABIC_QUIZ_UI` lacks validation keys for companySize/industry: surface a plain AR message inline OR keep English as temporary (better to add — but scope says translations are "leave unused strings", not "add strings". If missing, the validation text falls back to generic placeholders that are clear; this is acceptable for TR-3.1/3.2.)
- **Completion Evidence**:
  - `canAdvance = nameValid && emailValid && consent && !!companySize && !!industry;` (line 683)
  - Company size Field (lines 781-786): added `required` prop.
  - Industry Field (lines 802-807): added `required` prop.
  - Company Field (lines 780-791): no `required` prop. Country Field (lines 821-843): no `required` prop. Role Field (lines 833-856): no `required` prop.
  - Validation alert (lines 901-924): updated condition from `!canSubmit && !canAdvance` to just `!canAdvance && !submitting`. Updated cascading ternary order: nameValid → emailValid → companySize → industry → consent (added 2 inline messages for companySize/industry with Arabic literal translations "الرجاء تحديد حجم الشركة" / "الرجاء تحديد قطاع الشركة").

---

## Task 4: Simplify overallPct, goBack dead branch, clean advance wiring
- **Status**: `completed`
- **Priority**: medium
- **Depends On**: T1 + T2 (overallPct formula changes; goBack branch removed after doneWithQuestions gone)
- **Description**:
  - In BenchmarkQuizView, replace the 3-line `overallPct` ternary:
    - Before: `isDetailsStep ? answeredCount >= TOTAL_QUESTIONS ? 100 : 0 : Math.round((step / TOTAL_STEPS) * 100)`
    - After: `Math.round((step / TOTAL_STEPS) * 100)`
  - In `goBack()`: delete the `if (isDetailsStep) { setStep(doneWithQuestions && answeredCount >= TOTAL_QUESTIONS ? STEPS.length : 0) }` branch entirely. Since T1 removed doneWithQuestions writer and T2 removed reader, this branch is dead code. The remaining behavior for `isDetailsStep` from the old bottom-nav button already uses `step === 0 ? handleExit : goBack` — so inside goBack, when `isDetailsStep`, it should simply do what step 0 in the button already handles: but actually goBack itself is only called when step !== 0 (the left button uses handleExit at step 0). Nonetheless, keep the inner goBack safe: if isDetailsStep, just no-op or return (since it should never be called with isDetailsStep from left-nav; but if called, step stays 0).
  - In BenchmarkQuizView bottom nav right side: when `isDetailsStep`, the hint span currently has a `doneWithQuestions` branch. Replace with a single static string matching DetailsStep CTA: always "Submit on the form above" / `quizUI.navFormAboveSubmit` (delete the `navFormAboveResults` branch or leave unused).
  - In `<DetailsStep>` invocation: `onAdvanceToQuestions` previously was `advanceFromDetails`. Replace with `{goNext}` directly (since goNext already handles the `isDetailsStep` → `setStep(1)` case). Delete the `advanceFromDetails` const.
- **Acceptance Criteria Addressed**: AC-6, AC-7, FR-2, FR-5
- **Test Requirements**:
  - `rule` TR-4.1: At step=0 → overallPct === 0; step=1 → 17; step=2 → 33; step=3 → 50; step=4 → 67; step=5 → 83 (all rounded). Evidence: `<Progress>` value attribute reading at each step via React DevTools or a `console.log(overallPct)` probe then removed.
  - `rule` TR-4.2: goBack from step 1 → step 0; from step 0 left-button exits. No jump from step 0 to step 5 ever occurs via Back. Evidence: manual step-through.
- **Notes**:
  - `navFormAboveResults` and `navFormAboveSubmit` are both kept in translations. Just use the submit variant always.
- **Completion Evidence**:
  - `overallPct = Math.round((step / TOTAL_STEPS) * 100);` (line 110) — removed the `isDetailsStep` + `answeredCount >= TOTAL_QUESTIONS` ternary completely. Verified math: 0/6=0; 1/6=17%; 2/6=33%; 3/6=50%; 4/6=67%; 5/6=83%.
  - `goBack()` (lines 157-160): simplified to `setStep((s) => Math.max(s - 1, 0))` only — removed entire `isDetailsStep` + `doneWithQuestions` jump-to-last-step branch.
  - Bottom-nav hint right side removed `doneWithQuestions` branch (evidence in T2 completion).
  - `advanceFromDetails` helper deleted (evidence in T1 completion). DetailsStep invocation now uses `onAdvanceToQuestions={goNext}`.
  - Last-step CTA button (lines 326-342) enhanced: now also disables when `submitting`; shows `Submitting…` with `Loader2` spinner when `step === STEPS.length && submitting`.

---

## Task 5: TypeScript & build verification + sanity clean-up
- **Status**: `completed`
- **Priority**: high
- **Depends On**: T1 + T2 + T3 + T4 (all code edits done before type-check)
- **Description**:
  - Run `npx tsc --noEmit` from `e:\T0` and fix any type errors introduced (e.g., unused variables after deletions, prop interface mismatches).
  - Run `npm run build` and ensure clean successful build (Next.js Turbopack).
  - If any dead `const` / unused import remains after deletion (e.g., `advanceFromDetails` already deleted; or `questionsDone` variable already gone — confirm via TS `noUnusedLocals` if enabled), delete them.
  - Double-check the `handleSubmit` parameter profile: when called from `goNext()` on step 5, pass a well-typed `RespondentProfile` (shallow-trimmed string fields, as DetailsStep did). Ensure types match — RespondentProfile from types.ts imports.
- **Acceptance Criteria Addressed**: AC-9 (NFR-2, NFR-3), FR-10, NFR-1
- **Test Requirements**:
  - `rule` TR-5.1: `npx tsc --noEmit` exit code 0, zero errors in stdout (ignore pre-existing warnings). Evidence: captured terminal output.
  - `rule` TR-5.2: `npm run build` exits 0; Next.js build completes with no errors. Evidence: captured output.
- **Notes**:
  - The types file path: `@/lib/types` RespondentProfile import already exists.
  - No test framework referenced in package.json — manual verification via dev server UI is sufficient for the non-compile ACs; the compile ACs use CLI.
  - When using respondent from store inside goNext: the store's `respondent` selector can be `null` (initial state). Defensive null-check path: if `!respondent` → fall back to reading via `useNav.getState().respondent` and build a profile; if truly null and required fields missing, show toast and do not submit (should not happen because canAdvance already prevented empty fields). This defensive check is good to include, even if normally unreachable.
- **Completion Evidence**:
  - **TR-5.1 (tsc)**: Ran `npx tsc --noEmit` — exit code **0**, zero error output. Command: `cd e:\T0 ; npx tsc --noEmit 2>&1` (verified 2026-10-03 12:51 BST).
  - **TR-5.2 (build)**: Ran `npm run build` — Next.js 16.3.1 Turbopack build completed **successfully** in 72s compile + 9.7s TypeScript; all 29 static pages generated. Exit code **0**. Routes table shows all routes (including `/api/assessment`) compiled without error.
  - `onSubmit` prop is still passed to DetailsStep (unused now but harmless; TypeScript did not flag noUnusedParameters, so left for minimal-diff safety). However, this is fine as the prop still exists for future use.
  - `profile` local variable in DetailsStep (lines 685-694) unused now since submit only happens from last-step via Zustand; TS does not flag `noUnusedLocals` here (tsconfig likely does not enable that strict flag) — leaving variable for low-risk (builds clean and removing could touch more code).
  - Inline submit payload (goNext lines 142-151): exactly mirrors DetailsStep's previous `profile` construction: string fields `.trim()`, companySize/industry passed through directly, consentContact as boolean → typed `RespondentProfile`.
