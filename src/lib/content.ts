import type {
  CareerItem,
  Dimension,
  DimensionMeta,
  ServiceItem,
} from "./types";

// ---------------------------------------------------------------------------
// Company
// ---------------------------------------------------------------------------

import { getSiteEmail } from "./site-config";

export const COMPANY = {
  name: "Trennt",
  legalName: "Trennt Partners",
  tagline: {
    en: "Internal Audit. Delivered with Independence.",
    ar: "المراجعة الداخلية. تقدم باستقلالية."
  },
  description: {
    en: "Trennt is a Saudi Arabia-based firm specialising exclusively in internal audit. We give Boards, Audit Committees, and executive management clear, objective insight into governance, risk management, and internal control effectiveness.",
    ar: "ترينت هي شركة سعودية متخصصة حصريا في المراجعة الداخلية. نحن نقدم لمجالس الإدارة ولجان المراجعة والإدارة التنفيذية رؤية واضحة وموضوعية حول فعالية الحوكمة وإدارة المخاطر والرقابة الداخلية."
  },
  foundedYear: 2014,
  get email() {
    return getSiteEmail();
  },
  phone: "+966 51 050 6606",
  address: {
    en: "Riyadh,Saudi Arabia",
    ar: "الرياض، السعودية"
  },
  offices: [
    { city: "Riyadh", country: "Saudi Arabia", flag: "SA" },
  ],
  social: {
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",

  },
};

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const SERVICES: ServiceItem[] = [
  {
    slug: "internal-audit-outsourcing",
    title: { en: "Internal Audit Outsourcing", ar: "المراجعة الداخلية بنموذج Outsourcing" },
    tagline: { en: "End-to-end delivery of internal audit activities through a structured, risk-based approach.", ar: "تنفيذ متكامل لأنشطة المراجعة الداخلية من خلال منهجية منظمة وقائمة على المخاطر." },
    description: {
      en: "Trennt provides end-to-end internal audit outsourcing through a structured, risk-based delivery approach.",
      ar: "تقدم ترينت خدمات متكاملة للمراجعة الداخلية من خلال منهجية منظمة وقائمة على المخاطر."
    },
    icon: "Users",
    outcomes: [
      { en: "Risk Assessment & Annual Audit Planning", ar: "تقييم المخاطر والتخطيط السنوي للمراجعة" },
      { en: "Execution of the Approved Audit Plan", ar: "تنفيذ خطة المراجعة المعتمدة" },
      { en: "Reporting to Management & the Audit Committee", ar: "التقارير للإدارة ولجنة المراجعة" },
      { en: "Issue Follow-Up and Action Tracking", ar: "متابعة الملاحظات والإجراءات المتفق عليها" },
      { en: "Ongoing Internal Audit Coordination", ar: "التنسيق المستمر لأنشطة المراجعة الداخلية" },
    ],
    deliverables: [
      { en: "Annual risk-based audit plan", ar: "خطة مراجعة سنوية قائمة على المخاطر" },
      { en: "Internal audit reports", ar: "تقارير المراجعة الداخلية" },
      { en: "Audit Committee reporting", ar: "تقارير لجنة المراجعة" },
      { en: "Follow-up and action tracking", ar: "متابعة الملاحظات وخطط المعالجة" },
    ],
  },
  {
    slug: "internal-audit-co-sourcing",
    title: { en: "Internal Audit Co-Sourcing", ar: "المراجعة الداخلية بنموذج Co-Sourcing" },
    tagline: { en: "Additional internal audit capacity and specialist support integrated with the existing internal audit function.", ar: "توفير قدرات إضافية وخبرات متخصصة تتكامل مع نشاط المراجعة الداخلية القائم." },
    description: {
      en: "Trennt provides additional internal audit capacity and specialist support integrated with the organisation’s existing internal audit function.",
      ar: "توفر ترينت قدرات إضافية وخبرات متخصصة في المراجعة الداخلية، تتكامل مع نشاط المراجعة الداخلية القائم لدى الجهة."
    },
    icon: "Users2",
    outcomes: [
      { en: "Targeted Internal Audit Engagements", ar: "تنفيذ مهام مراجعة داخلية محددة" },
      { en: "Additional Support for the Annual Audit Plan", ar: "دعم إضافي لتنفيذ خطة المراجعة السنوية" },
      { en: "Collaboration with the Existing Internal Audit Team", ar: "العمل بالتكامل مع فريق المراجعة الداخلية القائم" },
      { en: "Coverage Across Business and Risk Areas", ar: "تغطية مجالات الأعمال والمخاطر المختلفة" },
      { en: "Delivery Aligned with the Organisation’s or Trennt’s Methodology", ar: "التنفيذ وفق منهجية الجهة أو منهجية ترينت" },
    ],
    deliverables: [
      { en: "Co-sourced internal audit engagements", ar: "مهام مراجعة داخلية بنموذج Co-Sourcing" },
      { en: "Integrated delivery with the existing internal audit team", ar: "تنفيذ متكامل مع فريق المراجعة الداخلية القائم" },
      { en: "Flexible engagement support", ar: "دعم مرن بحسب احتياجات النشاط" },
    ],
  },
  {
    slug: "internal-audit-function-establishment",
    title: { en: "Internal Audit Function Establishment", ar: "تأسيس نشاط المراجعة الداخلية" },
    tagline: { en: "Establishing the governance, methodology, and operating foundations required for an effective internal audit function.", ar: "تأسيس الإطار الحوكمي والمنهجي والتشغيلي اللازم لعمل نشاط مراجعة داخلية فعال." },
    description: {
      en: "Trennt supports the establishment of internal audit functions through a structured approach aligned with governance requirements and the IIA Global Internal Audit Standards.",
      ar: "تدعم ترينت تأسيس نشاط المراجعة الداخلية من خلال نهج منظم ومتوافق مع متطلبات الحوكمة والمعايير العالمية للمراجعة الداخلية الصادرة عن معهد المراجعين الداخليين."
    },
    icon: "Building2",
    outcomes: [
      { en: "Internal Audit Governance Structure", ar: "هيكل حوكمة المراجعة الداخلية" },
      { en: "Internal Audit Strategy", ar: "استراتيجية المراجعة الداخلية" },
      { en: "Internal Audit Charter", ar: "ميثاق المراجعة الداخلية" },
      { en: "Target Operating Model", ar: "نموذج التشغيل المستهدف" },
      { en: "Internal Audit Methodology & Procedures", ar: "منهجية وإجراءات المراجعة الداخلية" },
      { en: "Function Implementation", ar: "تفعيل نشاط المراجعة الداخلية" },
    ],
    deliverables: [
      { en: "Internal Audit Charter", ar: "ميثاق المراجعة الداخلية" },
      { en: "Governance framework", ar: "إطار الحوكمة" },
      { en: "Target operating model", ar: "نموذج التشغيل المستهدف" },
      { en: "Internal audit methodology and procedures", ar: "منهجية وإجراءات المراجعة الداخلية" },
    ],
  },
  {
    slug: "internal-audit-transformation",
    title: { en: "Internal Audit Transformation", ar: "تطوير نشاط المراجعة الداخلية" },
    tagline: { en: "Enhancing the effectiveness, relevance, and operating maturity of an existing internal audit function.", ar: "تطوير نشاط المراجعة الداخلية القائم بما يعزز فعاليته وملاءمته ونضجه التشغيلي." },
    description: {
      en: "Trennt supports the enhancement of existing internal audit functions through a structured assessment and improvement approach.",
      ar: "تدعم ترينت تطوير نشاط المراجعة الداخلية القائم من خلال نهج منظم للتقييم والتحسين."
    },
    icon: "RefreshCcw",
    outcomes: [
      { en: "Current-State & Maturity Assessment", ar: "تقييم الوضع الحالي ومستوى النضج" },
      { en: "Governance Model Enhancement", ar: "تطوير نموذج الحوكمة" },
      { en: "Operating Model Enhancement", ar: "تطوير نموذج التشغيل" },
      { en: "Methodology & Process Enhancement", ar: "تطوير المنهجية والعمليات" },
      { en: "Internal Audit Capability Development", ar: "تطوير قدرات المراجعة الداخلية" },
      { en: "Prioritised Transformation Roadmap", ar: "إعداد خارطة طريق للتطوير وتحديد الأولويات" },
    ],
    deliverables: [
      { en: "Current-state assessment", ar: "تقييم الوضع الحالي" },
      { en: "Transformation roadmap", ar: "خارطة طريق للتطوير" },
      { en: "Enhanced internal audit methodology", ar: "منهجية مطورة للمراجعة الداخلية" },
      { en: "Capability development plan", ar: "خطة تطوير القدرات" },
    ],
  },
  {
    slug: "quality-assurance-and-improvement-program",
    title: { en: "Quality Assurance & Improvement Program (QAIP)", ar: "برنامج ضمان وتحسين الجودة (QAIP)" },
    tagline: { en: "Assessment and improvement of internal audit quality and conformance with the IIA Global Internal Audit Standards.", ar: "تقييم جودة نشاط المراجعة الداخلية ومدى توافقه مع المعايير العالمية للمراجعة الداخلية، وتحديد فرص التحسين." },
    description: {
      en: "Trennt provides independent assessment and improvement support to evaluate internal audit quality and conformance with the IIA Global Internal Audit Standards.",
      ar: "تقدم ترينت خدمات مستقلة لتقييم جودة نشاط المراجعة الداخلية ومدى توافقه مع المعايير العالمية للمراجعة الداخلية الصادرة عن معهد المراجعين الداخليين، مع تحديد فرص التحسين وتعزيز فعالية البرنامج لدى الجهة."
    },
    icon: "CheckCircle2",
    outcomes: [
      { en: "Internal Quality Assessments", ar: "تقييمات الجودة الداخلية" },
      { en: "Assessment of Conformance with the IIA Global Internal Audit Standards", ar: "تقييم مدى التوافق مع المعايير العالمية للمراجعة الداخلية" },
      { en: "Identification of Improvement Opportunities", ar: "تحديد فرص التحسين" },
      { en: "Preparation for External Quality Assessments", ar: "الاستعداد لتقييمات الجودة الخارجية" },
      { en: "Ongoing Quality and Performance Monitoring", ar: "المتابعة المستمرة للجودة والأداء" },
    ],
    deliverables: [
      { en: "QAIP assessment report", ar: "تقرير تقييم برنامج ضمان وتحسين الجودة" },
      { en: "Conformance assessment", ar: "تقييم مدى التوافق" },
      { en: "Improvement plan", ar: "خطة التحسين" },
      { en: "External quality assessment readiness support", ar: "دعم الاستعداد لتقييم الجودة الخارجي" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Methodology steps (Engagement Process)
// ---------------------------------------------------------------------------

export const METHODOLOGY = [
  {
    step: "01",
    title: { en: "Initial Discussion", ar: "المناقشة الأولية" },
    description: {
      en: "Understanding the organisation’s requirements, priorities, and internal audit needs.",
      ar: "فهم متطلبات الجهة وأولوياتها واحتياجاتها في المراجعة الداخلية."
    },
    icon: "MessageSquare",
  },
  {
    step: "02",
    title: { en: "Engagement Scoping", ar: "تحديد نطاق المهمة" },
    description: {
      en: "Defining the scope, objectives, deliverables, timelines, and required resources.",
      ar: "تحديد النطاق والأهداف والمخرجات والجدول الزمني والموارد المطلوبة."
    },
    icon: "Scope",
  },
  {
    step: "03",
    title: { en: "Engagement Agreement", ar: "اتفاقية المهمة" },
    description: {
      en: "Confirming the agreed commercial and delivery arrangements.",
      ar: "اعتماد الترتيبات التجارية والتنفيذية المتفق عليها."
    },
    icon: "FileText",
  },
  {
    step: "04",
    title: { en: "Internal Audit Delivery", ar: "تنفيذ أعمال المراجعة الداخلية" },
    description: {
      en: "Executing the agreed work and providing the required reporting and follow-up.",
      ar: "تنفيذ نطاق العمل المتفق عليه، وإصدار التقارير، ومتابعة الإجراءات ذات الصلة."
    },
    icon: "CheckSquare",
  },
];

// ---------------------------------------------------------------------------
// Framework Agreements
// ---------------------------------------------------------------------------

export const FRAMEWORK_AGREEMENTS = {
  title: { en: "Framework Agreements", ar: "اتفاقيات الإطار" },
  description: {
    en: "A flexible model for ongoing internal audit support, covering future Internal Audit Outsourcing and Co-Sourcing engagements as needs arise.",
    ar: "نموذج مرن لدعم المراجعة الداخلية المستمر، يغطي ارتباطات إسناد المراجعة الداخلية لجهات خارجية والمراجعة الداخلية المشتركة المستقبلية حسب الحاجة."
  },
  includes: [
    { en: "Commercial & Engagement Terms", ar: "الشروط التجارية وشروط الارتباط" },
    { en: "Reporting & Communication Arrangements", ar: "ترتيبات رفع التقارير والتواصل" },
    { en: "Standard Engagement Process", ar: "عملية الارتباط القياسية" },
  ],
  additional: {
    en: "Once the framework is in place, individual assignments can be initiated efficiently as organisational requirements emerge.",
    ar: "بمجرد وضع الإطار، يمكن البدء في المهام الفردية بكفاءة مع ظهور متطلبات المنظمة."
  },
};

// ---------------------------------------------------------------------------
// Careers
// ---------------------------------------------------------------------------

export const CAREERS: CareerItem[] = [
  {
    slug: "internal-audit-senior",
    title: { en: "Senior Internal Auditor", ar: "المراجعة الداخلية · Senior" },
    team: { en: "Internal Audit", ar: "المراجعة الداخلية" },
    location: { en: "Riyadh", ar: "الرياض" },
    type: "Full-time",
    level: { en: "Senior", ar: "خبير" },
    summary: {
      en: "Join our team of internal audit professionals and work with leading organisations across sectors.",
      ar: "انضم إلى فريقنا من محترفي المراجعة الداخلية واعمل مع منظمات رائدة في مختلف القطاعات."
    },
    responsibilities: [
      { en: "Lead internal audit engagements", ar: "قيادة ارتباطات المراجعة الداخلية" },
      { en: "Develop risk-based audit plans", ar: "تطوير خطط مراجعة قائمة على المخاطر" },
      { en: "Prepare audit reports", ar: "إعداد تقارير المراجعة" },
      { en: "Engage with audit committees and management", ar: "التواصل مع لجان المراجعة والإدارة" },
    ],
    requirements: [
      { en: "5+ years internal audit experience", ar: "خبرة تزيد عن 5 سنوات في المراجعة الداخلية" },
      { en: "Strong understanding of IIA standards", ar: "فهم قوي لمعايير IIA" },
      { en: "Experience in governance, risk, and controls", ar: "خبرة في الحوكمة والمخاطر والرقابة" },
      { en: "Excellent communication skills", ar: "مهارات تواصل ممتازة" },
    ],
  },
];

export const PERKS = [
  {
    title: { en: "Professional Development", ar: "التطوير المهني" },
    description: {
      en: "Continuous development through practical internal audit experience, professional standards, and exposure to different business and risk environments.",
      ar: "تطوير مستمر من خلال الخبرة العملية في المراجعة الداخلية، والتطبيق المهني للمعايير، والتعامل مع بيئات أعمال ومخاطر متنوعة."
    },
    icon: "GraduationCap"
  },
  {
    title: { en: "Meaningful Responsibility", ar: "المسؤولية المهنية" },
    description: {
      en: "Team members are expected to take ownership of their work and contribute directly to the quality of each engagement.",
      ar: "يتحمل أعضاء الفريق مسؤولية أعمالهم ويساهمون بشكل مباشر في جودة كل مهمة."
    },
    icon: "TrendingUp"
  },
  {
    title: { en: "Experienced Collaboration", ar: "العمل مع خبرات متخصصة" },
    description: {
      en: "Work alongside internal audit professionals across planning, execution, reporting, and quality review.",
      ar: "العمل إلى جانب مهنيين في المراجعة الداخلية عبر مراحل التخطيط والتنفيذ والتقارير ومراجعة الجودة."
    },
    icon: "Users"
  },
  {
    title: { en: "Specialist Focus", ar: "التركيز التخصصي" },
    description: {
      en: "Build deeper capability within a firm dedicated exclusively to internal audit.",
      ar: "بناء خبرة أعمق في المراجعة الداخلية ضمن شركة متخصصة حصريا في هذا المجال."
    },
    icon: "Target"
  }
];

// ---------------------------------------------------------------------------
// Benchmark: dimensions + questions (unchanged)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Benchmark: domains + client-approved 26 questions
// Canonical question set and score math live in benchmark-scoring.ts.
// ---------------------------------------------------------------------------

// Display metadata for the benchmark's five domains. Record<Dimension, ...>
// makes the compiler enforce exact key coverage in ONE place, and the array
// order is derived from DOMAIN_ORDER (benchmark-scoring.ts, imported below -
// ESM hoisting makes the binding available here), so the key list itself is
// never duplicated in this file. Labels/summaries stay here for content
// editing convenience.
const DIMENSION_CONTENT: Record<Dimension, Omit<DimensionMeta, "key">> = {
  governance: {
    label: "Governance & Operating Model",
    short: "Governance",
    description:
      "Governance arrangements, reporting lines, authority, oversight, and the positioning of the internal audit function.",
    icon: "ShieldCheck",
    accent: "text-emerald-700",
  },
  risk: {
    label: "Risk Assessment & Planning",
    short: "Risk",
    description:
      "The approach to risk assessment, audit planning, emerging risks, and alignment of internal audit coverage with organisational priorities.",
    icon: "Target",
    accent: "text-amber-700",
  },
  execution: {
    label: "Audit Execution & Methodology",
    short: "Execution",
    description:
      "The consistency, rigour, supervision, and execution of internal audit engagements.",
    icon: "Workflow",
    accent: "text-teal-700",
  },
  reporting: {
    label: "Reporting & Follow-Up",
    short: "Reporting",
    description:
      "The quality and timeliness of reporting, follow-up of agreed actions, escalation, and monitoring of internal audit performance.",
    icon: "FileChartColumn",
    accent: "text-blue-700",
  },
  capability: {
    label: "Capability & Quality",
    short: "Capability",
    description:
      "Internal audit competencies, specialist capability, professional development, and quality assurance arrangements.",
    icon: "GraduationCap",
    accent: "text-orange-700",
  },
};

export const DIMENSIONS: DimensionMeta[] = DOMAIN_ORDER.map((key) => ({
  key,
  ...DIMENSION_CONTENT[key],
}));

// Scoring helpers — delegate to the single source of truth in benchmark-scoring.ts
import {
  calculateDomainScore,
  calculateOverallScore,
  getMaturityLevel,
  getRecommendationBand,
  DOMAIN_ORDER,
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
