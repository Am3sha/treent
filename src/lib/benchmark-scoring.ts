// ============================================================
// TRENNT — Internal Audit Capability Benchmark (shared scoring)
// Single source of truth for the 26 client-approved questions
// and ALL score math. Front and back end must import from here.
// ============================================================

export type DomainKey =
  | "governance"
  | "risk"
  | "execution"
  | "reporting"
  | "capability";

export interface BenchmarkOption {
  /** "A", "B", "C", "D" */
  letter: string;
  /** Exact option text as client-approved */
  label: string;
  /** Score: A=3, B=2, C=1, D=0 */
  score: number;
}

export interface BenchmarkQuestion {
  /** e.g. "gov-1", "risk-6", ... (domain prefix + sequential number) */
  id: string;
  /** Sequential display number 1..26 */
  number: number;
  domain: DomainKey;
  /** Exact question wording — client approved, do not paraphrase */
  prompt: string;
  /** Scoring options A=3, B=2, C=1, D=0. Q1 has 3 options only. */
  options: BenchmarkOption[];
}

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

/** Max points per domain (A=3 per question) */
export const DOMAIN_MAX_POINTS: Record<DomainKey, number> = {
  governance: 15, // 5 questions
  risk: 15, // 5 questions
  execution: 18, // 6 questions
  reporting: 15, // 5 questions
  capability: 15, // 5 questions
};

/** Total max points: 26 questions, 78 points */
export const TOTAL_MAX_POINTS = 78;

// ---------- Client-approved 26 questions (exact wording) ----------

