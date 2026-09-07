"use client";

import { startTransition } from "react";
import { create } from "zustand";
import type {
  AssessmentResult,
  BenchmarkQuestion,
  Dimension,
  MaturityTier,
  RespondentProfile,
  ViewKey,
} from "./types";
import { computeResult, type AnswerRecord } from "./benchmark-scoring";
import { isValidView, parseHashRoute } from "./routes";
import { ensureArabicLoaded } from "./i18n";

let cachedQuestions: BenchmarkQuestion[] | null = null;
let questionsLoadPromise: Promise<void> | null = null;

function getQuestionsOrKickoff(): BenchmarkQuestion[] | null {
  if (cachedQuestions) return cachedQuestions;
  if (questionsLoadPromise) return null;
  questionsLoadPromise = import("./benchmark-questions")
    .then((mod) => {
      cachedQuestions = mod.BENCHMARK_QUESTIONS;
    })
    .catch((e) => {
      console.warn("[store] Failed to lazy-load benchmark questions:", e);
      cachedQuestions = [];
    });
  return null;
}

if (typeof window !== "undefined") {
  getQuestionsOrKickoff();
}

interface NavState {
  view: ViewKey;
  lang: "en" | "ar";
  // assessment session — questionId -> selected option letter ("A"/"B"/"C"/"D")
  responses: Record<string, string>;
  respondent: RespondentProfile | null;
  result: AssessmentResult | null;
  startedAt: number | null;
  setView: (view: ViewKey) => void;
  setLang: (lang: "en" | "ar") => void;
  navigate: (view: ViewKey) => void;
  setResponse: (questionId: string, optionLetter: string) => void;
  resetResponses: () => void;
  setRespondent: (r: RespondentProfile) => void;
  setResult: (r: AssessmentResult) => void;
  startAssessment: () => void;
  // compute scores from current responses (local preview)
  computeLocalScores: () => {
    overall: number;
    scores: Record<Dimension, number>;
    tier: MaturityTier;
    band: "low" | "mid" | "high";
    questionCount: number;
  } | null;
}

const DEFAULT_VIEW: ViewKey = "home";

function parseHash(): { view: ViewKey; lang: "en" | "ar" } {
  if (typeof window === "undefined") return { view: DEFAULT_VIEW, lang: "en" };

  const { lang, rest } = parseHashRoute(window.location.hash);
  const view = (rest || DEFAULT_VIEW) as ViewKey;
  const finalView = isValidView(view) ? view : DEFAULT_VIEW;
  return { view: finalView, lang };
}

export const useNav = create<NavState>((set, get) => {
  const initial = parseHash();

  return {
    view: initial.view,
    lang: initial.lang,
    responses: {},
    respondent: null,
    result: null,
    startedAt: null,

    setView: (view) => {
      const { lang } = get();
      if (typeof window !== "undefined") {
        const prefix = lang === "ar" ? "ar/" : "";
        window.location.hash = `#/${prefix}${view}`;
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      startTransition(() => set({ view }));
    },

    setLang: (lang) => {
      const { view } = get();
      if (lang === "ar") {
        ensureArabicLoaded();
      }
      if (typeof window !== "undefined") {
        const prefix = lang === "ar" ? "ar/" : "";
        window.location.hash = `#/${prefix}${view}`;
        // Update document attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = "ltr";
        document.body.dir = lang === "ar" ? "rtl" : "ltr";
      }
      startTransition(() => set({ lang }));
    },

    navigate: (view) => get().setView(view),

    setResponse: (questionId, optionLetter) =>
      set((s) => ({ responses: { ...s.responses, [questionId]: optionLetter } })),

    resetResponses: () => set({ responses: {}, result: null, startedAt: null }),

    setRespondent: (r) => set({ respondent: r }),

    setResult: (r) => set({ result: r }),

    startAssessment: () =>
      set({ responses: {}, result: null, startedAt: Date.now() }),

    computeLocalScores: () => {
      const questions = getQuestionsOrKickoff();
      if (!questions || questions.length === 0) return null;
      const responses = get().responses;
      const answers: AnswerRecord[] = questions
        .filter((q) => typeof responses[q.id] === "string")
        .map((q) => {
          const letter = responses[q.id];
          const opt = q.options.find((o) => o.letter === letter);
          return {
            questionId: q.id,
            domain: q.dimension,
            selectedOption: letter ?? "",
            score: opt?.score ?? 0,
          };
        });
      if (answers.length === 0) return null;
      const r = computeResult(answers);
      return {
        overall: r.overall,
        scores: r.scores as Record<Dimension, number>,
        tier: r.tier as MaturityTier,
        band: r.band,
        questionCount: answers.length,
      };
    },
  };
});

// C4: for /#/ar/... deep links, start the Arabic dictionary chunk fetch at
// module-eval time - parallel to app JS and hydration - so the AR text for the
// route swap commit is already loaded and Arabic webfont fetch begins early.
// Direction/layout flipping is done declaratively: an inline <head> script in
// layout.tsx sets html[data-ar-boot] when the landing hash is Arabic, and a
// globals.css rule applies RTL direction to <body> via that attribute - before
// any AR paint - instead of mutating DOM body.dir mid-session (which caused a
// full-viewport horizontal shift while a transition held the old page visible).
if (typeof window !== "undefined" && parseHash().lang === "ar") {
  void ensureArabicLoaded();
}
