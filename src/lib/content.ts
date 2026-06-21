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
  name: "Meridian Advisory",
  legalName: "Meridian Advisory Partners",
  tagline: "Strategy, technology & data for the next horizon.",
  description:
    "Meridian Advisory is an independent consulting firm helping ambitious organisations turn strategy into measurable outcomes — across digital transformation, data & AI, and operational excellence.",
  foundedYear: 2014,
  email: "hello@meridianadvisory.com",
  phone: "+44 20 7946 0312",
  address: "60 Holborn Viaduct, London EC1A 2BN, United Kingdom",
  offices: [
    { city: "London", country: "United Kingdom", flag: "GB" },
    { city: "Singapore", country: "Singapore", flag: "SG" },
    { city: "New York", country: "United States", flag: "US" },
    { city: "Dubai", country: "United Arab Emirates", flag: "AE" },
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
  { value: "320+", label: "engagements delivered", sub: "across 4 continents" },
  { value: "$4.2B", label: "value unlocked", sub: "verified client outcomes" },
  { value: "94%", label: "repeat client rate", sub: "long-term partnerships" },
];

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const SERVICES: ServiceItem[] = [
  {
    slug: "strategy",
    title: "Strategy & Growth",
    tagline: "From ambition to a plan the whole organisation can run.",
    description:
      "We help leadership teams define where to play, how to win, and how to mobilise — turning ambiguous ambitions into sequenced, fundable bets.",
    icon: "Compass",
    outcomes: [
      "Clear portfolio of strategic initiatives with ROI ranges",
      "Aligned executive team and board-ready narrative",
      "12–36 month roadmap with decision gates",
    ],
    deliverables: [
      "Market & competitive landscape",
      "Scenario modelling & investment case",
      "Initiative portfolio & roadmap",
      "Operating model implications",
    ],
  },
  {
    slug: "digital-transformation",
    title: "Digital Transformation",
    tagline: "Modern systems, modern ways of working — without the theatre.",
    description:
      "End-to-end transformation programmes that re-architect how work happens, from customer experience through to the back office, with engineering rigour throughout.",
    icon: "Workflow",
    outcomes: [
      "Faster cycle times and lower run-cost",
      "Modern, API-first platform foundation",
      "Adoption that sticks beyond go-live",
    ],
    deliverables: [
      "Current-state diagnostic & capability map",
      "Target architecture & migration plan",
      "Delivery pods with embedded change",
      "Value tracking dashboard",
    ],
  },
  {
    slug: "data-ai",
    title: "Data & AI",
    tagline: "Decisions worth automating, intelligence worth trusting.",
    description:
      "We build the foundations — governance, platforms, models — and the products on top, so data becomes a compounding asset rather than a recurring project.",
    icon: "BrainCircuit",
    outcomes: [
      "Governed, reusable data products",
      "Production AI with measurable lift",
      "Self-serve analytics for decision makers",
    ],
    deliverables: [
      "Data maturity & use-case discovery",
      "Platform & domain design",
      "ML / AI solution build & MLOps",
      "Governance, ethics & operating model",
    ],
  },
  {
    slug: "operations",
    title: "Operational Excellence",
    tagline: "Leaner operations that scale without breaking people.",
    description:
      "We redesign operating models and processes to remove friction, reduce cost-to-serve, and free capacity for the work that matters — sustainably.",
    icon: "Gauge",
    outcomes: [
      "15–40% cost-to-serve reduction",
      "Reduced handoffs and rework",
      "Capacity reallocated to growth",
    ],
    deliverables: [
      "Process mining & waste analysis",
      "Future-state process design",
      "Automation & orchestration roadmap",
      "Sustained improvement system",
    ],
  },
  {
    slug: "cyber-resilience",
    title: "Cyber & Resilience",
    tagline: "Defensible by design, recoverable by default.",
    description:
      "Pragmatic security and resilience programmes that protect the business without throttling it — aligned to real risk, not audit theatre.",
    icon: "ShieldCheck",
    outcomes: [
      "Risk-ranked control roadmap",
      "Tested incident response capability",
      "Regulator-ready posture",
    ],
    deliverables: [
      "Threat & control gap assessment",
      "Zero-trust architecture patterns",
      "Resilience & recovery runbooks",
      "Board-level risk reporting",
    ],
  },
  {
    slug: "sustainability",
    title: "Sustainability & ESG",
    tagline: "Reporting you can defend, strategy you can act on.",
    description:
      "From CSRD readiness to decarbonisation roadmaps, we translate ESG obligations into operating decisions — with audit-grade data behind them.",
    icon: "Leaf",
    outcomes: [
      "Compliant, auditable disclosures",
      "Credible decarbonisation pathway",
      "ESG embedded into capital decisions",
    ],
    deliverables: [
      "Materiality & gap assessment",
      "Data architecture for ESG",
      "Reduction roadmap & abatement model",
      "Disclosure & assurance readiness",
    ],
  },
];

