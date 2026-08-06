import type {
  BenchmarkQuestion,
  CaseStudy,
  CareerItem,
  DimensionMeta,
  ServiceItem,
  TeamMember,
  Testimonial,
} from "./types";

// ---------------------------------------------------------------------------
// Company
// ---------------------------------------------------------------------------

export const COMPANY = {
  name: "Trennt",
  legalName: "Trennt Partners",
  tagline: "Exclusively Internal Audit.",
  description:
    "Trennt is an internal audit firm based in Saudi Arabia, dedicated exclusively to internal audit delivery.",
  foundedYear: 2014,
  email: "hello@trennt.com",
  phone: "+44 20 7946 0312",
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
// Stats
// ---------------------------------------------------------------------------

export const STATS = [
  { value: "11+", label: "years of practice", sub: "Founded 2014" },
  { value: "320+", label: "engagements delivered", sub: "across sectors" },
  { value: "94%", label: "repeat client rate", sub: "long-term partnerships" },
];

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const SERVICES: ServiceItem[] = [
  {
    slug: "internal-audit-outsourcing",
    title: "Internal Audit Outsourcing",
    tagline: "End-to-end delivery of your internal audit function.",
    description:
      "End-to-end delivery of the organisation's internal audit function through an independent and risk-based approach.",
    icon: "Users",
    outcomes: [
      "Risk-Based Audit Planning",
      "Audit Plan Delivery",
      "Audit Committee & Management Reporting",
      "Follow-Up & Action Monitoring",
      "Internal Audit Function Management",
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
    tagline: "Complement your existing internal audit function.",
    description:
      "Delivery of selected internal audit engagements to complement the organisation's existing internal audit function.",
    icon: "Users2",
    outcomes: [
      "Selected Internal Audit Engagements",
      "Support for the Delivery of the Annual Audit Plan",
      "Integration with the Existing Internal Audit Function",
      "Audit Engagements Across Multiple Risk Areas",
      "Delivery using the Organisation's Methodology or Trennt's Methodology",
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
    tagline: "Design and implement a best-in-class internal audit function.",
    description:
      "Design and implementation of an internal audit function aligned with governance requirements and the IIA Global Internal Audit Standards.",
    icon: "Building2",
    outcomes: [
      "Governance Framework",
      "Internal Audit Strategy",
      "Internal Audit Charter",
      "Operating Model",
      "Internal Audit Methodology",
      "Function Implementation",
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
    tagline: "Enhance your existing internal audit function.",
    description:
      "Enhancement of existing internal audit functions to improve effectiveness and support evolving organisational needs.",
    icon: "RefreshCcw",
    outcomes: [
      "Current State Assessment",
      "Governance Framework Enhancement",
      "Operating Model Enhancement",
      "Internal Audit Methodology Enhancement",
      "Capability Development",
      "Transformation Roadmap",
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
    tagline: "Independent assessment of your internal audit function.",
    description:
      "Independent assessment of the internal audit function to support continuous improvement and conformance with the IIA Global Internal Audit Standards.",
    icon: "CheckCircle2",
    outcomes: [
      "Internal Quality Assessments",
      "Standards Conformance",
      "Quality Improvement Initiatives",
      "External Assessment Readiness",
      "Continuous Quality Monitoring",
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
      "Understanding your organisation, your needs, and your expectations.",
    icon: "MessageSquare",
  },
  {
    step: "02",
    title: "Engagement Scoping",
    description:
      "Defining the scope, objectives, and deliverables of the engagement.",
    icon: "Scope",
  },
  {
    step: "03",
    title: "Engagement Agreement",
    description:
      "Finalising the agreement and setting expectations for delivery.",
    icon: "FileText",
  },
  {
    step: "04",
    title: "Internal Audit Delivery",
    description:
      "Executing the engagement in line with the agreed scope and methodology.",
    icon: "CheckSquare",
  },
];

// ---------------------------------------------------------------------------
// Framework Agreements
// ---------------------------------------------------------------------------

export const FRAMEWORK_AGREEMENTS = {
  title: "Framework Agreements",
  description:
    "Framework Agreements are available for organisations that expect to engage Trennt for Internal Audit Outsourcing or Internal Audit Co-Sourcing over time.",
  includes: [
    "Commercial Terms",
    "Reporting Approach",
    "Engagement Process",
  ],
  additional: "Additional engagements may be initiated under the Framework Agreement as required.",
};

// ---------------------------------------------------------------------------
// Why Trennt
// ---------------------------------------------------------------------------

export const WHY_TRENNT = {
  title: "Exclusively Internal Audit",
  description:
    "Trennt is dedicated exclusively to internal audit services. Our methodologies, deliverables, and professional capabilities are developed specifically for internal audit, supporting an objective and independent approach.",
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
// Testimonials
// ---------------------------------------------------------------------------

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Trennt's exclusive focus on internal audit brings a level of depth and objectivity that is hard to find.",
    author: "Audit Committee Chair",
    title: "Audit Committee Chair",
    company: "Leading Organisation",
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
      "How clearly ambition is translated into a sequenced, fundable plan the organisation can run.",
    icon: "Compass",
    accent: "text-emerald-700",
  },
  {
    key: "technology",
    label: "Technology & Architecture",
    short: "Technology",
    description:
      "Whether your technology foundation is modern, API-first, and able to change at the pace of the business.",
    icon: "Workflow",
    accent: "text-amber-700",
  },
  {
    key: "culture",
    label: "Culture & Talent",
    short: "Culture",
    description:
      "How well your people, ways of working, and leadership behaviours sustain change rather than resist it.",
    icon: "Users",
    accent: "text-teal-700",
  },
  {
    key: "data",
    label: "Data & AI",
    short: "Data",
    description:
      "Whether data is treated as a governed, reusable asset — and whether AI is delivering measurable lift.",
    icon: "BrainCircuit",
    accent: "text-yellow-700",
  },
  {
    key: "operations",
    label: "Operations & Delivery",
    short: "Operations",
    description:
      "How lean, observable, and adaptable your core operations are — and whether improvement is a system, not a campaign.",
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
      "Foundational practices are still forming. The biggest wins are in alignment and basics, not tooling.",
    color: "oklch(0.55 0.12 35)",
    range: "0 – 34",
  },
  Developing: {
    label: "Developing",
    summary:
      "You have pockets of strong practice. The opportunity is to connect them into a system that compounds.",
    color: "oklch(0.72 0.13 75)",
    range: "35 – 54",
  },
  Established: {
    label: "Established",
    summary:
      "A coherent, measured operating model. The next move is from efficient to adaptive — and from AI experiments to AI as a capability.",
    color: "oklch(0.55 0.1 162)",
    range: "55 – 74",
  },
  Leading: {
    label: "Leading",
    summary:
      "You are operating at the frontier. Focus shifts to sustaining the edge, defending the platform, and shaping your market.",
    color: "oklch(0.52 0.1 195)",
    range: "75 – 100",
  },
};

export const TIER_RECOMMENDATIONS: Record<import("./types").MaturityTier, string[]> = {
  Nascent: [
    "Resist the urge to buy tooling. Begin by writing down the strategy and getting the exec team to agree on it — explicitly.",
    "Pick one core process, map it end-to-end, and instrument it. You cannot improve what you cannot see.",
    "Establish a single source of truth for one core business entity (customer or product) before attempting anything broader.",
  ],
  Developing: [
    "Your pockets of strong practice need a connective layer. Appoint owners for each dimension and a single forum where they meet.",
    "Replace project-by-project improvement with a quarterly portfolio review tied to the strategy.",
    "Move one AI pilot into a measured production system. Use it to build the muscle for governing models, not just building them.",
  ],
  Established: [
    "Shift from efficient to adaptive: shorten the loop from decision to production, and make safe-to-fail the default for new bets.",
    "Industrialise your data foundation as reusable products, not one-off pipelines.",
    "Move from AI experiments to AI as a capability — a platform, with a portfolio of measured systems and clear ownership.",
  ],
  Leading: [
    "Sustain the edge by treating the platform itself as a product — funded, versioned, and continuously improved.",
    "Defend your position by deepening the moat around your differentiating capabilities, not by spreading thin.",
    "Shape your market: open selective capabilities as services, set standards, and use your maturity to pull the sector forward.",
  ],
};


