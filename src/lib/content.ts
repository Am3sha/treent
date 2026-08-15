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
  address: `King Fahd Road, Tower 3\nSuite 1205, Riyadh 12271\nSaudi Arabia`,
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
// Team
// ---------------------------------------------------------------------------

export const LEADERSHIP: TeamMember[] = [
  {
    name: "Senior Leadership",
    role: "Internal Audit Experts",
    bio: "Experienced internal audit professionals with deep expertise in governance, risk management, and internal controls.",
    initials: "SL",
  },
];

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

export const DIMENSIONS: DimensionMeta[] = [
  {
    key: "strategy",
    label: "Strategy & Vision",
    short: "Strategy",
    description:
      "Alignment of internal audit strategy with enterprise risk appetite and strategic objectives.",
    icon: "Compass",
    accent: "text-emerald-700",
  },
  {
    key: "technology",
    label: "Technology & Architecture",
    short: "Technology",
    description:
      "Maturity of IT general controls, audit tooling, and technology-enabled audit delivery.",
    icon: "Workflow",
    accent: "text-amber-700",
  },
  {
    key: "culture",
    label: "Culture & Talent",
    short: "Culture",
    description:
      "Audit team competency, independence posture, and stakeholder engagement across the organisation.",
    icon: "Users",
    accent: "text-teal-700",
  },
  {
    key: "data",
    label: "Data & AI",
    short: "Data",
    description:
      "Data governance controls maturity and audit analytics capability deployment across audit cycles.",
    icon: "BrainCircuit",
    accent: "text-yellow-700",
  },
  {
    key: "operations",
    label: "Operations & Delivery",
    short: "Operations",
    description:
      "Audit delivery methodology rigour, QAIP conformance, and issue remediation tracking.",
    icon: "Gauge",
    accent: "text-orange-700",
  },
];

