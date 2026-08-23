// Shared types for the TRENNT Consulting Group site + benchmark tool

export type ViewKey =
  | "home"
  | "about"
  | "services"
  | "internal-audit-outsourcing"
  | "internal-audit-co-sourcing"
  | "internal-audit-function-establishment"
  | "internal-audit-transformation"
  | "quality-assurance-and-improvement-program"
  | "framework-agreements"
  | "contact"
  | "careers"
  | "legal"
  | "benchmark-landing"
  | "benchmark-quiz"
  | "benchmark-results"
  | "benchmark-followup"
  | "benchmark-insights"
  | "not-found";

// Note: the canonical question set + all score math live in
// src/lib/benchmark-scoring.ts (client-approved 26 questions, A=3/B=2/C=1/D=0).
export type Dimension =
  | "governance"
  | "risk"
  | "execution"
  | "reporting"
  | "capability";

export interface DimensionMeta {
  key: Dimension;
  label: string;
  short: string;
  description: string;
  icon: string; // lucide icon name
  accent: string; // tailwind text color class for accents
}

export interface BenchmarkOption {
  letter: "A" | "B" | "C" | "D";
  label: string;
  score: number; // A=3, B=2, C=1, D=0
}

export interface BenchmarkQuestion {
  id: string;
  number: number; // 1..26
  dimension: Dimension;
  prompt: string;
  help?: string;
  // Multiple-choice options; Q1 has 3 options (A/B/C), all others 4 (A/B/C/D).
  options: BenchmarkOption[];
}

export interface AssessmentAnswerRecord {
  questionId: string;
  domain: Dimension;
  selectedOption: string; // "A" | "B" | "C" | "D"
  score: number;
}

export interface AssessmentResult {
  id: string;
  overall: number;
  scores: Record<Dimension, number>;
  tier: MaturityTier;
  percentile: number; // 0-100 position vs benchmark dataset
  questionCount: number;
  createdAt: string;
  answers?: AssessmentAnswerRecord[];
}

export type MaturityTier =
  | "initial"
  | "developing"
  | "defined"
  | "established"
  | "advanced";

export interface RespondentProfile {
  name: string;
  email: string;
  company: string;
  companySize: string;
  industry: string;
  country: string;
  role: string;
  consentContact: boolean;
}

export interface BenchmarkStats {
  totalAssessments: number;
  averageOverall: number;
  dimensionAverages: Record<Dimension, number>;
  tierDistribution: Record<string, number>;
  byIndustry: { label: string; count: number; average: number }[];
  byCompanySize: { label: string; count: number; average: number }[];
  trend: { weekStart: string; count: number; average: number }[];
  avgDurationSec: number;
}

export type LocalizedString = string | { en: string; ar: string };

export interface ServiceItem {
  slug: string;
  title: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  icon: string;
  outcomes: LocalizedString[];
  deliverables: LocalizedString[];
}

export interface CareerItem {
  slug: string;
  title: LocalizedString;
  team: LocalizedString;
  location: LocalizedString;
  type: "Full-time" | "Part-time" | "Contract";
  level: LocalizedString;
  summary: LocalizedString;
  responsibilities: LocalizedString[];
  requirements: LocalizedString[];
}

export interface TeamMember {
  name: string;
  role: LocalizedString;
  bio: LocalizedString;
  initials: string;
}