export const BENCHMARK_QUESTIONS: BenchmarkQuestion[] = [
  // DOMAIN 1: Governance & Operating Model (Q1-Q5, max 15)
  {
    id: "gov-1",
    number: 1,
    domain: "governance",
    prompt: "Who does the CAE report to?",
    options: [
      { letter: "A", label: "Audit Committee, Board, or highest governing body", score: 3 },
      { letter: "B", label: "CEO", score: 2 },
      { letter: "C", label: "Other Management", score: 1 },
    ],
  },
  {
    id: "gov-2",
    number: 2,
    domain: "governance",
    prompt: "Who approves the audit plan?",
    options: [
      { letter: "A", label: "Audit Committee, Board, or highest governing body", score: 3 },
      { letter: "B", label: "Governing body with CEO input", score: 2 },
      { letter: "C", label: "CEO", score: 1 },
      { letter: "D", label: "Other Management", score: 0 },
    ],
  },
  {
    id: "gov-3",
    number: 3,
    domain: "governance",
    prompt: "Who evaluates the CAE's performance?",
    options: [
      { letter: "A", label: "Audit Committee, Board, or highest governing body", score: 3 },
      { letter: "B", label: "Governing body with CEO input", score: 2 },
      { letter: "C", label: "CEO with governing body oversight", score: 1 },
      { letter: "D", label: "Other Management", score: 0 },
    ],
  },
  {
    id: "gov-4",
    number: 4,
    domain: "governance",
    prompt: "Who approves the Internal Audit charter?",
    options: [
      { letter: "A", label: "Audit Committee, Board, or highest governing body", score: 3 },
      { letter: "B", label: "Governing body with CEO input", score: 2 },
      { letter: "C", label: "CEO", score: 1 },
      { letter: "D", label: "Other Management", score: 0 },
    ],
  },
  {
    id: "gov-5",
    number: 5,
    domain: "governance",
    prompt: "How often is the Internal Audit charter reviewed?",
    options: [
      { letter: "A", label: "Annually and when significant changes occur", score: 3 },
      { letter: "B", label: "Annually", score: 2 },
      { letter: "C", label: "Occasionally", score: 1 },
      { letter: "D", label: "Rarely or never", score: 0 },
    ],
  },
  // DOMAIN 2: Risk Assessment & Planning (Q6-Q10, max 15)
  {
    id: "risk-6",
    number: 6,
    domain: "risk",
    prompt: "How is the Internal Audit risk assessment updated?",
    options: [
      { letter: "A", label: "Continuously as risks change", score: 3 },
      { letter: "B", label: "Periodically during the year", score: 2 },
      { letter: "C", label: "Annually", score: 1 },
      { letter: "D", label: "No formal risk assessment", score: 0 },
    ],
  },
  {
    id: "risk-7",
    number: 7,
    domain: "risk",
    prompt: "How are emerging risks addressed?",
    options: [
      { letter: "A", label: "Included promptly in audit planning", score: 3 },
      { letter: "B", label: "Regularly assessed", score: 2 },
      { letter: "C", label: "Considered when needed", score: 1 },
      { letter: "D", label: "Rarely considered", score: 0 },
    ],
  },
  {
    id: "risk-8",
    number: 8,
    domain: "risk",
    prompt: "How is the Internal Audit risk assessment developed?",
    options: [
      { letter: "A", label: "Internal Audit performs an independent risk assessment using multiple relevant risk inputs", score: 3 },
      { letter: "B", label: "Internal Audit performs its own risk assessment with consideration of ERM information", score: 2 },
      { letter: "C", label: "Internal Audit primarily relies on the organization's ERM or Management risk assessment", score: 1 },
      { letter: "D", label: "No formal risk assessment is performed", score: 0 },
    ],
  },
  {
    id: "risk-9",
    number: 9,
    domain: "risk",
    prompt: "How often is the audit plan reviewed?",
    options: [
      { letter: "A", label: "Throughout the year", score: 3 },
      { letter: "B", label: "Quarterly", score: 2 },
      { letter: "C", label: "Annually", score: 1 },
      { letter: "D", label: "Only when required", score: 0 },
    ],
  },
  {
    id: "risk-10",
    number: 10,
    domain: "risk",
    prompt: "How does Internal Audit coordinate its plan with other assurance providers?",
    options: [
      { letter: "A", label: "Through structured coordination and reliance where appropriate", score: 3 },
      { letter: "B", label: "Through regular coordination", score: 2 },
      { letter: "C", label: "Informally when needed", score: 1 },
      { letter: "D", label: "No coordination", score: 0 },
    ],
  },
  // DOMAIN 3: Audit Execution & Strategic Alignment (Q11-Q16, max 18)
  {
    id: "exec-11",
    number: 11,
    domain: "execution",
    prompt: "How consistently are audit programs followed?",
    options: [
      { letter: "A", label: "Always", score: 3 },
      { letter: "B", label: "Usually", score: 2 },
      { letter: "C", label: "Sometimes", score: 1 },
      { letter: "D", label: "Rarely", score: 0 },
    ],
  },
  {
    id: "exec-12",
    number: 12,
    domain: "execution",
    prompt: "How are engagement objectives and scope determined?",
    options: [
      { letter: "A", label: "Based on a documented engagement-level risk assessment", score: 3 },
      { letter: "B", label: "Based on identified risks and prior audit knowledge", score: 2 },
      { letter: "C", label: "Primarily based on a standard or previous audit scope", score: 1 },
      { letter: "D", label: "Primarily based on auditor judgment", score: 0 },
    ],
  },
  {
    id: "exec-13",
    number: 13,
    domain: "execution",
    prompt: "How is audit work reviewed and supervised?",
    options: [
      { letter: "A", label: "Through a defined and documented supervisory review process", score: 3 },
      { letter: "B", label: "Through regular Manager or CAE review", score: 2 },
      { letter: "C", label: "Review practices vary by engagement", score: 1 },
      { letter: "D", label: "No formal review process", score: 0 },
    ],
  },
  {
    id: "exec-14",
    number: 14,
    domain: "execution",
    prompt: "How is consistency maintained across audits?",
    options: [
      { letter: "A", label: "Standardized methodology", score: 3 },
      { letter: "B", label: "Mostly consistent", score: 2 },
      { letter: "C", label: "Depends on the auditor", score: 1 },
      { letter: "D", label: "No defined approach", score: 0 },
    ],
  },
  {
    id: "exec-15",
    number: 15,
    domain: "execution",
    prompt: "How are audit deadlines managed?",
    options: [
      { letter: "A", label: "Consistently achieved", score: 3 },
      { letter: "B", label: "Usually achieved", score: 2 },
      { letter: "C", label: "Frequently delayed", score: 1 },
      { letter: "D", label: "Regularly delayed", score: 0 },
    ],
  },
  {
    id: "exec-16",
    number: 16,
    domain: "execution",
    prompt: "How is Internal Audit aligned with the organization's strategy and objectives?",
    options: [
      { letter: "A", label: "Audit priorities are continuously aligned with strategy, objectives, and changing risks", score: 3 },
      { letter: "B", label: "Audit planning considers the organization's strategy and objectives", score: 2 },
      { letter: "C", label: "Strategy is considered informally or when relevant", score: 1 },
      { letter: "D", label: "Little or no consideration of organizational strategy", score: 0 },
    ],
  },
  // DOMAIN 4: Reporting & Impact (Q17-Q21, max 15)
  {
    id: "rep-17",
    number: 17,
    domain: "reporting",
    prompt: "How are agreed management actions followed up?",
    options: [
      { letter: "A", label: "Based on defined action due dates", score: 3 },
      { letter: "B", label: "Quarterly", score: 2 },
      { letter: "C", label: "Annually", score: 1 },
      { letter: "D", label: "Irregularly or rarely", score: 0 },
    ],
  },
  {
    id: "rep-18",
    number: 18,
    domain: "reporting",
    prompt: "How timely are audit reports issued?",
    options: [
      { letter: "A", label: "Consistently on time", score: 3 },
      { letter: "B", label: "Usually on time", score: 2 },
      { letter: "C", label: "Frequently delayed", score: 1 },
      { letter: "D", label: "Significantly delayed", score: 0 },
    ],
  },
  {
    id: "rep-19",
    number: 19,
    domain: "reporting",
    prompt: "How are significant audit issues escalated?",
    options: [
      { letter: "A", label: "Based on defined escalation criteria", score: 3 },
      { letter: "B", label: "Through an established escalation process", score: 2 },
      { letter: "C", label: "Based on individual judgment", score: 1 },
      { letter: "D", label: "No defined escalation process", score: 0 },
    ],
  },
  {
    id: "rep-20",
    number: 20,
    domain: "reporting",
    prompt: "How are overdue management actions handled?",
    options: [
      { letter: "A", label: "Tracked and escalated based on defined criteria", score: 3 },
      { letter: "B", label: "Regularly tracked and reported", score: 2 },
      { letter: "C", label: "Followed up periodically", score: 1 },
      { letter: "D", label: "No consistent follow-up", score: 0 },
    ],
  },
  {
    id: "rep-21",
    number: 21,
    domain: "reporting",
    prompt: "How does Internal Audit measure its performance?",
    options: [
      { letter: "A", label: "Defined performance measures covering quality, delivery, and stakeholder value", score: 3 },
      { letter: "B", label: "Defined operational performance measures", score: 2 },
      { letter: "C", label: "Mainly completion of the audit plan", score: 1 },
      { letter: "D", label: "No formal performance measures", score: 0 },
    ],
  },
  // DOMAIN 5: Capability & Continuous Improvement (Q22-Q26, max 15)
  {
    id: "cap-22",
    number: 22,
    domain: "capability",
    prompt: "How is the Internal Audit methodology maintained and improved?",
    options: [
      { letter: "A", label: "Regularly reviewed and updated based on changes, quality results, and leading practices", score: 3 },
      { letter: "B", label: "Periodically reviewed and updated", score: 2 },
      { letter: "C", label: "Updated mainly when issues or major changes arise", score: 1 },
      { letter: "D", label: "Rarely or never reviewed", score: 0 },
    ],
  },
  {
    id: "cap-23",
    number: 23,
    domain: "capability",
    prompt: "How does Internal Audit obtain specialist expertise when needed?",
    options: [
      { letter: "A", label: "Through appropriate internal or external specialists based on the required expertise", score: 3 },
      { letter: "B", label: "Through available specialists when possible", score: 2 },
      { letter: "C", label: "Primarily through the existing audit team", score: 1 },
      { letter: "D", label: "Specialist expertise is generally unavailable", score: 0 },
    ],
  },
  {
    id: "cap-24",
    number: 24,
    domain: "capability",
    prompt: "How are Internal Audit competency gaps identified?",
    options: [
      { letter: "A", label: "Through a structured competency assessment", score: 3 },
      { letter: "B", label: "Through periodic performance reviews", score: 2 },
      { letter: "C", label: "Informally by management", score: 1 },
      { letter: "D", label: "No defined assessment", score: 0 },
    ],
  },
  {
    id: "cap-25",
    number: 25,
    domain: "capability",
    prompt: "How is professional development managed?",
    options: [
      { letter: "A", label: "Through structured development plans linked to competency gaps", score: 3 },
      { letter: "B", label: "Through regular training and professional development", score: 2 },
      { letter: "C", label: "Through training when needs arise", score: 1 },
      { letter: "D", label: "No defined development approach", score: 0 },
    ],
  },
  {
    id: "cap-26",
    number: 26,
    domain: "capability",
    prompt: "How is the quality of Internal Audit evaluated?",
    options: [
      { letter: "A", label: "Through a QAIP including ongoing monitoring, internal assessments, and external assessment", score: 3 },
      { letter: "B", label: "Through periodic internal quality assessments", score: 2 },
      { letter: "C", label: "Mainly through engagement-level reviews", score: 1 },
      { letter: "D", label: "No formal quality assessment process", score: 0 },
    ],
  },
];

