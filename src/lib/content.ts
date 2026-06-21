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
  name: "TRENNT Consulting Group",
  legalName: "TRENNT Consulting Group Partners",
  tagline: "Strategy, technology & data for the next standard.",
  description:
    "TRENNT Consulting Group is an independent consulting firm helping world-leading organizations turn strategy into measurable outcomes — across digital transformation, data & AI, and operational excellence.",
  foundedYear: 2014,
  email: "hello@trenntadvisory.com",
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
      "Trennt didn't hand us a deck — they sat with our teams for nine months and rebuilt how the business runs. The ROI was visible by quarter two.",
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
    slug: "asteria-financial-replatforming",
    title: "Replatforming a national insurer",
    client: "Asteria Financial",
    sector: "Financial Services",
    duration: "14 months",
    result: "42% faster claims handling",
    metric: "£38M",
    metricLabel: "annual savings",
    summary:
      "We rebuilt the claims platform on an event-driven architecture and retrained 600 handlers, cutting average settlement time from 11 days to 6.",
    challenge: [
      "A 20-year-old monolithic claims platform that could not scale beyond 2,000 claims per day without weekend batch runs.",
      "Average settlement time of 11 days, with 18% of claims requiring manual rework due to data quality issues.",
      "600 claims handlers trained on legacy workflows resistant to change, with morale at a five-year low.",
      "A regulator-mandated deadline to demonstrate operational resilience within 18 months.",
    ],
    approach: [
      "Diagnosed the claims journey end-to-end, identifying 14 handoffs and 6 data-quality root causes responsible for 80% of rework.",
      "Designed an event-driven target architecture on AWS, decomposing the monolith into 11 domain services behind an API gateway.",
      "Ran delivery in three embedded pods (platform, claims domain, data) shipping to production fortnightly from week six.",
      "Built a parallel-run period of 10 weeks where old and new systems processed the same claims, building handler confidence before cutover.",
      "Co-designed new operating model with team leads — handlers helped shape the new workflow rather than having it imposed.",
    ],
    outcomes: [
      { label: "Settlement time", value: "11 → 6 days" },
      { label: "Annual savings", value: "£38M" },
      { label: "Manual rework", value: "18% → 4%" },
      { label: "Handler NPS", value: "+34" },
    ],
    quote: {
      text: "Trennt didn't hand us a deck — they sat with our teams for fourteen months and rebuilt how the business runs. The ROI was visible by quarter two.",
      author: "Helena Voss",
      title: "Chief Operating Officer, Asteria Financial",
    },
    services: ["Digital Transformation", "Data & AI", "Operations"],
    icon: "Landmark",
  },
  {
    slug: "tundra-ai-forecasting",
    title: "AI demand forecasting at scale",
    client: "Tundra Industrials",
    sector: "Manufacturing",
    duration: "9 months",
    result: "28% inventory reduction",
    metric: "€52M",
    metricLabel: "working capital freed",
    summary:
      "A production-grade forecasting stack across 14 plants, reducing stockouts while releasing working capital.",
    challenge: [
      "14 plants across 7 countries, each running independent spreadsheets with no shared demand signal.",
      "Inventory turns of 3.2 per year — half the sector benchmark — tying up €190M in working capital.",
      "Stockout rates of 12% on critical SKUs, causing line stoppages costing €40,000 per hour.",
      "Three previous ML pilots that never reached production; the data team had lost credibility with operations.",
    ],
    approach: [
      "Built a unified data foundation on an Iceberg lakehouse, consolidating 14 plant ERP feeds into a single demand-signal model.",
      "Developed hierarchical forecasting models (product-family-plant-SKU) using gradient-boosted trees with 14-day rolling horizons.",
      "Deployed an MLOps pipeline with automated retraining weekly and drift detection on 12 input features.",
      "Embedded two ML engineers in the S&OP team for 90 days, attending planning meetings and iterating on model outputs in context.",
      "Designed a 'forecast action review' where planners override the model weekly, with overrides measured for accuracy over time.",
    ],
    outcomes: [
      { label: "Inventory reduction", value: "28%" },
      { label: "Working capital freed", value: "€52M" },
      { label: "Stockout rate", value: "12% → 3%" },
      { label: "Forecast accuracy", value: "+19pp" },
    ],
    quote: {
      text: "The data foundation they built is still paying dividends three years on. Every new AI use-case stands on their original architecture.",
      author: "Rahul Mehta",
      title: "Group CDO, Tundra Industrials",
    },
    services: ["Data & AI", "Operations"],
    icon: "Factory",
  },
  {
    slug: "mersey-health-operational-reset",
    title: "Operational reset for a health system",
    client: "Mersey Health Partners",
    sector: "Public Sector",
    duration: "12 months",
    result: "31% shorter waiting lists",
    metric: "1.2M",
    metricLabel: "citizens served",
    summary:
      "A year-long operational redesign that reallocated 180,000 clinical hours and cut elective waiting lists by a third.",
    challenge: [
      "Elective waiting lists at 78,000 — the highest in the region's history — with 22% of patients waiting over 18 weeks.",
      "Clinical staff burnout at 41%, with agency spend of £14M per year covering gaps.",
      "17 separate patient pathways with inconsistent triage, creating bottlenecks at referral-to-treatment handoffs.",
      "Political pressure to show measurable improvement within a single financial year.",
    ],
    approach: [
      "Mapped all 17 elective pathways end-to-end, identifying 43 bottlenecks and 11 pathways where demand exceeded capacity by design.",
      "Redesigned triage using a clinical-lead model, routing 30% of referrals to alternative pathways within 48 hours.",
      "Built a real-time capacity dashboard across 8 hospital sites, giving ops managers visibility they'd never had.",
      "Ran 90-day improvement sprints on the 5 highest-impact pathways, with embedded Trennt ops engineers in each.",
      "Established a sustained improvement system — weekly performance huddles, monthly system-wide review — that outlasted the engagement.",
    ],
    outcomes: [
      { label: "Waiting list reduction", value: "31%" },
      { label: "Clinical hours reallocated", value: "180,000" },
      { label: "Agency spend", value: "−£6M" },
      { label: "18-week breach rate", value: "22% → 8%" },
    ],
    quote: {
      text: "Calm, rigorous, and refreshingly honest. They told us what not to do — which saved us more than any recommendation could.",
      author: "Greta Lindholm",
      title: "CEO, Mersey Health Partners",
    },
    services: ["Operations", "Strategy & Growth"],
    icon: "HeartPulse",
  },
  {
    slug: "northwind-supply-chain",
    title: "Supply chain resilience for a logistics group",
    client: "Northwind Logistics",
    sector: "Logistics",
    duration: "7 months",
    result: "99.6% on-time delivery",
    metric: "£12M",
    metricLabel: "margin recovered",
    summary:
      "We redesigned the network planning model and deployed real-time control towers across 3 hubs, recovering margin lost to disruption and hitting a two-year on-time high.",
    challenge: [
      "On-time delivery at 91%, below the 96% contractual threshold for two top clients at risk of churn.",
      "Three regional hubs operating on independent planning systems with no shared visibility of capacity or disruption.",
      "Margin erosion of £14M over 18 months due to expedited freight and penalty payments.",
      "A legacy TMS that could not model multi-leg routes or dynamic rerouting around disruption.",
    ],
    approach: [
      "Consolidated the three planning systems into a single control-tower model with real-time GPS, weather, and port-data feeds.",
      "Built a dynamic routing engine that recalculates multi-leg routes every 15 minutes against live disruption signals.",
      "Redesigned the hub-and-spoke network, reducing average leg distance by 11% while increasing utilisation by 8%.",
      "Trained 40 dispatchers on the new control-tower workflow, with a 6-week parallel-run before cutover.",
      "Negotiated flexible capacity contracts with 3 carriers, giving 18% surge headroom without premium rates.",
    ],
    outcomes: [
      { label: "On-time delivery", value: "91% → 99.6%" },
      { label: "Margin recovered", value: "£12M" },
      { label: "Expedited freight", value: "−63%" },
      { label: "Client retention", value: "100%" },
    ],
    services: ["Operations", "Digital Transformation"],
    icon: "Truck",
  },
  {
    slug: "helios-esg-reporting",
    title: "CSRD-ready ESG reporting for an energy group",
    client: "Helios Energy",
    sector: "Energy",
    duration: "10 months",
    result: "Audit-ready disclosures",
    metric: "40%",
    metricLabel: "reporting effort cut",
    summary:
      "We built the data architecture and governance to produce CSRD-compliant sustainability disclosures — and cut the reporting effort by 40% in the process.",
    challenge: [
      "CSRD compliance deadline in 14 months, with Scope 1-3 emissions data spread across 9 business units in 6 formats.",
      "Previous year's ESG report took 5 months to compile, with 3 restatements after audit.",
      "No single owner for sustainability data; finance, operations, and HSE each held fragments.",
      "Board commitment to a credible decarbonisation pathway, not just compliance reporting.",
    ],
    approach: [
      "Conducted a double-materiality assessment across 9 business units, prioritising 14 disclosure topics.",
      "Designed a sustainability data architecture on the existing lakehouse, with automated ingestion from 12 source systems.",
      "Implemented data quality controls with 4-eyes review on all material metrics, auditable to source documents.",
      "Built a decarbonisation abatement cost curve, giving the board a ranked view of reduction options by cost and impact.",
      "Trained 22 business-unit reporters on the new workflow, replacing quarterly email exchanges with a guided data-entry portal.",
    ],
    outcomes: [
      { label: "Reporting cycle", value: "5mo → 6wk" },
      { label: "Restatements", value: "3 → 0" },
      { label: "Reporting effort", value: "−40%" },
      { label: "Audit findings", value: "None" },
    ],
    quote: {
      text: "For the first time, our sustainability reporting is defensible. The board can make capital decisions on real numbers.",
      author: "Sofia Marchetti",
      title: "Partner, Sustainability (engagement lead)",
    },
    services: ["Sustainability & ESG", "Data & AI"],
    icon: "Zap",
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

// ---------------------------------------------------------------------------
// Resources / Articles (thought-leadership content)
// ---------------------------------------------------------------------------

import type { Article } from "./types";

export const ARTICLES: Article[] = [
  {
    slug: "the-maturity-trap",
    title: "The maturity trap: why most transformation programmes stall at 60%",
    excerpt:
      "Organisations don't fail at transformation because they lack ambition. They fail because they confuse activity for progress — and because the hardest 40% is the part nobody owns.",
    category: "Strategy",
    author: "Amara Okonkwo",
    authorRole: "Managing Partner",
    date: "2026-05-14",
    readMinutes: 7,
    icon: "Compass",
    body: [
      {
        type: "paragraph",
        text: "After a decade of transformation programmes, a pattern is clear. The first 60% of the work — the diagnosis, the strategy decks, the pilot, even the first wave of delivery — is the easy part. It is visible, measurable, and rewarding. The board sees motion. The consultants go home. The press release goes out.",
      },
      {
        type: "paragraph",
        text: "And then the programme stalls. Not dramatically, with a failure memo, but quietly. The second wave never quite lands. Adoption plateaus. The new platform runs alongside the old one. The metrics stop improving. Two years later, a new programme is launched to finish what the last one started.",
      },
      {
        type: "heading",
        text: "Why the last 40% is the hardest",
      },
      {
        type: "paragraph",
        text: "The first 60% is technical. The last 40% is political, behavioural, and structural. It requires decommissioning the old system — which means decommissioning the power structures built around it. It requires middle managers to give up control. It requires the organisation to admit that the new way is not just an addition but a replacement.",
      },
      {
        type: "list",
        items: [
          "Decommissioning is unfunded. Budgets pay for the new thing, not for retiring the old.",
          "Adoption is treated as a milestone, not a metric. It is declared complete at go-live, then never measured again.",
          "The operating model is never redesigned. The new platform is asked to serve the old org chart.",
          "No one owns the 40%. Project teams disband; business-as-usual teams never picked it up.",
        ],
      },
      {
        type: "callout",
        title: "The diagnostic question",
        text: "Ask any transformation programme: who, by name, is accountable for adoption 18 months after go-live? If the answer is 'the business' or 'the change team', the programme will stall at 60%.",
      },
      {
        type: "heading",
        text: "What actually works",
      },
      {
        type: "paragraph",
        text: "The programmes that get past 60% share three traits. First, they fund decommissioning explicitly — with a named budget, a named owner, and a hard date. Second, they measure adoption as a leading indicator, weekly, at the level of individual teams. Third, they redesign the operating model in parallel with the technology, so the new platform serves a structure built to use it.",
      },
      {
        type: "quote",
        text: "The technology is never the constraint. The constraint is the organisation's willingness to retire the behaviours the old technology rewarded.",
        attribution: "Amara Okonkwo, Managing Partner",
      },
      {
        type: "paragraph",
        text: "If your programme is stalling, the answer is rarely more technology. It is almost always a conversation about ownership, decommissioning, and whether anyone is still measuring adoption. Start there.",
      },
    ],
  },
  {
    slug: "data-as-a-product",
    title: "Data as a product: the operating model that finally makes data compound",
    excerpt:
      "Most data teams spend 70% of their time answering the same questions slightly differently. The fix isn't another pipeline — it's treating data the way you'd treat any product.",
    category: "Data & AI",
    author: "Daniel Lindqvist",
    authorRole: "Partner, Data & AI",
    date: "2026-04-28",
    readMinutes: 6,
    icon: "BrainCircuit",
    body: [
      {
        type: "paragraph",
        text: "The data team is supposed to be a multiplier. Too often it is a bottleneck. The pattern is familiar: a dashboard is built for one team, then another team asks for 'the same thing but slightly different', and within a year the data team is maintaining 400 dashboards, half of which contradict each other.",
      },
      {
        type: "heading",
        text: "The problem isn't the pipelines",
      },
      {
        type: "paragraph",
        text: "Organisations keep trying to solve this with better infrastructure — a new lakehouse, a faster query engine, a sexier BI tool. None of it helps, because the problem is upstream. It is an operating-model problem dressed up as a technology problem.",
      },
      {
        type: "callout",
        title: "The principle",
        text: "Treat every dataset the way you'd treat a product: with an owner, a set of users, a definition of quality, and a roadmap. If nobody owns it, nobody improves it.",
      },
      {
        type: "heading",
        text: "What 'data as a product' actually means",
      },
      {
        type: "list",
        items: [
          "A named product owner accountable for the dataset's quality and usefulness — not a 'data steward' in name only.",
          "Documented consumers. If you don't know who uses the data, you can't change it safely, so you never do.",
          "Service-level expectations: freshness, accuracy, and uptime, treated the way you'd treat an external API.",
          "A discovery layer so consumers can find and trust the product without emailing the owner.",
        ],
      },
      {
        type: "paragraph",
        text: "The shift sounds small. It is not. It moves the data team from a service desk — taking tickets, building one-offs — to a product organisation that builds reusable assets. The first six months are harder. The next two years are transformative.",
      },
      {
        type: "quote",
        text: "The best data teams I've worked with spend less than 20% of their time on ad-hoc requests. They got there by saying no to the requests and yes to the products.",
        attribution: "Daniel Lindqvist, Partner, Data & AI",
      },
    ],
  },
  {
    slug: "the-cost-of-undecided-work",
    title: "The hidden cost of undecided work",
    excerpt:
      "The most expensive thing in your organisation isn't a failed project. It's the work that sits in limbo — half-approved, half-staffed, half-measured — draining capacity from everything around it.",
    category: "Operations",
    author: "Marcus Bauer",
    authorRole: "Partner, Operations",
    date: "2026-04-09",
    readMinutes: 5,
    icon: "Gauge",
    body: [
      {
        type: "paragraph",
        text: "Walk into any large organisation and ask a simple question: how many initiatives are currently 'in flight'? The answer is almost always a number that surprises leadership. Not because the work is secret, but because nobody counts the undecided work — the proposals that were nodded through in a meeting but never formally approved or killed.",
      },
      {
        type: "heading",
        text: "Why undecided work is the most expensive kind",
      },
      {
        type: "paragraph",
        text: "A decided 'no' frees up capacity immediately. A decided 'yes' allocates capacity deliberately. An undecided maybe does neither — but it still consumes the cognitive overhead of a team that has to keep it alive, prepare for it, and context-switch around it.",
      },
      {
        type: "callout",
        title: "The rule of thumb",
        text: "Every undecided initiative costs roughly 15% of a team's capacity in overhead, even if no formal work has started. Five undecided initiatives and you've lost a person.",
      },
      {
        type: "heading",
        text: "The fix is governance, not process",
      },
      {
        type: "paragraph",
        text: "You don't need more process. You need a forum with the authority to say no, meeting on a fixed cadence, with a rule that any initiative not explicitly funded within 30 days is automatically killed. 'Killed by default' is the single most powerful operating lever we install with clients.",
      },
      {
        type: "list",
        items: [
          "Maintain a single, visible list of every initiative and its status.",
          "Require a named sponsor and a funding decision for anything consuming capacity.",
          "Default to kill: undecided work dies unless explicitly saved.",
          "Measure the backlog of undecided work as a leading indicator of organisational drag.",
        ],
      },
      {
        type: "quote",
        text: "Saying no is a capability. Organisations that can't say no can't say yes and mean it.",
        attribution: "Marcus Bauer, Partner, Operations",
      },
    ],
  },
  {
    slug: "ai-without-adoption",
    title: "AI without adoption is just expensive maths",
    excerpt:
      "The gap between a model that works in a notebook and a model that changes a business is enormous. Most organisations are stuck on the wrong side of it — and the reasons are rarely technical.",
    category: "Data & AI",
    author: "Priya Raghunathan",
    authorRole: "Partner, Digital Transformation",
    date: "2026-03-17",
    readMinutes: 6,
    icon: "Sparkles",
    body: [
      {
        type: "paragraph",
        text: "Every executive I speak to has an AI initiative. Most have several. Very few can point to one where the model is in production, used daily, and delivering a measured lift to the business. The pilots are everywhere. The production systems are rare.",
      },
      {
        type: "heading",
        text: "The pilot-to-production chasm",
      },
      {
        type: "paragraph",
        text: "A pilot succeeds because a small team optimises obsessively for a narrow use case. Production fails because the organisation optimises for nothing — the model is deployed, a dashboard is built, and everyone assumes adoption will follow. It doesn't.",
      },
      {
        type: "callout",
        title: "The adoption test",
        text: "Before deploying any AI system, answer this: who, by name, will use the model's output to make a different decision than they would have made otherwise? If the answer is 'we're not sure', the model is not ready for production.",
      },
      {
        type: "heading",
        text: "What separates the systems that stick",
      },
      {
        type: "list",
        items: [
          "A named user whose workflow is redesigned around the model — not bolted onto it.",
          "A feedback loop where the user can correct the model, and the corrections are measured.",
          "A baseline metric established before deployment, so lift is provable rather than asserted.",
          "A sponsor who reviews adoption weekly for the first 90 days, not quarterly.",
        ],
      },
      {
        type: "paragraph",
        text: "The technology is the easy part. The hard part is treating the model as a colleague that needs onboarding, supervision, and performance review — because that is exactly what it is.",
      },
      {
        type: "quote",
        text: "A model that nobody uses has a perfect accuracy rate and zero business value. Adoption is the only metric that matters.",
        attribution: "Priya Raghunathan, Partner, Digital Transformation",
      },
    ],
  },
  {
    slug: "independence-as-a-strategy",
    title: "Independence as a strategy, not just a label",
    excerpt:
      "Every consulting firm claims to be independent. Very few are willing to pay the price that real independence demands — which is why it remains one of the few durable differentiators.",
    category: "Perspective",
    author: "Amara Okonkwo",
    authorRole: "Managing Partner",
    date: "2026-02-20",
    readMinutes: 4,
    icon: "Scale",
    body: [
      {
        type: "paragraph",
        text: "Independence is the most overused word in consulting. Every firm claims it. Most mean, at best, that they are willing to tell a client something the client doesn't want to hear — occasionally. Real independence is structural, not behavioural. It is a set of choices about how the firm makes money, who it hires, and what it refuses to do.",
      },
      {
        type: "heading",
        text: "The three tests of real independence",
      },
      {
        type: "list",
        items: [
          "No implementation royalties. If the firm profits from the technology it recommends, the recommendation is not independent.",
          "No bench to fill. If the firm employs a large roster of juniors it must deploy to keep busy, the advice will bend toward using them.",
          "A willingness to recommend doing nothing. The hardest independent advice is 'stop'. Firms that can't say it aren't independent.",
        ],
      },
      {
        type: "callout",
        title: "The cost of independence",
        text: "Real independence means turning down work — regularly, and often lucratively. It means smaller teams and longer engagements. It is a strategy that costs money in the short term and earns trust in the long term.",
      },
      {
        type: "paragraph",
        text: "We built Trennt on this principle because we'd seen the alternative. When a firm's revenue depends on the size of the build, the build is always too big. When a firm's revenue depends on the quality of the thinking, the thinking gets better.",
      },
      {
        type: "quote",
        text: "The most valuable thing a consultant can say is 'don't'. Most firms are not structured to let their consultants say it.",
        attribution: "Amara Okonkwo, Managing Partner",
      },
    ],
  },
  {
    slug: "the-culture-metric-that-matters",
    title: "The culture metric that actually predicts transformation success",
    excerpt:
      "Engagement scores don't predict whether your transformation will land. But one specific cultural signal — whether people are rewarded for stopping bad work — predicts it almost perfectly.",
    category: "Culture",
    author: "Sofia Marchetti",
    authorRole: "Partner, Sustainability",
    date: "2026-01-29",
    readMinutes: 5,
    icon: "Users",
    body: [
      {
        type: "paragraph",
        text: "Organisations spend a fortune measuring culture. Engagement scores, pulse surveys, sentiment analysis. And yet, none of these metrics reliably predict whether a transformation programme will succeed. We looked at fifty programmes across a decade and found that almost none of the standard culture metrics correlated with outcomes.",
      },
      {
        type: "heading",
        text: "One metric stood out",
      },
      {
        type: "paragraph",
        text: "There was a single question that predicted transformation success with striking accuracy: 'In the last six months, has anyone in your team been recognised for stopping or cancelling work?' Programmes where the answer was yes succeeded at more than twice the rate of programmes where it was no.",
      },
      {
        type: "callout",
        title: "Why this metric works",
        text: "Stopping bad work requires three things organisations struggle with: the psychological safety to speak up, the authority to act, and the honesty to admit something isn't working. A culture that can do this can do almost anything.",
      },
      {
        type: "heading",
        text: "How to build the muscle",
      },
      {
        type: "list",
        items: [
          "Create a monthly 'kill list' review where teams nominate work to stop, and celebrate what gets killed.",
          "Promote at least one person per year whose biggest contribution was stopping something.",
          "Make 'what did we stop?' a standing question in every quarterly review, equal in weight to 'what did we start?'.",
        ],
      },
      {
        type: "quote",
        text: "A culture that can only start things cannot finish them. The capacity to stop is the capacity to focus.",
        attribution: "Sofia Marchetti, Partner, Sustainability",
      },
    ],
  },
];

export const ARTICLE_CATEGORIES = [
  "All",
  "Strategy",
  "Data & AI",
  "Operations",
  "Culture",
  "Perspective",
] as const;