export const BENCHMARK_QUESTIONS: BenchmarkQuestion[] = [
  // Strategy
  {
    id: "strat-1",
    dimension: "strategy",
    prompt: "Our leadership team has a shared, written view of where we will play and how we will win over the next 3 years.",
    help: "Consider whether the strategy is documented, agreed across the exec, and stable quarter to quarter.",
    labels: [
      { value: 1, label: "No shared view" },
      { value: 2, label: "Implied, not written" },
      { value: 3, label: "Written, debated" },
      { value: 4, label: "Written & cascaded" },
      { value: 5, label: "Living & measured" },
    ],
  },
  {
    id: "strat-2",
    dimension: "strategy",
    prompt: "Major investments are explicitly ranked against the strategy, with clear go / no-go decision gates.",
    labels: [
      { value: 1, label: "Ad hoc" },
      { value: 2, label: "Informal ranking" },
      { value: 3, label: "Periodic reviews" },
      { value: 4, label: "Gated portfolio" },
      { value: 5, label: "Real-time capital allocation" },
    ],
  },
  {
    id: "strat-3",
    dimension: "strategy",
    prompt: "We can articulate, in one sentence, the two or three capabilities that genuinely differentiate us.",
    labels: [
      { value: 1, label: "Unclear" },
      { value: 2, label: "Listed, not debated" },
      { value: 3, label: "Debated" },
      { value: 4, label: "Invested in" },
      { value: 5, label: "Measured & defended" },
    ],
  },
  // Technology
  {
    id: "tech-1",
    dimension: "technology",
    prompt: "Our core systems expose well-documented APIs that other teams can build on without custom integration projects.",
    labels: [
      { value: 1, label: "Closed systems" },
      { value: 2, label: "Point-to-point" },
      { value: 3, label: "Some APIs" },
      { value: 4, label: "API-first" },
      { value: 5, label: "Platform ecosystem" },
    ],
  },
  {
    id: "tech-2",
    dimension: "technology",
    prompt: "We can ship a meaningful change to production within a week of deciding to do it.",
    labels: [
      { value: 1, label: "Months+" },
      { value: 2, label: "Weeks" },
      { value: 3, label: "Two weeks" },
      { value: 4, label: "Days" },
      { value: 5, label: "Hours" },
    ],
  },
  {
    id: "tech-3",
    dimension: "technology",
    prompt: "Our technology debt is tracked as a portfolio, with a deliberate paydown plan — not an ambient complaint.",
    labels: [
      { value: 1, label: "Ignored" },
      { value: 2, label: "Complained about" },
      { value: 3, label: "Tracked" },
      { value: 4, label: "Funded paydown" },
      { value: 5, label: "Structurally managed" },
    ],
  },
  // Culture
  {
    id: "cult-1",
    dimension: "culture",
    prompt: "Cross-functional teams routinely form around outcomes, rather than handing work across departmental silos.",
    labels: [
      { value: 1, label: "Siloed" },
      { value: 2, label: "Coordinated" },
      { value: 3, label: "Some squads" },
      { value: 4, label: "Outcome teams" },
      { value: 5, label: "Teal / networked" },
    ],
  },
  {
    id: "cult-2",
    dimension: "culture",
    prompt: "Leadership actively rewards people for stopping bad work, not only for shipping new work.",
    labels: [
      { value: 1, label: "Never" },
      { value: 2, label: "Rarely" },
      { value: 3, label: "Sometimes" },
      { value: 4, label: "Often" },
      { value: 5, label: "Systematically" },
    ],
  },
  {
    id: "cult-3",
    dimension: "culture",
    prompt: "Our people have protected time to learn and experiment — and it is genuinely used, not aspirational.",
    labels: [
      { value: 1, label: "None" },
      { value: 2, label: "Aspirational" },
      { value: 3, label: "Occasional" },
      { value: 4, label: "Scheduled" },
      { value: 5, label: "Embedded" },
    ],
  },
  // Data
  {
    id: "data-1",
    dimension: "data",
    prompt: "We have a single, governed source of truth for our core business entities (customer, product, employee).",
    labels: [
      { value: 1, label: "No" },
      { value: 2, label: "Fragmented" },
      { value: 3, label: "Partially unified" },
      { value: 4, label: "Governed" },
      { value: 5, label: "Reusable products" },
    ],
  },
  {
    id: "data-2",
    dimension: "data",
    prompt: "Decision-makers can answer their own routine questions from self-serve analytics within minutes.",
    labels: [
      { value: 1, label: "Via IT, days" },
      { value: 2, label: "Via BI team" },
      { value: 3, label: "Some self-serve" },
      { value: 4, label: "Mostly self-serve" },
      { value: 5, label: "Self-serve by default" },
    ],
  },
  {
    id: "data-3",
    dimension: "data",
    prompt: "We have at least one AI/ML system in production whose business lift is measured monthly.",
    labels: [
      { value: 1, label: "None" },
      { value: 2, label: "Pilots only" },
      { value: 3, label: "One in prod" },
      { value: 4, label: "Several, measured" },
      { value: 5, label: "AI as a capability" },
    ],
  },
  // Operations
  {
    id: "ops-1",
    dimension: "operations",
    prompt: "Our core processes are mapped, measured, and improved as a system — not project by project.",
    labels: [
      { value: 1, label: "Unmapped" },
      { value: 2, label: "Mapped" },
      { value: 3, label: "Measured" },
      { value: 4, label: "Continuously improved" },
      { value: 5, label: "Self-optimising" },
    ],
  },
  {
    id: "ops-2",
    dimension: "operations",
    prompt: "Routine, repetitive work is automated wherever it makes economic sense — and the savings are reinvested.",
    labels: [
      { value: 1, label: "Manual" },
      { value: 2, label: "Some scripts" },
      { value: 3, label: "Targeted automation" },
      { value: 4, label: "Broad automation" },
      { value: 5, label: "Automation-first" },
    ],
  },
  {
    id: "ops-3",
    dimension: "operations",
    prompt: "We can clearly see, in near real-time, how the operation is performing against its service and cost commitments.",
    labels: [
      { value: 1, label: "Monthly reports" },
      { value: 2, label: "Weekly dashboards" },
      { value: 3, label: "Daily" },
      { value: 4, label: "Hourly" },
      { value: 5, label: "Live control tower" },
    ],
  },
];

