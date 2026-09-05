"use client";

import * as React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Printer,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  FileText,
} from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useNav } from "@/lib/store";
import { DIMENSIONS, TIER_META, TIER_RECOMMENDATIONS, scoreToTier, DOMAIN_RECOMMENDATIONS } from "@/lib/content";
import type {
  AssessmentResult,
  BenchmarkStats,
  Dimension,
  MaturityTier,
  RespondentProfile,
} from "@/lib/types";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/site/icon";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import {
  BENCHMARK_ARABIC_DIMENSIONS,
  BENCHMARK_ARABIC_TIERS,
  BENCHMARK_ARABIC_TIER_RECOMMENDATIONS,
  BENCHMARK_ARABIC_DOMAIN_INTERPRETATION,
  BENCHMARK_ARABIC_DOMAIN_RECOMMENDATIONS,
  BENCHMARK_ARABIC_RESULTS_UI,
  translateIndustryToArabic,
} from "@/lib/translations/benchmark-ar";
import type { Dimension as DimensionKey } from "@/lib/types";

const DIMENSION_INTERPRETATION: Record<Dimension, { high: string; mid: string; low: string }> = {
  governance: {
    high: "Internal audit reports to and is evaluated by the Audit Committee or Board — independence is structurally protected.",
    mid: "Audit has a charter and a governing relationship, but reporting lines or evaluation practice could be strengthened.",
    low: "Reporting lines and charter governance place audit under management influence, weakening independence.",
  },
  risk: {
    high: "The audit plan is driven by a continuously updated, independently developed risk assessment.",
    mid: "Risk assessment exists and is refreshed periodically, with some consideration of emerging risks.",
    low: "Planning is schedule-driven or relies on management's risk input without an independent audit risk assessment.",
  },
  execution: {
    high: "Methodology is standardised, engagements are risk-based, and supervisory review is documented and consistent.",
    mid: "Delivery is generally consistent, but scope-setting, review depth, or deadline discipline varies by engagement.",
    low: "Delivery quality depends on individual auditors — no standard methodology or formal review discipline.",
  },
  reporting: {
    high: "Reports are issued on time, actions are tracked to defined due dates, and performance is measured end to end.",
    mid: "Reporting is usually timely, but follow-up discipline and escalation criteria are informal.",
    low: "Reports are frequently delayed and overdue actions are not tracked or escalated systematically.",
  },
  capability: {
    high: "Competency gaps are assessed formally, development is structured, and a full QAIP including external assessment is in place.",
    mid: "Training and internal assessments happen, but capability management is periodic rather than systematic.",
    low: "No structured competency assessment, development plan, or quality assurance program exists.",
  },
};

function useDimensionMeta(lang: "en" | "ar") {
  return React.useCallback(
    (key: DimensionKey) => {
      if (lang === "ar") {
        const ar = BENCHMARK_ARABIC_DIMENSIONS[key];
        return { label: ar.label, short: ar.short, description: ar.description };
      }
      const d = DIMENSIONS.find((x) => x.key === key)!;
      return { label: d.label, short: d.short, description: d.description };
    },
    [lang]
  );
}

function useTierMeta(lang: "en" | "ar") {
  return React.useCallback(
    (tier: MaturityTier) => {
      if (lang === "ar") return BENCHMARK_ARABIC_TIERS[tier];
      return TIER_META[tier];
    },
    [lang]
  );
}

function useTierRecommendations(lang: "en" | "ar") {
  return React.useCallback(
    (tier: MaturityTier) => {
      if (lang === "ar") return BENCHMARK_ARABIC_TIER_RECOMMENDATIONS[tier];
      return TIER_RECOMMENDATIONS[tier];
    },
    [lang]
  );
}

function useDomainInterpretation(lang: "en" | "ar") {
  return React.useCallback(
    (key: DimensionKey, score: number) => {
      const bank = lang === "ar" ? BENCHMARK_ARABIC_DOMAIN_INTERPRETATION : DIMENSION_INTERPRETATION;
      return score >= 70 ? bank[key].high : score >= 40 ? bank[key].mid : bank[key].low;
    },
    [lang]
  );
}

