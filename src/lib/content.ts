import type {
  BenchmarkQuestion,
  CareerItem,
  DimensionMeta,
  ServiceItem,
  TeamMember,
} from "./types";

// ---------------------------------------------------------------------------
// Company
// ---------------------------------------------------------------------------

export const COMPANY = {
  name: "Trennt",
  legalName: "Trennt Partners",
  tagline: "Internal Audit. Delivered with Independence.",
  description:
    "Trennt is a Saudi Arabia-based firm specialising exclusively in internal audit. We give Boards, Audit Committees, and executive management clear, objective insight into governance, risk management, and internal control effectiveness.",
  foundedYear: 2014,
  email: "info@trennt.sa",
  phone: "+966 50 123 4567",
    address: "Riyadh, Saudi Arabia",
  offices: [
    { city: "Riyadh", country: "Saudi Arabia", flag: "SA" },
  ],
  social: {
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
  },
};

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const SERVICES: ServiceItem[] = [
  {
    slug: "internal-audit-outsourcing",
    title: "Internal Audit Outsourcing",
    tagline: "Trennt runs your internal audit function end to end.",
    description:
      "Trennt can take responsibility for the organisation's internal audit activities through an independent, structured, and risk-focused delivery model.",
    icon: "Users",
    outcomes: [
      "Risk Assessment & Annual Audit Planning",
      "Execution of the Approved Audit Plan",
      "Reporting to Management & Audit Committee",
      "Issue Follow-Up and Action Tracking",
      "Ongoing Management of Internal Audit Activities",
    ],
    deliverables: [
      "Annual risk-based audit plan",
      "Full audit delivery with reports",
      "Audit committee reporting pack",
      "Follow-up tracking system",
    ],
  },
  {
    slug: "internal-audit-co-sourcing",
    title: "Internal Audit Co-Sourcing",
    tagline: "Additional capacity, specialist expertise, and seamless integration.",
    description:
      "Our co-sourcing model strengthens an existing internal audit function with targeted support, specialist expertise, and delivery capacity while preserving its overall structure.",
    icon: "Users2",
    outcomes: [
      "Targeted Internal Audit Assignments",
      "Additional Support for the Annual Audit Plan",
      "Collaboration with the Existing Internal Audit Team",
      "Coverage Across Diverse Risk & Business Areas",
      "Delivery Aligned with the Organisation's or Trennt's Methodology",
    ],
    deliverables: [
      "Co-sourced audit engagements",
      "Integration with your team",
      "Flexible delivery options",
    ],
  },
  {
    slug: "internal-audit-function-establishment",
    title: "Internal Audit Function Establishment",
    tagline: "Establishing the foundations for a fully running function.",
    description:
      "Trennt designs and puts in place internal audit functions aligned with governance expectations and the IIA Global Internal Audit Standards.",
    icon: "Building2",
    outcomes: [
      "Internal Audit Governance Structure",
      "Internal Audit Strategy",
      "Internal Audit Charter",
      "Target Operating Model",
      "Audit Methodology & Procedures",
      "Function Implementation & Launch",
    ],
    deliverables: [
      "Internal audit charter",
      "Governance framework documentation",
      "Operating model design",
      "Methodology and tools",
    ],
  },
  {
    slug: "internal-audit-transformation",
    title: "Internal Audit Transformation",
    tagline: "Turn an existing function into a more effective one.",
    description:
      "A structured transformation journey for organisations seeking a more effective, relevant, and sustainable internal audit function.",
    icon: "RefreshCcw",
    outcomes: [
      "Current-State & Maturity Assessment",
      "Governance Model Enhancement",
      "Operating Model Optimisation",
      "Methodology & Process Enhancement",
      "Internal Audit Capability Development",
      "Prioritised Transformation Roadmap",
    ],
    deliverables: [
      "Current state assessment report",
      "Transformation roadmap",
      "Enhanced methodology",
      "Capability development plan",
    ],
  },
  {
    slug: "quality-assurance-and-improvement-program",
    title: "Quality Assurance & Improvement Program (QAIP)",
    tagline: "Independent evidence of internal audit quality.",
    description:
      "Independent assessment and improvement support to help internal audit functions evaluate performance and strengthen alignment with the IIA Global Internal Audit Standards.",
    icon: "CheckCircle2",
    outcomes: [
      "Internal Quality Assessments",
      "Assessment of Standards Conformance",
      "Identification of Improvement Opportunities",
      "Preparation for External Quality Assessments",
      "Ongoing Quality & Performance Monitoring",
    ],
    deliverables: [
      "QAIP assessment report",
      "Conformance statement",
      "Improvement plan",
      "External assessment readiness guide",
    ],
  },
];