// ---------------------------------------------------------------------------
// Methodology steps
// ---------------------------------------------------------------------------

export const METHODOLOGY = [
  {
    step: "01",
    title: "Diagnose",
    description:
      "We pressure-test the current state with data, not opinion — surfacing the constraints that actually matter.",
    icon: "Microscope",
  },
  {
    step: "02",
    title: "Design",
    description:
      "We co-design the target state with your people, so the answer is owned, not handed over.",
    icon: "PencilRuler",
  },
  {
    step: "03",
    title: "Deliver",
    description:
      "Small, embedded pods ship in weeks. Value is tracked weekly against the original investment case.",
    icon: "Rocket",
  },
  {
    step: "04",
    title: "Embed",
    description:
      "We leave behind capability, not dependency — playbooks, metrics, and a team that can run without us.",
    icon: "Infinite",
  },
];

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export const LEADERSHIP: TeamMember[] = [
  {
    name: "Amara Okonkwo",
    role: "Managing Partner",
    bio: "Twenty years shaping strategy across financial services and the public sector. Former McKinsey partner.",
    initials: "AO",
  },
  {
    name: "Daniel Lindqvist",
    role: "Partner, Data & AI",
    bio: "Built and scaled data platforms at two unicorns. Passionate about production ML that earns its keep.",
    initials: "DL",
  },
  {
    name: "Priya Raghunathan",
    role: "Partner, Digital Transformation",
    bio: "Leads our largest transformation programmes. Believes adoption is the only metric that matters.",
    initials: "PR",
  },
  {
    name: "Marcus Bauer",
    role: "Partner, Operations",
    bio: "Operations economist by training. Has redesigned supply chains across three continents.",
    initials: "MB",
  },
  {
    name: "Sofia Marchetti",
    role: "Partner, Sustainability",
    bio: "CSRD practitioner and former sustainability lead at a FTSE 100. Bridges reporting and real decarbonisation.",
    initials: "SM",
  },
  {
    name: "James Chen",
    role: "Partner, Cyber & Resilience",
    bio: "Ex-CISO turned advisor. Designs security that survives both attackers and auditors.",
    initials: "JC",
  },
];

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Meridian didn't hand us a deck — they sat with our teams for nine months and rebuilt how the business runs. The ROI was visible by quarter two.",
    author: "Helena Voss",
    title: "Chief Operating Officer",
    company: "Northwind Logistics",
  },
  {
    quote:
      "The data foundation they built is still paying dividends three years on. Every new AI use-case stands on their original architecture.",
    author: "Rahul Mehta",
    title: "Group CDO",
    company: "Asteria Financial",
  },
  {
    quote:
      "Calm, rigorous, and refreshingly honest. They told us what not to do — which saved us more than any recommendation could.",
    author: "Greta Lindholm",
    title: "CEO",
    company: "Tundra Industrials",
  },
];

// ---------------------------------------------------------------------------
// Case studies
// ---------------------------------------------------------------------------

export const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Replatforming a national insurer",
    client: "Asteria Financial",
    sector: "Financial Services",
    result: "42% faster claims handling",
    metric: "£38M annual savings",
    summary:
      "We rebuilt the claims platform on an event-driven architecture and retrained 600 handlers, cutting average settlement time from 11 days to 6.",
  },
  {
    title: "AI demand forecasting at scale",
    client: "Tundra Industrials",
    sector: "Manufacturing",
    result: "28% inventory reduction",
    metric: "€52M working capital freed",
    summary:
      "A production-grade forecasting stack across 14 plants, reducing stockouts while releasing working capital.",
  },
  {
    title: "Operational reset for a health system",
    client: "Mersey Health Partners",
    sector: "Public Sector",
    result: "31% shorter waiting lists",
    metric: "1.2M citizens served",
    summary:
      "A year-long operational redesign that reallocated 180,000 clinical hours and cut elective waiting lists by a third.",
  },
];

// ---------------------------------------------------------------------------
// Careers
// ---------------------------------------------------------------------------

