"use client";

import { create } from "zustand";
import type {
  AssessmentResult,
  Dimension,
  MaturityTier,
  RespondentProfile,
  ViewKey,
} from "./types";
import {
  BENCHMARK_QUESTIONS,
  DIMENSIONS,
  scoreToTier,
} from "./content";

interface NavState {
  view: ViewKey;
  // assessment session
  responses: Record<string, number>; // questionId -> value
  respondent: RespondentProfile | null;
  result: AssessmentResult | null;
  startedAt: number | null;
  setView: (view: ViewKey) => void;
  navigate: (view: ViewKey) => void;
  setResponse: (questionId: string, value: number) => void;
  resetResponses: () => void;
  setRespondent: (r: RespondentProfile) => void;
  setResult: (r: AssessmentResult) => void;
  startAssessment: () => void;
  // compute scores from current responses (local preview)
  computeLocalScores: () => {
    overall: number;
    scores: Record<Dimension, number>;
    tier: MaturityTier;
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
    "contact",
    "careers",
    "benchmark-landing",
    "benchmark-quiz",
    "benchmark-results",
    "benchmark-followup",
  ];
  return valid.includes(h) ? h : DEFAULT_VIEW;
}

export const useNav = create<NavState>((set, get) => ({
  view: DEFAULT_VIEW,
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

  setResponse: (questionId, value) =>
    set((s) => ({ responses: { ...s.responses, [questionId]: value } })),

  resetResponses: () => set({ responses: {}, result: null, startedAt: null }),

  setRespondent: (r) => set({ respondent: r }),

  setResult: (r) => set({ result: r }),

  startAssessment: () =>
    set({ responses: {}, result: null, startedAt: Date.now() }),

  computeLocalScores: () => {
    const responses = get().responses;
    const byDimension: Record<Dimension, { sum: number; count: number }> = {
      strategy: { sum: 0, count: 0 },
      technology: { sum: 0, count: 0 },
      culture: { sum: 0, count: 0 },
      data: { sum: 0, count: 0 },
      operations: { sum: 0, count: 0 },
    };
    let answered = 0;
    for (const q of BENCHMARK_QUESTIONS) {
      const v = responses[q.id];
      if (typeof v === "number") {
        byDimension[q.dimension].sum += v;
        byDimension[q.dimension].count += 1;
        answered += 1;
      }
    }
    if (answered === 0) return null;
    const scores = {} as Record<Dimension, number>;
    let totalSum = 0;
    let totalWeight = 0;
    for (const d of DIMENSIONS) {
      const { sum, count } = byDimension[d.key];
      // normalise 1-5 scale to 0-100
      const dimScore = count > 0 ? Math.round(((sum / count) - 1) / 4 * 100) : 0;
      scores[d.key] = dimScore;
      totalSum += dimScore * count;
      totalWeight += count;
    }
    const overall = totalWeight > 0 ? Math.round(totalSum / totalWeight) : 0;
    return { overall, scores, tier: scoreToTier(overall), questionCount: answered };
  },
}));