// ---------------------------------------------------------------------------
// Methodology steps (Engagement Process)
// ---------------------------------------------------------------------------

export const METHODOLOGY = [
  {
    step: "01",
    title: "Initial Discussion",
    description:
      "Clarifying the organisation's needs, priorities, and expectations.",
    icon: "MessageSquare",
  },
  {
    step: "02",
    title: "Engagement Scoping",
    description:
      "Agreeing the scope, objectives, deliverables, and resources required.",
    icon: "Scope",
  },
  {
    step: "03",
    title: "Engagement Agreement",
    description:
      "Confirming the commercial terms and delivery arrangements.",
    icon: "FileText",
  },
  {
    step: "04",
    title: "Internal Audit Delivery",
    description:
      "Delivering the agreed work, reporting, and follow-up activities.",
    icon: "CheckSquare",
  },
];

// ---------------------------------------------------------------------------
// Framework Agreements
// ---------------------------------------------------------------------------

export const FRAMEWORK_AGREEMENTS = {
  title: "Framework Agreements",
  description:
    "A flexible model for ongoing internal audit support, covering future Internal Audit Outsourcing and Co-Sourcing engagements as needs arise.",
  includes: [
    "Commercial & Engagement Terms",
    "Reporting & Communication Arrangements",
    "Standard Engagement Process",
  ],
  additional: "Once the framework is in place, individual assignments can be initiated efficiently as organisational requirements emerge.",
};

// ---------------------------------------------------------------------------
// Careers
// ---------------------------------------------------------------------------

export const CAREERS: CareerItem[] = [
  {
    slug: "internal-audit-senior",
    title: "Senior Internal Auditor",
    team: "Internal Audit",
    location: "Riyadh",
    type: "Full-time",
    level: "Senior",
    summary:
      "Join our team of internal audit professionals and work with leading organisations across sectors.",
    responsibilities: [
      "Lead internal audit engagements",
      "Develop risk-based audit plans",
      "Prepare audit reports",
      "Engage with audit committees and management",
    ],
    requirements: [
      "5+ years internal audit experience",
      "Strong understanding of IIA standards",
      "Experience in governance, risk, and controls",
      "Excellent communication skills",
    ],
  },
];

export const PERKS = [
  { title: "Professional Growth", description: "Continuous learning and development in internal audit.", icon: "GraduationCap" },
  { title: "Impactful Work", description: "Work with leading organisations to strengthen governance and controls.", icon: "TrendingUp" },
  { title: "Collaborative Team", description: "Work with experienced internal audit professionals.", icon: "Users" },
];

// ---------------------------------------------------------------------------
// Benchmark: dimensions + questions (unchanged)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Benchmark: domains + client-approved 26 questions
// Canonical question set and score math live in benchmark-scoring.ts.
// ---------------------------------------------------------------------------

export const DIMENSIONS: DimensionMeta[] = [
  {
    key: "governance",
    label: "Governance & Operating Model",
    short: "Governance",
    description:
      "Reporting lines, charter approval, CAE evaluation, and independence of the internal audit function.",
    icon: "ShieldCheck",
    accent: "text-emerald-700",
  },
  {
    key: "risk",
    label: "Risk Assessment & Planning",
    short: "Risk",
    description:
      "Maturity of the audit risk assessment, treatment of emerging risks, and audit plan coordination.",
    icon: "Target",
    accent: "text-amber-700",
  },
  {
    key: "execution",
    label: "Audit Execution & Strategic Alignment",
    short: "Execution",
    description:
      "Methodology rigour, supervisory review, delivery consistency, and alignment with organisational strategy.",
    icon: "Workflow",
    accent: "text-teal-700",
  },
  {
    key: "reporting",
    label: "Reporting & Impact",
    short: "Reporting",
    description:
      "Timeliness of reporting, follow-up of management actions, escalation, and audit performance measurement.",
    icon: "FileChartColumn",
    accent: "text-blue-700",
  },
  {
    key: "capability",
    label: "Capability & Continuous Improvement",
    short: "Capability",
    description:
      "Specialist expertise, competency assessment, professional development, and quality assurance (QAIP).",
    icon: "GraduationCap",
    accent: "text-orange-700",
  },
];

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
// Scoring helpers — delegate to the single source of truth in benchmark-scoring.ts
import {
  calculateDomainScore,
  calculateOverallScore,
  getMaturityLevel,
  getRecommendationBand,
  DOMAIN_ORDER,
  MATURITY_LEVELS,
  type AnswerRecord,
} from "./benchmark-scoring";


