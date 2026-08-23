"use client";

import { create } from "zustand";
import type {
  AssessmentResult,
  Dimension,
  MaturityTier,
  RespondentProfile,
  ViewKey,
} from "./types";
import { BENCHMARK_QUESTIONS, computeResult } from "./content";

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

  let h = window.location.hash.replace(/^#\/?/, "");
  let lang: "en" | "ar" = "en";

  if (h.startsWith("ar/")) {
    lang = "ar";
    h = h.replace("ar/", "");
  } else if (h === "ar") {
    lang = "ar";
    h = "";
  }

  const view = (h || DEFAULT_VIEW) as ViewKey;
  const valid: ViewKey[] = [
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
  ];
  const finalView = valid.includes(view) ? view : DEFAULT_VIEW;
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
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
      set({ view });
    },

    setLang: (lang) => {
      const { view } = get();
      if (typeof window !== "undefined") {
        const prefix = lang === "ar" ? "ar/" : "";
        window.location.hash = `#/${prefix}${view}`;
        // Update document attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = "ltr";
        document.body.dir = lang === "ar" ? "rtl" : "ltr";
      }
      set({ lang });
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
      const responses = get().responses;
      const answers = BENCHMARK_QUESTIONS.filter(
        (q) => typeof responses[q.id] === "string",
      ).map((q) => {
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
