// Shared types for the Meridian Advisory site + benchmark tool

export type ViewKey =
  | "home"
  | "about"
  | "services"
  | "contact"
  | "careers"
  | "resources"
  | "work"
  | "benchmark-landing"
  | "benchmark-quiz"
  | "benchmark-results"
  | "benchmark-followup"
  | "benchmark-insights";

export type Dimension =
  | "strategy"
  | "technology"
  | "culture"
  | "data"
  | "operations";

export interface DimensionMeta {
  key: Dimension;
  label: string;
  short: string;
  description: string;
  icon: string; // lucide icon name
  accent: string; // tailwind text color class for accents
}

export interface BenchmarkQuestion {
  id: string;
  dimension: Dimension;
  prompt: string;
  help?: string;
  // 1-5 Likert; labels shown under the scale
  labels: { value: number; label: string }[];
  reverse?: boolean; // if true, higher value = lower maturity (handled in scoring)
}

export interface AssessmentResult {
  id: string;
  overall: number;
  scores: Record<Dimension, number>;
  tier: MaturityTier;
  percentile: number; // 0-100 position vs benchmark dataset
  questionCount: number;
  createdAt: string;
}

export type MaturityTier =
  | "Nascent"
  | "Developing"
  | "Established"
  | "Leading";

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
  tierDistribution: Record<MaturityTier, number>;
  byIndustry: { label: string; count: number; average: number }[];
  byCompanySize: { label: string; count: number; average: number }[];
  trend: { weekStart: string; count: number; average: number }[];
  avgDurationSec: number;
}

export interface ServiceItem {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  outcomes: string[];
  deliverables: string[];
}

export interface CareerItem {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  level: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  sector: string;
  duration: string;
  result: string;
  metric: string;
  metricLabel: string;
  summary: string;
  challenge: string[];
  approach: string[];
  outcomes: { label: string; value: string }[];
  quote?: { text: string; author: string; title: string };
  services: string[];
  icon: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: "Strategy" | "Data & AI" | "Operations" | "Culture" | "Perspective";
  author: string;
  authorRole: string;
  date: string; // ISO date
  readMinutes: number;
  icon: string; // lucide icon name
  // Body is an array of blocks rendered by the article view.
  body: ArticleBlock[];
}

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string };