export {
  calculateDomainScore,
  calculateOverallScore,
  getMaturityLevel,
  getRecommendationBand,
  DOMAIN_ORDER,
  DOMAIN_MAX_POINTS,
  TOTAL_MAX_POINTS,
  MATURITY_LEVELS,
  type AnswerRecord,
} from "./benchmark-scoring";

export function scoreToTier(score: number): import("./types").MaturityTier {
  return getMaturityLevel(score).level;
}

export const TIER_META: Record<
  import("./types").MaturityTier,
  { label: string; summary: string; color: string; range: string }
> = {
  initial: {
    label: "Initial",
    summary:
      "Internal audit foundational practices are still forming. Prioritise charter clarity, risk-based audit planning basics, and governance alignment before investing in tooling or advanced methodologies.",
    color: "oklch(0.55 0.12 35)",
    range: "0 – 20",
  },
  developing: {
    label: "Developing",
    summary:
      "Pockets of strong internal audit practice exist. The priority is to connect them into a repeatable, risk-aligned system with formalised methodology, clear reporting cadence, and consistent quality assurance.",
    color: "oklch(0.72 0.13 75)",
    range: "21 – 40",
  },
  defined: {
    label: "Defined",
    summary:
      "Core processes are defined and repeatable. The focus now is consistency: embedding a standard methodology, formalising QAIP elements, and tightening follow-up discipline across engagements.",
    color: "oklch(0.6 0.12 250)",
    range: "41 – 60",
  },
  established: {
    label: "Established",
    summary:
      "A coherent, risk-based internal audit operating model is in place. The next step is to mature from efficient assurance delivery to proactive, insight-driven audit — strengthening control environment oversight and audit analytics capability.",
    color: "oklch(0.55 0.1 162)",
    range: "61 – 80",
  },
  advanced: {
    label: "Advanced",
    summary:
      "Your internal audit function operates at the frontier of maturity. Focus shifts to sustaining excellence through continuous QAIP monitoring, advanced data-driven audit techniques, strategic audit committee advisory, and proactive risk foresight across the enterprise.",
    color: "oklch(0.52 0.1 195)",
    range: "81 – 100",
  },
};

export const TIER_RECOMMENDATIONS: Record<import("./types").MaturityTier, string[]> = {
  initial: [
    "Prioritise foundational governance: formalise the Internal Audit Charter with clear mandate, independence, and reporting lines to the Audit Committee.",
    "Develop a risk-based annual audit plan aligned to the organisation's key risk areas, with explicit resource allocation and timelines.",
    "Document core internal audit methodology and working paper standards to ensure consistent, repeatable engagement delivery.",
  ],
  developing: [
    "Strengthen the control environment: implement a Quality Assurance and Improvement Program (QAIP) with regular internal assessments and documented findings.",
    "Formalise audit committee reporting cadence with structured reporting templates covering risk coverage, issues tracking, and remediation status.",
    "Build foundational audit analytics capability: establish data access protocols and deploy basic analytical procedures across high-risk audit cycles.",
  ],
  defined: [
    "Standardise engagement delivery: enforce documented engagement-level risk assessments, supervisory review, and consistent methodology across all audits.",
    "Formalise action follow-up discipline: define due dates, escalation criteria, and regular overdue-action reporting to the Audit Committee.",
    "Introduce structured competency assessments to identify and close capability gaps in the audit team.",
  ],
  established: [
    "Advance QAIP maturity: prepare for external quality assessment readiness and ensure full conformance with the IIA Global Internal Audit Standards.",
    "Integrate continuous auditing techniques and automated control testing for key financial and operational systems.",
    "Elevate audit analytics: deploy advanced data analytics across the audit plan, with a measured portfolio of continuous audit scripts.",
  ],
  advanced: [
    "Sustain the edge through proactive risk foresight: integrate horizon-scanning and emerging risk identification into strategic audit planning and audit committee advisory.",
    "Formalise strategic audit committee advisory: position Internal Audit as a trusted strategic advisor beyond assurance, providing insights on governance, risk culture, and control optimisation.",
    "Operationalise advanced, data-driven audit: leverage predictive analytics and continuous risk monitoring as default practice, with clear ownership and governance over models and data pipelines.",
  ],
};


/**
 * Recommendation text bank + service CTA mapping (Part 6).
 * Score bands: low = 0-40%, mid = 41-70%, high = 71-100%.
 * Each entry maps a domain + score band to pre-written recommendation text
 * and the most relevant TRENNT service page slug (null when no CTA is needed).
 */