// ---------- Self-checks (throw on load if the client set is corrupted) ----------

{
  const ids = BENCHMARK_QUESTIONS.map((q) => q.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error("[benchmark-scoring] duplicate question id");
  }
  if (BENCHMARK_QUESTIONS.length !== 26) {
    throw new Error("[benchmark-scoring] expected 26 questions");
  }
  let total = 0;
  const byDomain: Partial<Record<DomainKey, number>> = {};
  for (const q of BENCHMARK_QUESTIONS) {
    const max = Math.max(...q.options.map((o) => o.score));
    if (max !== 3) throw new Error(`[benchmark-scoring] question ${q.id} max option != 3`);
    total += max;
    byDomain[q.domain] = (byDomain[q.domain] ?? 0) + max;
  }
  if (total !== TOTAL_MAX_POINTS) {
    throw new Error(`[benchmark-scoring] total max points ${total} !== ${TOTAL_MAX_POINTS}`);
  }
  for (const d of DOMAIN_ORDER) {
    if (byDomain[d] !== DOMAIN_MAX_POINTS[d]) {
      throw new Error(`[benchmark-scoring] domain ${d} max ${byDomain[d]} !== ${DOMAIN_MAX_POINTS[d]}`);
    }
  }
}

// ---------- Scoring helpers ----------

