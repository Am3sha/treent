"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useNav } from "@/lib/store";
import { BENCHMARK_QUESTIONS, DIMENSIONS } from "@/lib/content";
import type {
  Dimension,
  RespondentProfile,
  BenchmarkQuestion,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Icon } from "@/components/site/icon";
import { cn } from "@/lib/utils";
import { COMPANY_SIZES, COMPANY_SIZE_LABELS } from "@/lib/benchmark-constants";
import { useTranslation } from "@/lib/i18n";
import {
  BENCHMARK_ARABIC_DIMENSIONS,
  BENCHMARK_ARABIC_QUESTIONS,
  BENCHMARK_ARABIC_QUIZ_UI,
  BENCHMARK_ARABIC_INDUSTRIES,
  COMPANY_SIZE_ARABIC_LABELS,
} from "@/lib/translations/benchmark-ar";



const INDUSTRIES = [
  "Financial services",
  "Technology / SaaS",
  "Healthcare & life sciences",
  "Manufacturing & industrials",
  "Retail & consumer",
  "Public sector",
  "Energy & utilities",
  "Media & telecommunications",
  "Education",
  "Non-profit",
  "Other",
];

// Group questions by dimension, in declared order.
const STEPS: { dimension: Dimension; questions: BenchmarkQuestion[] }[] =
  DIMENSIONS.map((d) => ({
    dimension: d.key,
    questions: BENCHMARK_QUESTIONS.filter((q) => q.dimension === d.key),
  }));