export const DOMAIN_RECOMMENDATIONS: Record<
  import("./types").Dimension,
  {
    low: { text: string; ctaService: string | null };
    mid: { text: string; ctaService: string | null };
    high: { text: string; ctaService: string | null };
  }
> = {
  governance: {
    low: {
      text: "Your internal audit function's governance foundation needs attention. Formalise the Internal Audit Charter with a clear mandate and reporting line to the Audit Committee, and ensure the Chief Audit Executive is independently evaluated and positioned to raise issues without restriction.",
      ctaService: "internal-audit-function-establishment",
    },
    mid: {
      text: "Governance is forming but not yet fully embedded. Tighten independence safeguards, formalise the CAE's evaluation and access to the Audit Committee, and document escalation procedures so findings consistently reach the right level of leadership.",
      ctaService: "internal-audit-transformation",
    },
    high: {
      text: "Governance and operating-model maturity is strong. Continue reinforcing independence and charter currency, and consider extending your model toward more strategic advisory engagement with the Audit Committee.",
      ctaService: null,
    },
  },
  risk: {
    low: {
      text: "Risk-based audit planning is not yet driving your audit plan. Develop a structured annual risk assessment tied to the organisation's key risks, and build the discipline to rebalance coverage as risks evolve rather than auditing on a fixed rotation.",
      ctaService: "internal-audit-transformation",
    },
    mid: {
      text: "Your risk assessment exists but could be more dynamic. Introduce emerging-risk monitoring, strengthen coordination with management's risk function, and ensure the annual plan is explicitly derived from documented risk prioritisation.",
      ctaService: "internal-audit-transformation",
    },
    high: {
      text: "Risk assessment and planning maturity is strong. Sustain this through continuous risk monitoring, horizon-scanning for emerging risks, and ensuring audit committee reporting stays tightly linked to the current risk profile.",
      ctaService: null,
    },
  },
  execution: {
    low: {
      text: "Engagement execution lacks consistency. Standardise your audit methodology and working-paper requirements, enforce supervisory review on every engagement, and establish a documented quality-control process so delivery quality does not depend on individual auditors.",
      ctaService: "internal-audit-function-establishment",
    },
    mid: {
      text: "Delivery is improving but not yet uniform. Embed documented engagement-level risk assessments, enforce consistent supervisory review, and align audit findings directly with strategic objectives so reports influence decision-making.",
      ctaService: "internal-audit-transformation",
    },
    high: {
      text: "Execution maturity is strong. Consider introducing continuous auditing and automated control testing for key systems to extend coverage without proportionally increasing effort.",
      ctaService: null,
    },
  },
  reporting: {
    low: {
      text: "Reporting timeliness and follow-up discipline need attention. Define report turnaround targets, introduce structured management-action tracking with due dates, and set escalation criteria so overdue actions are visible to the Audit Committee.",
      ctaService: "internal-audit-transformation",
    },
    mid: {
      text: "Reporting is functional but could drive more impact. Strengthen action follow-up discipline, add clear performance measures to your audit reporting cycle, and ensure escalation paths are exercised in practice, not just documented.",
      ctaService: "internal-audit-transformation",
    },
    high: {
      text: "Reporting and impact maturity is strong. Keep sharpening the connection between audit findings and strategic outcomes, and continue measuring the function's value through agreed performance indicators.",
      ctaService: null,
    },
  },
  capability: {
    low: {
      text: "Team capability and quality assurance are the priority gap. Establish a competency framework, invest in structured professional development, and put a Quality Assurance and Improvement Program in place to lift delivery quality systematically.",
      ctaService: "quality-assurance-and-improvement-program",
    },
    mid: {
      text: "Capability is developing. Formalise competency assessments, deepen specialist expertise in your highest-risk areas, and mature your QAIP with regular internal assessments and documented improvement actions.",
      ctaService: "quality-assurance-and-improvement-program",
    },
    high: {
      text: "Capability and quality assurance maturity is strong. Prepare for external quality assessment readiness and continue investing in advanced skills such as audit analytics and emerging-risk expertise.",
      ctaService: null,
    },
  },
};

export function computeResult(answers: AnswerRecord[]) {
  return {
    overall: Math.round(calculateOverallScore(answers)),
    scores: Object.fromEntries(
      DOMAIN_ORDER.map((d) => [d, Math.round(calculateDomainScore(answers, d))]),
    ),
    tier: getMaturityLevel(calculateOverallScore(answers)).level,
    band: getRecommendationBand(calculateOverallScore(answers)),
  };
}