export interface AnswerRecord {
  questionId: string; // e.g. "gov-1"
  domain: DomainKey;
  score: number;
  selectedOption?: string; // "A" | "B" | "C" | "D" (optional for callers that only need scores)
}

/** Domain score 0-100: earned in domain / max for domain * 100 */
export function calculateDomainScore(answers: AnswerRecord[], domain: DomainKey): number {
  const domainQuestions = BENCHMARK_QUESTIONS.filter((q) => q.domain === domain);
  const maxPoints = DOMAIN_MAX_POINTS[domain];
  const earned = answers
    .filter((a) => a.domain === domain)
    .reduce((sum, a) => sum + a.score, 0);
  if (maxPoints === 0) return 0;
  return (earned / maxPoints) * 100;
}

/** Overall score 0-100: total earned / 78 * 100 (NOT average of domain percentages) */
export function calculateOverallScore(answers: AnswerRecord[]): number {
  const earned = answers.reduce((sum, a) => sum + a.score, 0);
  return (earned / TOTAL_MAX_POINTS) * 100;
}

export interface MaturityLevel {
  level: "initial" | "developing" | "defined" | "established" | "advanced";
  label: string;
}

/** English labels — easy to swap for Arabic later */
export const MATURITY_LEVELS: MaturityLevel[] = [
  { level: "initial", label: "Initial" },
  { level: "developing", label: "Developing" },
  { level: "defined", label: "Defined" },
  { level: "established", label: "Established" },
  { level: "advanced", label: "Advanced" },
];

/** Tier thresholds: initial 0-20 / developing 21-40 / defined 41-60 / established 61-80 / advanced 81-100 */
export function getMaturityLevel(score: number): MaturityLevel {
  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  if (clamped <= 20) return MATURITY_LEVELS[0];
  if (clamped <= 40) return MATURITY_LEVELS[1];
  if (clamped <= 60) return MATURITY_LEVELS[2];
  if (clamped <= 80) return MATURITY_LEVELS[3];
  return MATURITY_LEVELS[4];
}

export type RecommendationBand = "low" | "mid" | "high";

/** 0-40 low | 41-70 mid | 71-100 high */
export function getRecommendationBand(score: number): RecommendationBand {
  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  if (clamped <= 40) return "low";
  if (clamped <= 70) return "mid";
  return "high";
}

/** Convenience: compute all scores from answers in one call */
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
