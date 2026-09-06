// ============================================================
// TRENNT — Internal Audit Capability Benchmark (Questions Only)
// Physically separated from scoring math so this large array
// can be code-split into its own chunk and loaded on-demand,
// not bundled into the home page initial bundle via store.ts.
// ============================================================

import type { BenchmarkQuestion, BenchmarkOption } from "./types";
import {
  DOMAIN_ORDER,
  DOMAIN_MAX_POINTS,
  TOTAL_MAX_POINTS,
} from "./benchmark-scoring";

export const BENCHMARK_QUESTIONS: BenchmarkQuestion[] = [
  // DOMAIN 1: Governance & Operating Model (Q1-Q5, max 15)
  {
    id: "gov-1",
    number: 1,
    dimension: "governance",
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
    dimension: "governance",
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
    dimension: "governance",
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
    dimension: "governance",
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
    dimension: "governance",
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
    dimension: "risk",
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
    dimension: "risk",
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
    dimension: "risk",
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
    dimension: "risk",
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
    dimension: "risk",
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
    dimension: "execution",
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
    dimension: "execution",
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
    dimension: "execution",
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
    dimension: "execution",
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
    dimension: "execution",
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
    dimension: "execution",
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
    dimension: "reporting",
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
    dimension: "reporting",
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
    dimension: "reporting",
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
    dimension: "reporting",
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
    dimension: "reporting",
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
    dimension: "capability",
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
    dimension: "capability",
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
    dimension: "capability",
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
    dimension: "capability",
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
    dimension: "capability",
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
    throw new Error("[benchmark-questions] duplicate question id");
  }
  if (BENCHMARK_QUESTIONS.length !== 26) {
    throw new Error("[benchmark-questions] expected 26 questions");
  }
  let total = 0;
  const byDomain: Partial<Record<BenchmarkQuestion["dimension"], number>> = {};
  for (const q of BENCHMARK_QUESTIONS) {
    const max = Math.max(...q.options.map((o) => o.score));
    if (max !== 3) throw new Error(`[benchmark-questions] question ${q.id} max option != 3`);
    total += max;
    byDomain[q.dimension] = (byDomain[q.dimension] ?? 0) + max;
  }
  if (total !== TOTAL_MAX_POINTS) {
    throw new Error(`[benchmark-questions] total max points ${total} !== ${TOTAL_MAX_POINTS}`);
  }
  for (const d of DOMAIN_ORDER as BenchmarkQuestion["dimension"][]) {
    if (byDomain[d] !== DOMAIN_MAX_POINTS[d]) {
      throw new Error(
        `[benchmark-questions] domain ${d} max ${byDomain[d]} !== ${DOMAIN_MAX_POINTS[d]}`,
      );
    }
  }
}