const TOTAL_STEPS = STEPS.length + 1; // +1 for the details step
const TOTAL_QUESTIONS = BENCHMARK_QUESTIONS.length;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function BenchmarkQuizView() {
  const responses = useNav((s) => s.responses);
  const setResponse = useNav((s) => s.setResponse);
  const navigate = useNav((s) => s.navigate);
  const startAssessment = useNav((s) => s.startAssessment);
  const startedAt = useNav((s) => s.startedAt);
  const respondent = useNav((s) => s.respondent);
  const setRespondent = useNav((s) => s.setRespondent);
  const setResult = useNav((s) => s.setResult);
  const result = useNav((s) => s.result);
  const resetResponses = useNav((s) => s.resetResponses);
  const { toast } = useToast();
  const { lang, isRTL } = useTranslation();
  const quizUI = BENCHMARK_ARABIC_QUIZ_UI;

  const [step, setStep] = React.useState(0); // 0 = details, 1..5 = dimension steps
  const [submitting, setSubmitting] = React.useState(false);
  // Track that the user has completed all 26 questions. DetailsStep is
  // re-mounted (AnimatePresence wait mode) when returning from the last
  // question step, so this flag — not just answeredCount — determines the
  // final-submission mode of the details form.
  const [doneWithQuestions, setDoneWithQuestions] = React.useState(false);

  // Start a fresh assessment if there are no responses and no startedAt.
  React.useEffect(() => {
    if (
      Object.keys(useNav.getState().responses).length === 0 &&
      !useNav.getState().startedAt
    ) {
      startAssessment();
    }
  }, [startAssessment]);

  const isDetailsStep = step === 0;

  // Compute progress.
  const answeredCount = React.useMemo(
    () => TOTAL_QUESTIONS - countUnanswered(responses),
    [responses]
  );
  const overallPct = isDetailsStep
    ? answeredCount >= TOTAL_QUESTIONS
      ? 100
      : 0
    : Math.round((step / TOTAL_STEPS) * 100);

  // For dimension steps, check whether all questions on this step are answered.
  const stepComplete = React.useMemo(() => {
    if (isDetailsStep) return true;
    const stepDef = STEPS[step - 1];
    return stepDef.questions.every((q) => responses[q.id] !== undefined);
  }, [isDetailsStep, step, responses]);

  const currentDim = !isDetailsStep ? DIMENSIONS[step - 1] : null;

  const goNext = () => {
    if (!stepComplete) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (isDetailsStep) {
      // Details is the first step: advance into the questions.
      setStep(1);
      return;
    }
    if (step === STEPS.length) {
      // All 26 questions answered — return to details for the final submit.
      setDoneWithQuestions(true);
      setStep(0);
      return;
    }
    setStep((s) => s + 1);
  };
  const advanceFromDetails = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep(1);
  };
  const goBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (isDetailsStep) {
      // Coming back from the details form: go to the last question step so
      // the user can review answers before submitting.
      setStep(doneWithQuestions && answeredCount >= TOTAL_QUESTIONS ? STEPS.length : 0);
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleExit = () => {
    navigate("benchmark-landing");
  };

  const handleSubmit = async (profile: RespondentProfile) => {
    setSubmitting(true);
    try {
      const payload = {
        answers: BENCHMARK_QUESTIONS.map((q) => ({
          questionId: q.id,
          selectedOption: responses[q.id],
          domain: q.dimension,
          questionText: q.prompt,
        })),
        respondent: profile,
        durationSec: startedAt
          ? Math.round((Date.now() - startedAt) / 1000)
          : 0,
      };
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || "Submission failed");
      }
      const resultJson = await res.json();
      setResult(resultJson.data);
      setRespondent(profile);
      toast({
        title: lang === "ar" ? quizUI.toastSubmitTitle : "Benchmark submitted",
        description: lang === "ar" ? quizUI.toastSubmitDesc : "Your maturity report is ready.",
      });
      navigate("benchmark-results");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast({
        title: lang === "ar" ? quizUI.toastErrorTitle : "Could not submit",
        description: lang === "ar" ? quizUI.toastErrorDesc(msg) : msg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary/20" dir={isRTL ? "rtl" : "ltr"}>
      {/* PROGRESS HEADER ------------------------------------------------ */}
      <div className="sticky top-[88px] z-30 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className={cn("mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8", isRTL && "text-right")}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="font-mono text-xs font-medium tracking-wider text-primary/80">
                {lang === "ar"
                  ? quizUI.progressStep(step + 1, TOTAL_STEPS, true)
                  : `Step ${step + 1} / ${TOTAL_STEPS}`}
              </span>
              <span className="hidden truncate text-sm font-medium text-foreground sm:inline">
                {isDetailsStep
                  ? lang === "ar"
                    ? quizUI.detailsTitleContext
                    : "Your details"
                  : currentDim
                    ? lang === "ar"
                      ? BENCHMARK_ARABIC_DIMENSIONS[currentDim.key].label
                      : currentDim.label
                    : ""}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {lang === "ar"
                  ? quizUI.answeredCount(answeredCount, TOTAL_QUESTIONS, true)
                  : `${answeredCount} / ${TOTAL_QUESTIONS} answered`}
              </span>
              <button
                onClick={handleExit}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                {lang === "ar" ? quizUI.exit : "Exit"}
              </button>
            </div>
          </div>
          <Progress
            value={overallPct}
            className="mt-2 h-1.5 bg-primary/15"
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
      </div>

      {/* STEP BODY ------------------------------------------------------ */}
      <div className={cn("mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8", isRTL && "text-right")}>
        <AnimatePresence mode="wait">
          {!isDetailsStep ? (
            <motion.div
              key={`dim-${step}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <DimensionStep
                dimension={currentDim!}
                questions={STEPS[step - 1].questions}
                responses={responses}
                onRespond={setResponse}
                lang={lang}
                isRTL={isRTL}
              />
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <DetailsStep
                initial={respondent}
                resultExists={!!result}
                submitting={submitting}
                answeredCount={answeredCount}
                finalMode={doneWithQuestions}
                onSubmit={handleSubmit}
                onAdvanceToQuestions={advanceFromDetails}
                onGoToResults={() => navigate("benchmark-results")}
                lang={lang}
                isRTL={isRTL}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAV ----------------------------------------------------------- */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-border/70 pt-6">
          <Button
            variant="ghost"
            onClick={step === 0 ? handleExit : goBack}
            disabled={submitting}
            className="gap-1.5"
          >
            <ArrowLeft className={cn("h-4 w-4", isRTL && "rotate-180")} />
            {step === 0
              ? lang === "ar" ? quizUI.navExit : "Exit"
              : lang === "ar" ? quizUI.navBack : "Back"}
          </Button>
          <div className="hidden text-xs text-muted-foreground sm:block">
            {!isDetailsStep && (
              <span
                className={cn(
                  stepComplete ? "text-emerald-700" : "text-muted-foreground"
                )}
              >
                {stepComplete
                  ? lang === "ar" ? quizUI.navAllSet : "All set — continue when ready"
                  : lang === "ar" ? quizUI.navAnswerAll : "Answer all questions to continue"}
              </span>
            )}
          </div>
          {!isDetailsStep ? (
            <Button
              onClick={goNext}
              disabled={!stepComplete}
              className="gap-1.5"
            >
              {step === STEPS.length
                ? lang === "ar" ? quizUI.navGetReport : "Get my report"
                : lang === "ar" ? quizUI.navNext : "Next"}
              <ArrowRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">
              {doneWithQuestions
                ? lang === "ar" ? quizUI.navFormAboveResults : "Get your results on the form above"
                : lang === "ar" ? quizUI.navFormAboveSubmit : "Submit on the form above"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dimension step
// ---------------------------------------------------------------------------

function DimensionStep({
  dimension,
  questions,
  responses,
  onRespond,
  lang,
  isRTL,
}: {
  dimension: (typeof DIMENSIONS)[number];
  questions: BenchmarkQuestion[];
  responses: Record<string, string>;
  onRespond: (id: string, letter: string) => void;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  const arabicDimension = BENCHMARK_ARABIC_DIMENSIONS[dimension.key];
  const displayDimension = lang === "ar" ? arabicDimension : dimension;
  const quizUI = BENCHMARK_ARABIC_QUIZ_UI;

  return (
    <div>
      <div className="mb-10 flex items-start gap-4">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10",
            dimension.accent
          )}
        >
          <Icon name={dimension.icon} className="h-6 w-6" />
        </div>
        <div>
          <p className={cn(
            "text-xs font-medium tracking-[0.2em] text-primary/80",
            isRTL ? "" : "uppercase"
          )}>
            {lang === "ar"
              ? quizUI.dimensionCounter(DIMENSIONS.indexOf(dimension) + 1, DIMENSIONS.length)
              : `Dimension ${DIMENSIONS.indexOf(dimension) + 1} of ${DIMENSIONS.length}`}
          </p>
          <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {displayDimension.label}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {displayDimension.description}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={idx + 1}
            value={responses[q.id]}
            onRespond={(v) => onRespond(q.id, v)}
            lang={lang}
            isRTL={isRTL}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  value,
  onRespond,
  lang,
  isRTL,
}: {
  question: BenchmarkQuestion;
  index: number;
  value: string | undefined;
  onRespond: (v: string) => void;
  lang: "en" | "ar";
  isRTL?: boolean;
}) {
  const answered = value !== undefined;
  const arabicQuestion = BENCHMARK_ARABIC_QUESTIONS[question.id];
  const displayPrompt = lang === "ar" && arabicQuestion ? arabicQuestion.prompt : question.prompt;
  const displayOptions = lang === "ar" && arabicQuestion
    ? question.options.map((option) => ({
      ...option,
      label: arabicQuestion.options[option.letter] ?? option.label,
    }))
    : question.options;
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 transition-colors sm:p-6",
        answered ? "border-primary/40" : "border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
            answered
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {answered ? <Check className="h-3.5 w-3.5" /> : index}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-balance text-base font-medium leading-snug sm:text-lg">
            {displayPrompt}
          </p>
          {question.help && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {question.help}
            </p>
          )}

          <LikertScale
            options={displayOptions}
            value={value}
            onChange={onRespond}
            lang={lang}
            isRTL={isRTL}
          />
        </div>
      </div>
    </div>
  );
}

function LikertScale({
  options,
  value,
  onChange,
  lang,
  isRTL,
}: {
  options: { letter: string; label: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
  lang: "en" | "ar";
  isRTL?: boolean;
}) {
  return (
    <div className="mt-5">
      <div
        role="radiogroup"
        aria-label={
          lang === "ar"
            ? "اختر الإجابة التي تصف وضع مؤسستك بأفضل شكل"
            : "Choose the response that best matches your organisation"
        }
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {options.map((opt) => {
          const selected = value === opt.letter;
          return (
            <button
              key={opt.letter}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.letter)}
              className={cn(
                "group flex min-h-[60px] flex-col items-start justify-between gap-2 rounded-lg border p-3 transition-all sm:flex-row sm:items-start sm:gap-3",
                isRTL ? "text-right" : "text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                selected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-background hover:border-primary/40 hover:bg-accent/40"
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  selected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {opt.letter}
              </span>
              <span
                className={cn(
                  "text-xs leading-snug sm:text-sm sm:flex-1",
                  selected
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                {opt.label}
              </span>
              {selected && (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground/70">
        {lang === "ar"
          ? "اختر الخيار الواحد الذي يصف وضع مؤسستك اليوم بأفضل شكل."
          : "Pick the single option that best describes your organisation today."}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Details step
// ---------------------------------------------------------------------------

function DetailsStep({
  initial,
  resultExists,
  submitting,
  answeredCount,
  finalMode,
  onSubmit,
  onAdvanceToQuestions,
  onGoToResults,
  lang,
  isRTL,
}: {
  initial: RespondentProfile | null;
  resultExists: boolean;
  submitting: boolean;
  answeredCount: number;
  finalMode: boolean;
  onSubmit: (p: RespondentProfile) => void;
  onAdvanceToQuestions?: () => void;
  onGoToResults: () => void;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  const quizUI = BENCHMARK_ARABIC_QUIZ_UI;
  const [name, setName] = React.useState(initial?.name ?? "");
  const [email, setEmail] = React.useState(initial?.email ?? "");
  const [company, setCompany] = React.useState(initial?.company ?? "");
  const [companySize, setCompanySize] = React.useState(
    initial?.companySize ?? ""
  );
  const [industry, setIndustry] = React.useState(initial?.industry ?? "");
  const [country, setCountry] = React.useState(initial?.country ?? "");
  const [role, setRole] = React.useState(initial?.role ?? "");
  const [consent, setConsent] = React.useState(initial?.consentContact ?? false);

  const nameValid = name.trim().length >= 2;
  const emailValid = EMAIL_RE.test(email.trim());
  const profileReady = nameValid && emailValid && consent && !submitting;
  const questionsDone = finalMode && answeredCount >= TOTAL_QUESTIONS;
  const setRespondent = useNav((s) => s.setRespondent);
  const resultExistsNow = resultExists;
  React.useEffect(() => {
    if (resultExistsNow) return;
    setRespondent({
      name,
      email,
      company,
      companySize,
      industry,
      country,
      role,
      consentContact: consent,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, company, companySize, industry, country, role, consent]);
  const hydrateKey = JSON.stringify({
    name: initial?.name ?? null,
    email: initial?.email ?? null,
    company: initial?.company ?? null,
    companySize: initial?.companySize ?? null,
    industry: initial?.industry ?? null,
    country: initial?.country ?? null,
    role: initial?.role ?? null,
    consent: initial?.consentContact ?? null,
  });
  React.useEffect(() => {
    if (!initial) return;
    if (initial.name !== undefined) setName(initial.name);
    if (initial.email !== undefined) setEmail(initial.email);
    if (initial.company !== undefined) setCompany(initial.company);
    if (initial.companySize !== undefined) setCompanySize(initial.companySize);
    if (initial.industry !== undefined) setIndustry(initial.industry);
    if (initial.country !== undefined) setCountry(initial.country);
    if (initial.role !== undefined) setRole(initial.role);
    if (initial.consentContact !== undefined)
      setConsent(initial.consentContact);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrateKey]);
  const canSubmit = questionsDone ? profileReady : false;
  const canAdvance = !questionsDone && nameValid && emailValid && consent;

  const profile: RespondentProfile = {
    name: name.trim(),
    email: email.trim(),
    company: company.trim(),
    companySize,
    industry,
    country: country.trim(),
    role: role.trim(),
    consentContact: consent,
  };

  return (
    <div>
      <div className="mb-8">
        <p className={cn(
          "text-xs font-medium tracking-[0.2em] text-primary/80",
          isRTL ? "" : "uppercase"
        )}>
          {answeredCount >= TOTAL_QUESTIONS
            ? lang === "ar"
              ? quizUI.detailsStepFinal(TOTAL_STEPS, TOTAL_STEPS)
              : `Step ${TOTAL_STEPS} of ${TOTAL_STEPS} — Final step`
            : lang === "ar"
              ? quizUI.detailsStepFirst(1, TOTAL_STEPS)
              : `Step 1 of ${TOTAL_STEPS} — Your details`}
        </p>
        <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {answeredCount >= TOTAL_QUESTIONS
            ? lang === "ar" ? quizUI.detailsTitleFinal : "A few details, then your report."
            : lang === "ar" ? quizUI.detailsTitleFirst : "A few details, then the questions."}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {lang === "ar"
            ? quizUI.detailsSubtitle
            : "We use this to compute your percentile against peer organisations and to send you a copy of your results. Your responses stay confidential."}
        </p>
      </div>

      {resultExists && (
        <div className={cn(
          "mb-6 flex flex-col items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4",
          "sm:flex-row sm:items-center sm:justify-between",
          isRTL && "sm:flex-row-reverse flex-row-reverse"
        )}>
          <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">
                {lang === "ar" ? quizUI.prevBannerTitle : "You have a previous benchmark on file."}
              </p>
              <p className="text-xs text-muted-foreground">
                {lang === "ar" ? quizUI.prevBannerDesc : "You can jump straight to it, or submit again to refresh."}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onGoToResults}>
            {lang === "ar" ? quizUI.prevBannerButton : "Go to results"}
          </Button>
        </div>
      )}

      <div className="grid gap-5 rounded-xl border border-border bg-card p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={lang === "ar" ? quizUI.labelName : "Full name"}
            required
            lang={lang}
            isRTL={isRTL}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </Field>
          <Field
            label={lang === "ar" ? quizUI.labelEmail : "Work email"}
            required
            lang={lang}
            isRTL={isRTL}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              dir="ltr"
            />
          </Field>
          <Field
            label={lang === "ar" ? quizUI.labelCompany : "Company"}
            lang={lang}
            isRTL={isRTL}
          >
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="organization"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </Field>
          <Field
            label={lang === "ar" ? quizUI.labelCompanySize : "Company size"}
            lang={lang}
            isRTL={isRTL}
          >
            <Select value={companySize} onValueChange={setCompanySize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={lang === "ar" ? quizUI.placeholderCompanySize : "Select range"} />
              </SelectTrigger>
              <SelectContent dir={isRTL ? "rtl" : "ltr"}>
                {COMPANY_SIZES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {lang === "ar"
                      ? COMPANY_SIZE_ARABIC_LABELS[s] ?? COMPANY_SIZE_LABELS[s]
                      : COMPANY_SIZE_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field
            label={lang === "ar" ? quizUI.labelIndustry : "Industry"}
            lang={lang}
            isRTL={isRTL}
          >
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={lang === "ar" ? quizUI.placeholderIndustry : "Select industry"} />
              </SelectTrigger>
              <SelectContent dir={isRTL ? "rtl" : "ltr"}>
                {INDUSTRIES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {lang === "ar"
                      ? BENCHMARK_ARABIC_INDUSTRIES[INDUSTRIES.indexOf(s)] ?? s
                      : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field
            label={lang === "ar" ? quizUI.labelCountry : "Country"}
            lang={lang}
            isRTL={isRTL}
          >
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              autoComplete="country-name"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </Field>
          <Field
            label={lang === "ar" ? quizUI.labelRole : "Role / title"}
            className="sm:col-span-2"
            lang={lang}
            isRTL={isRTL}
          >
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              autoComplete="organization-title"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </Field>
        </div>

        <label
          htmlFor="consent"
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3.5 transition-colors hover:bg-secondary/60",
            isRTL && "flex-row-reverse"
          )}
        >
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
            className="mt-0.5"
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            {lang === "ar"
              ? quizUI.consentText
              : "I agree to Trennt storing my responses to generate my benchmark and for aggregated, anonymised reporting. I may be contacted about my results."}
          </span>
        </label>

        <div className={cn(
          "flex flex-col gap-3 border-t border-border pt-5",
          "sm:flex-row sm:items-center sm:justify-between",
          isRTL && "sm:flex-row-reverse"
        )}>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {lang === "ar"
              ? quizUI.formNote
              : "By submitting, you'll see your full maturity report immediately."}
          </p>
          <Button
            type="button"
            size="lg"
            disabled={questionsDone ? !canSubmit : !canAdvance}
            onClick={() =>
              questionsDone ? onSubmit(profile) : onAdvanceToQuestions?.()
            }
            className={cn("gap-2 sm:min-w-[200px]", isRTL && "flex-row-reverse")}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {lang === "ar" ? quizUI.buttonSubmitting : "Submitting…"}
              </>
            ) : questionsDone ? (
              <>
                {lang === "ar" ? quizUI.buttonGetResults : "Get my results"}
                <ArrowRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
              </>
            ) : (
              <>
                {lang === "ar" ? quizUI.buttonStartQuestions : "Start the questions"}
                <ArrowRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
              </>
            )}
          </Button>
        </div>

        {!canSubmit && !canAdvance && !submitting && (
          <div className={cn("flex items-start gap-2 text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              {!nameValid
                ? lang === "ar" ? quizUI.validationName : "Enter your name"
                : !emailValid
                  ? lang === "ar" ? quizUI.validationEmail : "Enter a valid email address"
                  : !consent
                    ? lang === "ar"
                      ? quizUI.validationConsent
                      : "Please review and accept the consent statement to continue"
                    : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
  className,
  lang,
  isRTL,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-xs font-medium text-foreground">
        {label}
        {required && (
          <span className={cn("text-primary", isRTL ? "mr-0.5" : "ml-0.5")}>*</span>
        )}
      </Label>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countUnanswered(responses: Record<string, string>): number {
  let n = 0;
  for (const q of BENCHMARK_QUESTIONS) {
    if (responses[q.id] === undefined) n++;
  }
  return n;
}
