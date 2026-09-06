// ============================================================
// TRENNT — Internal Audit Capability Benchmark (shared scoring)
// Score math and constants ONLY — no question data here.
// The 26 client-approved questions live in benchmark-questions.ts
// so they can be code-split and loaded on-demand only when a
// user actually starts the benchmark, not on every page load.
// Front and back end: import questions from benchmark-questions.ts
// and import scoring math from this file as needed.
// ============================================================

export type DomainKey =
  | "governance"
  | "risk"
  | "execution"
  | "reporting"
  | "capability";

export type { BenchmarkOption, BenchmarkQuestion } from "./types";

// ---------- Domain constants ----------

export const DOMAIN_LABELS: Record<DomainKey, string> = {
  governance: "Governance & Operating Model",
  risk: "Risk Assessment & Planning",
  execution: "Audit Execution & Strategic Alignment",
  reporting: "Reporting & Impact",
  capability: "Capability & Continuous Improvement",
};

export const DOMAIN_ORDER: DomainKey[] = [
  "governance",
  "risk",
  "execution",
  "reporting",
  "capability",
];

export const DOMAIN_MAX_POINTS: Record<DomainKey, number> = {
  governance: 15,
  risk: 15,
  execution: 18,
  reporting: 15,
  capability: 15,
};

export const TOTAL_MAX_POINTS = 78;

// ---------- Scoring helpers ----------

export interface AnswerRecord {
  questionId: string;
  domain: DomainKey;
  score: number;
  selectedOption?: string;
}

export function calculateDomainScore(answers: AnswerRecord[], domain: DomainKey): number {
  const maxPoints = DOMAIN_MAX_POINTS[domain];
  const earned = answers
    .filter((a) => a.domain === domain)
    .reduce((sum, a) => sum + a.score, 0);
  if (maxPoints === 0) return 0;
  return (earned / maxPoints) * 100;
}

export function calculateOverallScore(answers: AnswerRecord[]): number {
  const earned = answers.reduce((sum, a) => sum + a.score, 0);
  return (earned / TOTAL_MAX_POINTS) * 100;
}

export interface MaturityLevel {
  level: "initial" | "developing" | "defined" | "established" | "advanced";
  label: string;
}

export const MATURITY_LEVELS: MaturityLevel[] = [
  { level: "initial", label: "Initial" },
  { level: "developing", label: "Developing" },
  { level: "defined", label: "Defined" },
  { level: "established", label: "Established" },
  { level: "advanced", label: "Advanced" },
];

export function getMaturityLevel(score: number): MaturityLevel {
  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  if (clamped <= 20) return MATURITY_LEVELS[0];
  if (clamped <= 40) return MATURITY_LEVELS[1];
  if (clamped <= 60) return MATURITY_LEVELS[2];
  if (clamped <= 80) return MATURITY_LEVELS[3];
  return MATURITY_LEVELS[4];
}

export type RecommendationBand = "low" | "mid" | "high";

export function getRecommendationBand(score: number): RecommendationBand {
  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  if (clamped <= 40) return "low";
  if (clamped <= 70) return "mid";
  return "high";
}

export function calculateAllScores(answers: AnswerRecord[]) {
  return {
    overall: calculateOverallScore(answers),
    domains: Object.fromEntries(
      DOMAIN_ORDER.map((d) => [d, calculateDomainScore(answers, d)]),
    ) as Record<DomainKey, number>,
    maturity: getMaturityLevel(calculateOverallScore(answers)),
    band: getRecommendationBand(calculateOverallScore(answers)),
  };
}

export type BenchmarkComputeResult = {
  overall: number;
  scores: Record<DomainKey, number>;
  tier: MaturityLevel["level"];
  band: RecommendationBand;
};

export function computeResult(answers: AnswerRecord[]): BenchmarkComputeResult {
  const overall = Math.round(calculateOverallScore(answers));
  return {
    overall,
    scores: Object.fromEntries(
      DOMAIN_ORDER.map((d) => [d, Math.round(calculateDomainScore(answers, d))]),
    ) as Record<DomainKey, number>,
    tier: getMaturityLevel(overall).level,
    band: getRecommendationBand(overall),
  };
}