export const CAREERS: CareerItem[] = [
  {
    slug: "senior-strategy-consultant",
    title: "Senior Strategy Consultant",
    team: "Strategy & Growth",
    location: "London",
    type: "Full-time",
    level: "Manager",
    summary:
      "Lead diagnostic and strategy engagements for board-level clients across financial services and the public sector. You will own workstreams, mentor associates, and shape the firm's point of view.",
    responsibilities: [
      "Own workstreams end-to-end, from framing to final board readout",
      "Structure ambiguous problems into analyses that produce decisions",
      "Mentor 2–3 associates and shape their development",
      "Contribute to firm IP, points of view, and client development",
    ],
    requirements: [
      "6–9 years in top-tier consulting or equivalent strategy roles",
      "Demonstrated ownership of board-level workstreams",
      "Strong financial modelling and structured communication",
      "Sector depth in financial services, health, or industrials",
    ],
  },
  {
    slug: "data-engineering-lead",
    title: "Data Engineering Lead",
    team: "Data & AI",
    location: "London / Remote EU",
    type: "Full-time",
    level: "Lead",
    summary:
      "Own the architecture and delivery of data platforms for our largest clients. Set engineering standards, lead a squad of engineers, and partner closely with ML and analytics teams.",
    responsibilities: [
      "Architect and deliver lakehouse platforms (dbt, Spark, Iceberg)",
      "Set engineering standards and review patterns across the practice",
      "Lead a squad of 4–6 engineers",
      "Partner with ML and analytics teams on productionisation",
    ],
    requirements: [
      "8+ years building production data platforms",
      "Deep SQL + Python; strong dbt / Spark / Iceberg",
      "Cloud-native (AWS or GCP) at scale",
      "Opinionated about data quality and contracts",
    ],
  },
  {
    slug: "ml-engineer",
    title: "Senior ML Engineer",
    team: "Data & AI",
    location: "Singapore",
    type: "Full-time",
    level: "Senior",
    summary:
      "Build and operate production ML systems for clients across APAC — from forecasting to document intelligence. You care about measurable lift, not demo accuracy.",
    responsibilities: [
      "Design, build, and operate production ML systems",
      "Own MLOps pipelines and model governance",
      "Partner with domain experts to frame use-cases",
      "Mentor engineers and shape our ML playbook",
    ],
    requirements: [
      "5+ years production ML engineering",
      "Strong Python; PyTorch / scikit-learn; cloud MLOps",
      "Comfortable with ambiguity and client-facing work",
      "Track record of shipped, measurable impact",
    ],
  },
  {
    slug: "transformation-manager",
    title: "Transformation Delivery Manager",
    team: "Digital Transformation",
    location: "Dubai",
    type: "Full-time",
    level: "Manager",
    summary:
      "Run the day-to-day of large transformation programmes across the GCC — driving delivery, managing stakeholders, and keeping value tracking honest.",
    responsibilities: [
      "Run programme delivery: scope, schedule, risk, value",
      "Manage senior client stakeholders day-to-day",
      "Coordinate cross-functional pods",
      "Maintain the value tracking dashboard",
    ],
    requirements: [
      "6–9 years in transformation / programme delivery",
      "Proven large-programme delivery (>$10M)",
      "Stakeholder management at executive level",
      "Arabic speaker preferred",
    ],
  },
  {
    slug: "associate-consultant",
    title: "Associate Consultant",
    team: "Strategy & Growth",
    location: "London / New York",
    type: "Full-time",
    level: "Entry-level",
    summary:
      "The foundation of every engagement. You will carry analysis, build models, and learn the craft from senior practitioners — fast.",
    responsibilities: [
      "Own analytical workstreams under manager guidance",
      "Build models, decks, and research deliverables",
      "Contribute to proposals and client development",
      "Develop sector and functional depth",
    ],
    requirements: [
      "Top academic record; any discipline welcome",
      "Evidence of structured problem-solving",
      "Curiosity, rigour, and resilience",
      "Right to work in the hiring location",
    ],
  },
];

export const PERKS = [
  { title: "Ownership from day one", description: "Real responsibility on real work — no shadow consulting.", icon: "KeyRound" },
  { title: "Learning budget", description: "£4,000 annual budget plus protected learning Fridays.", icon: "GraduationCap" },
  { title: "Equity for all", description: "Every permanent hire participates in the partnership pool.", icon: "TrendingUp" },
  { title: "Flexible location", description: "Hybrid by default, with 4 'work from anywhere' weeks a year.", icon: "Globe" },
  { title: "Parental leave", description: "26 weeks fully paid parental leave, for all parents.", icon: "HeartHandshake" },
  { title: "Sabbatical", description: "Six-week paid sabbatical every four years.", icon: "Palmtree" },
];

// ---------------------------------------------------------------------------
// Benchmark: dimensions + questions
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