function useDomainRecommendations(lang: "en" | "ar") {
  return React.useCallback(
    (key: DimensionKey, score: number) => {
      const band: "low" | "mid" | "high" = score <= 40 ? "low" : score <= 70 ? "mid" : "high";
      const bank = lang === "ar" ? BENCHMARK_ARABIC_DOMAIN_RECOMMENDATIONS : DOMAIN_RECOMMENDATIONS;
      return bank[key][band];
    },
    [lang]
  );
}

export function BenchmarkResultsView() {
  const { lang, isRTL } = useTranslation();
  const result = useNav((s) => s.result);
  const respondent = useNav((s) => s.respondent);
  const navigate = useNav((s) => s.navigate);
  const resetResponses = useNav((s) => s.resetResponses);
  const startAssessment = useNav((s) => s.startAssessment);
  const ui = BENCHMARK_ARABIC_RESULTS_UI;

  if (!result) {
    return <EmptyState onRestart={() => navigate("benchmark-landing")} lang={lang} isRTL={isRTL} />;
  }

  const handleRetake = () => {
    resetResponses();
    startAssessment();
    navigate("benchmark-quiz");
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={cn("mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20", isRTL && "text-right")}
    >
      <ResultsBody
        result={result}
        respondent={respondent}
        onRetake={handleRetake}
        onFollowUp={() => navigate("benchmark-followup")}
        onDownloadPDF={(currentStats) => {
          if (!result) {
            console.warn("[PDF] Skipping PDF generation: result object is missing");
            return;
          }
          generatePDF(result, respondent, currentStats, lang);
        }}
        onOpenService={() => navigate("services")}
        lang={lang}
        isRTL={isRTL}
      />
    </div>
  );
}

function EmptyState({
  onRestart,
  lang,
  isRTL,
}: {
  onRestart: () => void;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  const ui = BENCHMARK_ARABIC_RESULTS_UI;
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8",
        isRTL && "text-right"
      )}
    >
      <Reveal>
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {lang === "ar" ? ui.emptyTitle : "You haven't completed the assessment yet."}
        </h1>
        <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground">
          {lang === "ar"
            ? ui.emptyDesc
            : "Take the eight-minute Internal Audit Maturity Benchmark to see your overall score, tier, percentile, and a per-dimension breakdown."}
        </p>
        <div className="mt-8">
          <Button size="lg" onClick={onRestart} className="gap-2 rounded-full">
            {lang === "ar" ? ui.emptyButton : "Start the assessment"}
            <ArrowRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

function getBand(score: number): "low" | "mid" | "high" {
  if (score <= 40) return "low";
  if (score <= 70) return "mid";
  return "high";
}

function PriorityFocusCard({
  item,
  band,
  onOpenService,
  lang,
  isRTL,
}: {
  item: { meta: (typeof DIMENSIONS)[number]; score: number; tier: string; interp: string; recText: string; ctaService: string | null };
  band: "low" | "mid" | "high";
  onOpenService: () => void;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  const ui = BENCHMARK_ARABIC_RESULTS_UI;
  const getTier = useTierMeta(lang);
  const getDim = useDimensionMeta(lang);
  const tierMeta = getTier(item.tier as MaturityTier);
  const dimMeta = getDim(item.meta.key);
  return (
    <div className={cn("space-y-3")}>
      <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted",
            item.meta.accent
          )}
        >
          <Icon name={item.meta.icon} className="h-4 w-4" />
        </div>
        <div className={cn("flex-1")}>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <p className={cn("text-sm font-semibold")}>{dimMeta.label}</p>
            <Badge variant="outline" className={cn("text-[10px]", isRTL ? "text-[10px]" : "uppercase tracking-wider")}>
              {tierMeta.label}
            </Badge>
            <span className={cn("font-mono text-sm font-semibold tabular-nums", isRTL ? "mr-auto" : "ml-auto")}>
              {item.score}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {item.recText ?? item.interp}
          </p>
        </div>
      </div>
      {item.ctaService && (
        <div className={cn("flex", isRTL ? "justify-start" : "justify-end")}>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenService}
            className={cn("gap-1.5 rounded-full text-xs", isRTL && "flex-row-reverse")}
          >
            {lang === "ar" ? ui.focusExplore : "Explore related service"}
            <ArrowRight className={cn("h-3.5 w-3.5", isRTL && "rotate-180")} />
          </Button>
        </div>
      )}
    </div>
  );
}

