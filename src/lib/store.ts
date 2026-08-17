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
  // assessment session — questionId -> selected option letter ("A"/"B"/"C"/"D")
  responses: Record<string, string>;
  respondent: RespondentProfile | null;
  result: AssessmentResult | null;
  startedAt: number | null;
  setView: (view: ViewKey) => void;
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

function readHashView(): ViewKey {
  if (typeof window === "undefined") return DEFAULT_VIEW;
  const h = window.location.hash.replace(/^#\/?/, "") as ViewKey;
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
  return valid.includes(h) ? h : DEFAULT_VIEW;
}

export const useNav = create<NavState>((set, get) => ({
  view: readHashView(),
  responses: {},
  respondent: null,
  result: null,
  startedAt: null,

  setView: (view) => {
    if (typeof window !== "undefined") {
      window.location.hash = `/${view}`;
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
    set({ view });
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
}));