// Scoring helpers
export function scoreToTier(score: number): import("./types").MaturityTier {
  if (score < 35) return "Nascent";
  if (score < 55) return "Developing";
  if (score < 75) return "Established";
  return "Leading";
}

export const TIER_META: Record<
  import("./types").MaturityTier,
  { label: string; summary: string; color: string; range: string }
> = {
  Nascent: {
    label: "Nascent",
    summary:
      "Internal audit foundational practices are still forming. Prioritise charter clarity, risk-based audit planning basics, and governance alignment before investing in tooling or advanced methodologies.",
    color: "oklch(0.55 0.12 35)",
    range: "0 – 34",
  },
  Developing: {
    label: "Developing",
    summary:
      "Pockets of strong internal audit practice exist. The priority is to connect them into a repeatable, risk-aligned system with formalised methodology, clear reporting cadence, and consistent quality assurance.",
    color: "oklch(0.72 0.13 75)",
    range: "35 – 54",
  },
  Established: {
    label: "Established",
    summary:
      "A coherent, risk-based internal audit operating model is in place. The next step is to mature from efficient assurance delivery to proactive, insight-driven audit — strengthening control environment oversight, QAIP conformance, and audit analytics capability.",
    color: "oklch(0.55 0.1 162)",
    range: "55 – 74",
  },
  Leading: {
    label: "Leading",
    summary:
      "Your internal audit function operates at the frontier of maturity. Focus shifts to sustaining excellence through continuous QAIP monitoring, advanced data-driven audit techniques, strategic audit committee advisory, and proactive risk foresight across the enterprise.",
    color: "oklch(0.52 0.1 195)",
    range: "75 – 100",
  },
};

export const TIER_RECOMMENDATIONS: Record<import("./types").MaturityTier, string[]> = {
  Nascent: [
    "Prioritise foundational governance: formalise the Internal Audit Charter with clear mandate, independence, and reporting lines to the Audit Committee.",
    "Develop a risk-based annual audit plan aligned to the organisation's key risk areas, with explicit resource allocation and timelines.",
    "Document core internal audit methodology and working paper standards to ensure consistent, repeatable engagement delivery.",
  ],
  Developing: [
    "Strengthen the control environment: implement a Quality Assurance and Improvement Program (QAIP) with regular internal assessments and documented findings.",
    "Formalise audit committee reporting cadence with structured reporting templates covering risk coverage, issues tracking, and remediation status.",
    "Build foundational audit analytics capability: establish data access protocols and deploy basic analytical procedures across high-risk audit cycles.",
  ],
  Established: [
    "Advance QAIP maturity: prepare for external quality assessment readiness and ensure full conformance with the IIA Global Internal Audit Standards.",
    "Mature IT general controls (ITGC) and audit tooling: integrate continuous auditing techniques and automated control testing for key financial and operational systems.",
    "Elevate data governance controls and audit analytics: deploy advanced data analytics across the audit plan, with a measured portfolio of continuous audit scripts.",
  ],
  Leading: [
    "Sustain the edge through proactive risk foresight: integrate horizon-scanning and emerging risk identification into strategic audit planning and audit committee advisory.",
    "Formalise strategic audit committee advisory: position Internal Audit as a trusted strategic advisor beyond assurance, providing insights on governance, risk culture, and control optimisation.",
    "Operationalise advanced, data-driven audit: leverage predictive analytics and continuous risk monitoring as default practice, with clear ownership and governance over models and data pipelines.",
  ],
};