function ResultsBody({
  result,
  respondent,
  onRetake,
  onFollowUp,
  onDownloadPDF,
  onOpenService,
  lang,
  isRTL,
}: {
  result: AssessmentResult;
  respondent: RespondentProfile | null;
  onRetake: () => void;
  onFollowUp: () => void;
  onDownloadPDF: (stats: BenchmarkStats | null) => void;
  onOpenService: () => void;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  const ui = BENCHMARK_ARABIC_RESULTS_UI;
  const getTier = useTierMeta(lang);
  const getTierRecs = useTierRecommendations(lang);
  const getDim = useDimensionMeta(lang);
  const getInterp = useDomainInterpretation(lang);
  const getRec = useDomainRecommendations(lang);
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 0));
    try {
      await onDownloadPDF(stats);
    } finally {
      setDownloading(false);
    }
  };
  const [stats, setStats] = React.useState<BenchmarkStats | null>(null);
  const [statsState, setStatsState] = React.useState<
    "loading" | "loaded" | "empty" | "error"
  >("loading");

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/benchmark/stats", { cache: "no-store" });
        if (!res.ok) throw new Error("stats fetch failed");
        const response = (await res.json()) as { ok: boolean; data?: BenchmarkStats };
        const data = response.data;
        if (cancelled) return;
        if (!data || data.totalAssessments === 0) {
          setStatsState("empty");
        } else {
          setStats(data);
          setStatsState("loaded");
        }
      } catch {
        if (!cancelled) setStatsState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tierMeta = getTier(result.tier);
  const percentileLabel =
    result.percentile >= 50
      ? lang === "ar"
        ? ui.percentileTop(100 - result.percentile)
        : `You're in the top ${100 - result.percentile}%`
      : lang === "ar"
        ? ui.percentileHigher(result.percentile)
        : `Higher than ${result.percentile}% of organisations benchmarked`;

  const dimRows = DIMENSIONS.map((d) => {
    const score = result.scores[d.key];
    const tier = scoreToTier(score);
    return {
      meta: d,
      score,
      tier,
      tierMeta: getTier(tier),
      interp: getInterp(d.key, score),
      rec: getRec(d.key, score),
    };
  });

  const sorted = [...dimRows].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 2);
  const focus = sorted.slice(-2).reverse();

  const respondentIndustry = respondent?.industry?.trim() || "";
  const sectorRow = React.useMemo(() => {
    if (!stats || statsState !== "loaded" || !respondentIndustry) return null;
    const match = stats.byIndustry.find(
      (r) => r.label.toLowerCase() === respondentIndustry.toLowerCase()
    );
    return match ?? null;
  }, [stats, statsState, respondentIndustry]);

  const radarData = DIMENSIONS.map((d) => {
    const meta = getDim(d.key);
    return ({
      dimension: meta.short,
      score: result.scores[d.key],
      benchmark:
        stats && statsState === "loaded"
          ? Math.round(stats.dimensionAverages[d.key] ?? 0)
          : 0,
    });
  });

  return (
    <>
      <Reveal>
        <Eyebrow className={cn(isRTL && "flex justify-start")}>
          {lang === "ar" ? ui.eyebrow : "Your benchmark report"}
        </Eyebrow>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card className="relative overflow-hidden py-6">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1"
              style={{ background: TIER_META[result.tier].color }}
            />
            <div
              className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
              style={{ background: TIER_META[result.tier].color }}
              aria-hidden
            />
            <CardContent className={cn("relative px-6 sm:px-8")}>
              <div className={cn("flex flex-wrap items-center gap-3", isRTL && "flex-row-reverse")}>
                <Badge
                  variant="secondary"
                  className={cn("gap-1.5 rounded-full px-3 py-1 text-xs font-medium", isRTL && "flex-row-reverse")}
                  style={{
                    background: `${TIER_META[result.tier].color}1a`,
                    color: TIER_META[result.tier].color,
                  }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: TIER_META[result.tier].color }}
                  />
                  {tierMeta.label} {lang === "ar" ? ui.tierSuffix : "tier"}
                  <span className={cn("font-mono text-[10px] opacity-70", isRTL ? "mr-1" : "ml-1")}>
                    {tierMeta.range}
                  </span>
                </Badge>
                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse", isRTL ? "mr-auto" : "ml-auto")}>
                  <span className="text-xs text-muted-foreground">
                    {lang === "ar" ? ui.completedOn : "Completed"}{" "}
                    {new Date(result.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    disabled={downloading}
                    className={cn(
                      "h-8 gap-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    <FileText
                      className={cn("h-3.5 w-3.5", downloading && "animate-pulse")}
                    />
                    {downloading
                      ? lang === "ar" ? ui.preparingPdf : "Preparing PDF..."
                      : lang === "ar" ? ui.downloadPdf : "Download PDF"}
                  </Button>
                </div>
              </div>

              <div className={cn("mt-6 flex items-end gap-3", isRTL && "flex-row-reverse")}>
                <span className="text-6xl font-semibold tracking-tight tabular-nums sm:text-7xl">
                  {result.overall}
                </span>
                <span className="mb-2 text-2xl font-light text-muted-foreground">
                  / 100
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                {lang === "ar" ? ui.overallLabel : "Overall internal audit maturity"}
              </p>

              <Separator className="my-6" />

              <p className="text-sm leading-relaxed text-muted-foreground">
                {tierMeta.summary}
              </p>

              <div className={cn("mt-5 flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-3", isRTL && "flex-row-reverse")}>
                <TrendingUp className="h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm font-medium text-foreground">{percentileLabel}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="py-6">
            <CardHeader className="px-6 sm:px-8">
              <CardTitle className="text-lg">
                {lang === "ar" ? ui.radarTitle : "Your dimension profile"}
              </CardTitle>
              <CardDescription>
                {lang === "ar" ? ui.radarDesc : "The shape of your maturity, across all five dimensions."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-4">
              <div className="h-[260px] w-full sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={radarData}
                    outerRadius="70%"
                    margin={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <PolarGrid stroke="oklch(0.89 0.012 120)" />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={{
                        fill: "oklch(0.48 0.02 150)",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name={lang === "ar" ? ui.chartYou : "You"}
                      dataKey="score"
                      stroke="oklch(0.38 0.06 162)"
                      fill="oklch(0.38 0.06 162)"
                      fillOpacity={0.28}
                      strokeWidth={2}
                    />
                    {statsState === "loaded" && (
                      <Radar
                        name={lang === "ar" ? ui.chartBenchmark : "Benchmark avg"}
                        dataKey="benchmark"
                        stroke="oklch(0.72 0.13 75)"
                        fill="oklch(0.72 0.13 75)"
                        fillOpacity={0.1}
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                    )}
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid oklch(0.89 0.012 120)",
                        fontSize: 12,
                        direction: isRTL ? "rtl" : "ltr",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card className="py-6">
            <CardHeader className="px-6 sm:px-8">
              <CardTitle className="text-lg">
                {lang === "ar" ? ui.peerTitle : "You vs the benchmark"}
              </CardTitle>
              <CardDescription>
                {statsState === "loaded"
                  ? lang === "ar"
                    ? ui.peerLoaded(stats!.totalAssessments)
                    : `Compared against ${stats!.totalAssessments.toLocaleString()} completed benchmark${stats!.totalAssessments === 1 ? "" : "s"}.`
                  : statsState === "loading"
                    ? lang === "ar" ? ui.peerLoading : "Loading benchmark data…"
                    : lang === "ar" ? ui.peerUnavailable : "Benchmark data not yet available."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8">
              {statsState === "loading" ? (
                <Skeleton className="h-[160px] w-full" />
              ) : statsState === "loaded" && stats ? (
                <ComparisonBars
                  you={result.overall}
                  avg={Math.round(stats.averageOverall)}
                  lang={lang}
                  isRTL={isRTL}
                />
              ) : (
                <div className="flex h-[160px] items-center justify-center rounded-lg border border-dashed bg-secondary/20 text-sm text-muted-foreground">
                  {statsState === "empty"
                    ? lang === "ar" ? ui.peerEmpty : "Be among the first to set the benchmark."
                    : lang === "ar" ? ui.peerUnavailable : "Comparison unavailable."}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="py-6">
            <CardHeader className="px-6 sm:px-8">
              <CardTitle className="text-lg">
                {lang === "ar" ? ui.tierDistTitle : "Tier distribution"}
              </CardTitle>
              <CardDescription>
                {lang === "ar" ? ui.tierDistDesc : "Where everyone who has benchmarked sits today."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8">
              {statsState === "loading" ? (
                <Skeleton className="h-[160px] w-full" />
              ) : statsState === "loaded" && stats ? (
                <TierDistribution
                  distribution={stats.tierDistribution}
                  you={result.tier}
                  lang={lang}
                  isRTL={isRTL}
                />
              ) : (
                <div className="flex h-[160px] items-center justify-center rounded-lg border border-dashed bg-secondary/20 text-sm text-muted-foreground">
                  {lang === "ar" ? ui.tierDistEmpty : "No distribution data yet."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Reveal>

      {respondentIndustry && (
        <Reveal delay={0.05}>
          <Card className="mt-6 overflow-hidden py-0">
            <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
              <div className={cn("p-6 sm:p-8")}>
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground" style={{ letterSpacing: "0.18em" }}>
                    {lang === "ar" ? ui.sectorEyebrow : "Sector comparison"}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">
                  {lang === "ar"
                    ? ui.sectorTitle(translateIndustryToArabic(respondentIndustry))
                    : `You vs the ${respondentIndustry.toLowerCase()} sector`}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {sectorRow ? (
                    <>
                      {lang === "ar"
                        ? ui.sectorHasData(sectorRow.count, true, true)
                        : `Based on ${sectorRow.count} ${sectorRow.count === 1 ? "organisation" : "organisations"} in your sector who ${sectorRow.count === 1 ? "has" : "have"} benchmarked so far.`}
                    </>
                  ) : (
                    <>
                      {lang === "ar"
                        ? ui.sectorNoData(translateIndustryToArabic(respondentIndustry))
                        : `No other organisations in the ${respondentIndustry.toLowerCase()} sector have benchmarked yet — you could be the reference point.`}
                    </>
                  )}
                </p>
                {sectorRow && (
                  <div className={cn("mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-xs", isRTL && "flex-row-reverse")}>
                    <span className="text-muted-foreground">
                      {lang === "ar" ? ui.sectorAvgLabel : "Sector average:"}
                    </span>
                    <span className="font-semibold text-foreground">
                      {sectorRow.average}/100
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span
                      className={
                        result.overall >= sectorRow.average
                          ? "font-medium text-primary"
                          : "font-medium text-amber-700"
                      }
                    >
                      {lang === "ar"
                        ? result.overall >= sectorRow.average
                          ? ui.sectorAhead(result.overall - sectorRow.average)
                          : ui.sectorBehind(sectorRow.average - result.overall)
                        : result.overall >= sectorRow.average
                          ? `You're ${result.overall - sectorRow.average} points ahead`
                          : `${sectorRow.average - result.overall} points behind`}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center border-t border-border/60 bg-secondary/20 p-6 sm:p-8 md:border-l md:border-t-0">
                {statsState === "loading" ? (
                  <Skeleton className="h-32 w-full max-w-[220px]" />
                ) : sectorRow ? (
                  <SectorGauge
                    you={result.overall}
                    sector={sectorRow.average}
                    overallAvg={
                      stats && statsState === "loaded"
                        ? Math.round(stats.averageOverall)
                        : 0
                    }
                    lang={lang}
                    isRTL={isRTL}
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-3xl font-semibold tracking-tight text-primary">
                      {result.overall}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {lang === "ar" ? ui.sectorScoreBaseline : "Your score, setting the sector baseline"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Reveal>
      )}

      <Reveal delay={0.05}>
        <div className="mt-14">
          <SectionHeading
            eyebrow={lang === "ar" ? ui.dimensionEyebrow : "Per-dimension breakdown"}
            title={lang === "ar" ? ui.dimensionTitle : "Where you lead, and where to focus."}
            className={isRTL ? "text-right" : ""}
          />
          <div className="mt-8 space-y-3">
            {dimRows.map((row) => (
              <DimensionRow key={row.meta.key} row={row} lang={lang} isRTL={isRTL} />
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Card className="py-6">
            <CardHeader className="px-6 sm:px-8">
              <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">
                  {lang === "ar" ? ui.strengthsTitle : "Your strengths"}
                </CardTitle>
              </div>
              <CardDescription>
                {lang === "ar" ? ui.strengthsDesc : "The domains where your organisation is most mature."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8">
              {strengths.length > 0 && strengths[0].meta.key === focus[0]?.meta.key ? (
                <p className="text-sm text-muted-foreground">
                  {lang === "ar" ? ui.strengthsFlat : "Every domain scored in the same range — there is no single standout strength this time. Keep sustaining this across the whole function."}
                </p>
              ) : (
                <ul className={cn("space-y-4")}>
                  {strengths.map((s) => {
                    return (
                      <li key={s.meta.key} className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                        <div
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10",
                            s.meta.accent
                          )}
                        >
                          <Icon name={s.meta.icon} className="h-4 w-4" />
                        </div>
                        <div>
                          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                            <p className="text-sm font-semibold">{getDim(s.meta.key).label}</p>
                            <Badge variant="outline" className={cn("text-[10px]", isRTL ? "" : "uppercase tracking-wider")}>
                              {getTier(s.tier as MaturityTier).label}
                            </Badge>
                            <span className={cn("font-mono text-sm font-semibold tabular-nums", isRTL ? "mr-auto" : "ml-auto")}>
                              {s.score}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {s.rec ? s.rec.text : s.interp}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="py-6">
            <CardHeader className="px-6 sm:px-8">
              <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/15 text-amber-700">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">
                  {lang === "ar" ? ui.focusTitle : "Priority focus area"}
                </CardTitle>
              </div>
              <CardDescription>
                {lang === "ar" ? ui.focusDesc : "Where the next dollar of effort will move the dial most."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8">
              {focus.length > 0 && (
                <PriorityFocusCard
                  item={{
                    meta: focus[0].meta,
                    score: focus[0].score,
                    tier: focus[0].tier,
                    interp: focus[0].interp,
                    recText: focus[0].rec.text,
                    ctaService: focus[0].rec.ctaService,
                  }}
                  band={getBand(focus[0].score)}
                  onOpenService={onOpenService}
                  lang={lang}
                  isRTL={isRTL}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <Card className="mt-14 py-6">
          <CardHeader className="px-6 sm:px-8">
            <div className={cn("flex flex-wrap items-center gap-3", isRTL && "flex-row-reverse")}>
              <span
                className="size-2.5 rounded-full"
                style={{ background: TIER_META[result.tier].color }}
              />
              <CardTitle className="text-xl">
                {lang === "ar" ? ui.tierMeaningTitle : "What your tier means — and what to do next."}
              </CardTitle>
            </div>
            <CardDescription className="mt-1">
              {lang === "ar"
                ? ui.tierMeaningSubtitle(tierMeta.label, tierMeta.range, result.overall)
                : `${TIER_META[result.tier].label} tier · ${TIER_META[result.tier].range} · ${result.overall}/100`}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {tierMeta.summary}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {getTierRecs(result.tier).map((rec, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-secondary/20 p-4"
                >
                  <span className="font-mono text-xs font-medium tracking-wider text-primary/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-primary text-primary-foreground">
          <div className={cn("grid gap-6 p-8 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center", isRTL && "[&>*]:text-right")}>
            <div>
              <Eyebrow className="text-primary-foreground/80">
                {lang === "ar" ? ui.ctaEyebrow : "Take the next step"}
              </Eyebrow>
              <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                {lang === "ar" ? ui.ctaTitle : "Get your tailored briefing."}
              </h2>
              <p className="mt-3 max-w-xl text-balance text-sm leading-relaxed text-primary-foreground/85">
                {lang === "ar" ? ui.ctaDesc : "A 30-minute call with a Trennt partner to walk through your results, pressure-test the read, and translate your focus areas into a concrete 90-day plan."}
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:w-64 sm:shrink-0">
              <Button
                size="lg"
                variant="secondary"
                onClick={onFollowUp}
                className={cn("w-full gap-2 rounded-full bg-background text-foreground hover:bg-background/90", isRTL && "flex-row-reverse")}
              >
                {lang === "ar" ? ui.ctaRequest : "Request a briefing"}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onRetake}
                className={cn("w-full gap-1.5 rounded-full text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground", isRTL && "flex-row-reverse")}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {lang === "ar" ? ui.ctaRetake : "Retake"}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className={cn("mt-8 flex items-start gap-2 text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
          <span>
            {lang === "ar"
              ? ui.trustNote(result.id.slice(0, 8))
              : `Your responses are stored securely and used only to compute your benchmark and improve aggregated insights. Assessment ID ${result.id.slice(0, 8)}.`}
          </span>
        </div>
      </Reveal>

      <div className="sr-only">
        <button onClick={() => typeof window !== "undefined" && window.print()}>
          <Printer className="h-4 w-4" />
          {lang === "ar" ? ui.downloadReport : "Download report"}
        </button>
      </div>
    </>
  );
}

function DimensionRow({
  row,
  lang,
  isRTL,
}: {
  row: {
    meta: (typeof DIMENSIONS)[number];
    score: number;
    tier: MaturityTier;
    interp: string;
  };
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  const getTier = useTierMeta(lang);
  const getDim = useDimensionMeta(lang);
  const tierMeta = getTier(row.tier);
  const dimMeta = getDim(row.meta.key);
  return (
    <div
      className={cn(
        "grid gap-3 rounded-xl border border-border bg-card p-4 sm:items-center sm:gap-5 sm:p-5",
        "sm:grid-cols-[auto_1fr_auto]",
        isRTL && "sm:[&>*:last-child]:justify-start"
      )}
    >
      <div className={cn("flex items-center gap-3 sm:min-w-[200px]", isRTL && "flex-row-reverse")}>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10",
            row.meta.accent
          )}
        >
          <Icon name={row.meta.icon} className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{dimMeta.label}</p>
          <p className={cn("text-[11px] text-muted-foreground", isRTL ? "" : "uppercase tracking-wider")}>
            {tierMeta.label}
          </p>
        </div>
      </div>
      <div className="min-w-0">
        <Progress value={row.score} className="h-2" />
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {row.interp}
        </p>
      </div>
      <div className={cn("flex items-center gap-2", isRTL ? "sm:justify-start" : "sm:justify-end")}>
        <span className="font-mono text-2xl font-semibold tabular-nums">
          {row.score}
        </span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

function ComparisonBars({
  you,
  avg,
  lang,
  isRTL,
}: {
  you: number;
  avg: number;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  const ui = BENCHMARK_ARABIC_RESULTS_UI;
  const data = [
    { name: lang === "ar" ? ui.chartYou : "You", value: you },
    { name: lang === "ar" ? ui.chartBenchmark : "Benchmark avg", value: avg },
  ];
  return (
    <div className="h-[160px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={isRTL
            ? { top: 8, right: 8, bottom: 8, left: 24 }
            : { top: 8, right: 24, bottom: 8, left: 8 }}
        >
          <CartesianGrid horizontal={false} stroke="oklch(0.89 0.012 120)" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: "oklch(0.48 0.02 150)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            direction={isRTL ? "rtl" : "ltr"}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "oklch(0.21 0.02 150)", fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip
            cursor={{ fill: "oklch(0.95 0.01 120)" }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid oklch(0.89 0.012 120)",
              fontSize: 12,
              direction: isRTL ? "rtl" : "ltr",
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={28}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={
                  d.name === (lang === "ar" ? ui.chartYou : "You")
                    ? "oklch(0.38 0.06 162)"
                    : "oklch(0.72 0.13 75)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function SectorGauge({
  you,
  sector,
  overallAvg,
  lang,
  isRTL,
}: {
  you: number;
  sector: number;
  overallAvg: number;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  const ui = BENCHMARK_ARABIC_RESULTS_UI;
  const rows = [
    {
      label: lang === "ar" ? ui.chartYou : "You",
      value: you,
      color: "oklch(0.38 0.06 162)",
      bold: true,
    },
    {
      label: lang === "ar" ? ui.chartSector : "Your sector",
      value: sector,
      color: "oklch(0.55 0.1 195)",
      bold: false,
    },
    {
      label: lang === "ar" ? ui.chartAllSectors : "All sectors",
      value: overallAvg,
      color: "oklch(0.72 0.13 75)",
      bold: false,
    },
  ];
  return (
    <div className="w-full max-w-[240px] space-y-3">
      {rows.map((r) => (
        <div key={r.label}>
          <div className={cn("flex items-center justify-between text-xs", isRTL && "flex-row-reverse")}>
            <span className={r.bold ? "font-semibold text-foreground" : "text-muted-foreground"}>
              {r.label}
            </span>
            <span className={r.bold ? "font-semibold text-foreground tabular-nums" : "text-muted-foreground tabular-nums"}>
              {r.value}
              <span className="text-muted-foreground">/100</span>
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${r.value}%`,
                backgroundColor: r.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TierDistribution({
  distribution,
  you,
  lang,
  isRTL,
}: {
  distribution: Record<MaturityTier, number>;
  you: MaturityTier;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  const ui = BENCHMARK_ARABIC_RESULTS_UI;
  const getTier = useTierMeta(lang);
  const total =
    distribution.initial +
    distribution.developing +
    distribution.defined +
    distribution.established +
    distribution.advanced;
  const tiers: MaturityTier[] = [
    "initial",
    "developing",
    "defined",
    "established",
    "advanced",
  ];
  return (
    <div className="space-y-3">
      {tiers.map((t) => {
        const count = distribution[t];
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const isYou = you === t;
        const meta = getTier(t);
        return (
          <div key={t} className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
            <div className={cn("flex w-28 items-center gap-2", isRTL && "flex-row-reverse")}>
              <span
                className="size-2.5 rounded-full"
                style={{ background: TIER_META[t].color }}
              />
              <span className="text-xs font-medium">{meta.label}</span>
            </div>
            <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: TIER_META[t].color,
                }}
              />
            </div>
            <span className={cn("w-12 font-mono text-xs tabular-nums text-muted-foreground", isRTL && "text-left")}>
              {pct}%
            </span>
            {isYou && (
              <Badge
                variant="outline"
                className="border-primary/40 text-[10px] font-medium text-primary"
              >
                {lang === "ar" ? ui.tierYouBadge : "You"}
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
