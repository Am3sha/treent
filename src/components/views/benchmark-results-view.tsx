"use client";

import * as React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Printer,
  RefreshCw,
  Share2,
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

export function BenchmarkResultsView() {
  const result = useNav((s) => s.result);
  const respondent = useNav((s) => s.respondent);
  const navigate = useNav((s) => s.navigate);
  const resetResponses = useNav((s) => s.resetResponses);
  const startAssessment = useNav((s) => s.startAssessment);

  if (!result) {
    return <EmptyState onRestart={() => navigate("benchmark-landing")} />;
  }

  const handleRetake = () => {
    resetResponses();
    startAssessment();
    navigate("benchmark-quiz");
  };

  return (
    <ResultsBody
      result={result}
      respondent={respondent}
      onRetake={handleRetake}
      onFollowUp={() => navigate("benchmark-followup")}
      onDownloadPDF={(currentStats) =>
        generatePDF(result, respondent, currentStats)
      }
      onShare={() => {
        if (typeof navigator !== "undefined" && navigator.share) {
          navigator
            .share({
              title: "My Internal Audit Maturity Benchmark",
                text: `I scored ${result.overall}/100 on the Trennt Internal Audit Maturity Benchmark.`,
              url: typeof window !== "undefined" ? window.location.href : "",
            })
            .catch(() => undefined);
        } else if (typeof window !== "undefined") {
          window.print();
        }
      }}
      onOpenService={(slug) => navigate("services")}
    />
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <Reveal>
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          You haven't completed the assessment yet.
        </h1>
        <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground">
          Take the eight-minute Internal Audit Maturity Benchmark to see your overall
          score, tier, percentile, and a per-dimension breakdown.
        </p>
        <div className="mt-8">
          <Button size="lg" onClick={onRestart} className="gap-2 rounded-full">
            Start the assessment
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Body
// ---------------------------------------------------------------------------

/** Recommendation band for the text bank: low = 0-40, mid = 41-70, high = 71-100 */
function getBand(score: number): "low" | "mid" | "high" {
  if (score <= 40) return "low";
  if (score <= 70) return "mid";
  return "high";
}

function PriorityFocusCard({
  item,
  band,
  onOpenService,
}: {
  item: { meta: import("@/lib/types").DimensionMeta; score: number; tier: string; interp: string };
  band: "low" | "mid" | "high";
  onOpenService: (slug: string) => void;
}) {
  const rec = DOMAIN_RECOMMENDATIONS[item.meta.key]?.[band] ?? null;
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted",
            item.meta.accent
          )}
        >
          <Icon name={item.meta.icon} className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{item.meta.label}</p>
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider"
            >
              {item.tier}
            </Badge>
            <span className="ml-auto font-mono text-sm font-semibold tabular-nums">
              {item.score}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {rec?.text ?? item.interp}
          </p>
        </div>
      </div>
      {rec?.ctaService && (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenService(rec.ctaService!)}
            className="gap-1.5 rounded-full text-xs"
          >
            Explore related service
            <ArrowRight className="h-3.5 w-3.5" />
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
  onShare,
  onOpenService,
}: {
  result: AssessmentResult;
  respondent: RespondentProfile | null;
  onRetake: () => void;
  onFollowUp: () => void;
  onDownloadPDF: (stats: BenchmarkStats | null) => void;
  onShare: () => void;
  onOpenService: (slug: string) => void;
}) {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    // Yield to browser to let loading state paint before blocking PDF generation
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

  const tierMeta = TIER_META[result.tier];
  const percentileLabel =
    result.percentile >= 50
      ? `You're in the top ${100 - result.percentile}%`
      : `Higher than ${result.percentile}% of organisations benchmarked`;

  // Per-dimension enrichment.
  const dimRows = DIMENSIONS.map((d) => {
    const score = result.scores[d.key];
    return {
      meta: d,
      score,
      tier: scoreToTier(score),
      tierMeta: TIER_META[scoreToTier(score)],
      interp:
        score >= 70
          ? DIMENSION_INTERPRETATION[d.key].high
          : score >= 40
            ? DIMENSION_INTERPRETATION[d.key].mid
            : DIMENSION_INTERPRETATION[d.key].low,
    };
  });

  const sorted = [...dimRows].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 2);
  const focus = sorted.slice(-2).reverse();

  // Sector comparison: find the respondent's industry in the byIndustry breakdown.
  const respondentIndustry = respondent?.industry?.trim() || "";
  const sectorRow = React.useMemo(() => {
    if (!stats || statsState !== "loaded" || !respondentIndustry) return null;
    // Match case-insensitively against the industry labels in the stats.
    const match = stats.byIndustry.find(
      (r) => r.label.toLowerCase() === respondentIndustry.toLowerCase()
    );
    return match ?? null;
  }, [stats, statsState, respondentIndustry]);

  const radarData = DIMENSIONS.map((d) => ({
    dimension: d.short,
    score: result.scores[d.key],
    benchmark:
      stats && statsState === "loaded"
        ? Math.round(stats.dimensionAverages[d.key] ?? 0)
        : 0,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* HERO SCORE CARD ---------------------------------------------- */}
      <Reveal>
        <Eyebrow>Your benchmark report</Eyebrow>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Score */}
          <Card className="relative overflow-hidden py-6">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1"
              style={{ background: tierMeta.color }}
            />
            {/* Subtle tier-colored glow behind the score */}
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
              style={{ background: tierMeta.color }}
              aria-hidden
            />
            <CardContent className="relative px-6 sm:px-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="secondary"
                  className="gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: `${tierMeta.color}1a`,
                    color: tierMeta.color,
                  }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: tierMeta.color }}
                  />
                  {tierMeta.label} tier
                  <span className="ml-1 font-mono text-[10px] opacity-70">
                    {tierMeta.range}
                  </span>
                </Badge>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    Completed{" "}
                    {new Date(result.createdAt).toLocaleDateString(undefined, {
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
                    className="ml-auto h-8 gap-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <FileText
                      className={cn("h-3.5 w-3.5", downloading && "animate-pulse")}
                    />
                    {downloading ? "Preparing PDF..." : "Download PDF"}
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex items-end gap-3">
                <span className="text-6xl font-semibold tracking-tight tabular-nums sm:text-7xl">
                  {result.overall}
                </span>
                <span className="mb-2 text-2xl font-light text-muted-foreground">
                  / 100
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                Overall internal audit maturity
              </p>

              <Separator className="my-6" />

              <p className="text-sm leading-relaxed text-muted-foreground">
                {tierMeta.summary}
              </p>

              <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-3">
                <TrendingUp className="h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  {percentileLabel}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Radar */}
          <Card className="py-6">
            <CardHeader className="px-6 sm:px-8">
              <CardTitle className="text-lg">Your dimension profile</CardTitle>
              <CardDescription>
                The shape of your maturity, across all five dimensions.
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
                      name="You"
                      dataKey="score"
                      stroke="oklch(0.38 0.06 162)"
                      fill="oklch(0.38 0.06 162)"
                      fillOpacity={0.28}
                      strokeWidth={2}
                    />
                    {statsState === "loaded" && (
                      <Radar
                        name="Benchmark avg"
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
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </Reveal>

      {/* PEER COMPARISON ---------------------------------------------- */}
      <Reveal delay={0.05}>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card className="py-6">
            <CardHeader className="px-6 sm:px-8">
              <CardTitle className="text-lg">You vs the benchmark</CardTitle>
              <CardDescription>
                {statsState === "loaded"
                  ? `Compared against ${stats!.totalAssessments.toLocaleString()} completed benchmarks.`
                  : statsState === "loading"
                    ? "Loading benchmark data…"
                    : "Benchmark data not yet available."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8">
              {statsState === "loading" ? (
                <Skeleton className="h-[160px] w-full" />
              ) : statsState === "loaded" && stats ? (
                <ComparisonBars
                  you={result.overall}
                  avg={Math.round(stats.averageOverall)}
                />
              ) : (
                <div className="flex h-[160px] items-center justify-center rounded-lg border border-dashed bg-secondary/20 text-sm text-muted-foreground">
                  {statsState === "empty"
                    ? "Be among the first to set the benchmark."
                    : "Comparison unavailable."}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="py-6">
            <CardHeader className="px-6 sm:px-8">
              <CardTitle className="text-lg">Tier distribution</CardTitle>
              <CardDescription>
                Where everyone who has benchmarked sits today.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8">
              {statsState === "loading" ? (
                <Skeleton className="h-[160px] w-full" />
              ) : statsState === "loaded" && stats ? (
                <TierDistribution
                  distribution={stats.tierDistribution}
                  you={result.tier}
                />
              ) : (
                <div className="flex h-[160px] items-center justify-center rounded-lg border border-dashed bg-secondary/20 text-sm text-muted-foreground">
                  No distribution data yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Reveal >

      {/* SECTOR COMPARISON ------------------------------------------- */}
      {
        respondentIndustry && (
          <Reveal delay={0.05}>
            <Card className="mt-6 overflow-hidden py-0">
              <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Sector comparison
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">
                    You vs the {respondentIndustry.toLowerCase()} sector
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {sectorRow ? (
                      <>
                        Based on {sectorRow.count}{" "}
                        {sectorRow.count === 1 ? "organisation" : "organisations"} in
                        your sector who have benchmarked so far.
                      </>
                    ) : (
                      <>
                        No other organisations in the {respondentIndustry.toLowerCase()}{" "}
                        sector have benchmarked yet — you could be the reference point.
                      </>
                    )}
                  </p>
                  {sectorRow && (
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-xs">
                      <span className="text-muted-foreground">Sector average:</span>
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
                        {result.overall >= sectorRow.average
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
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-3xl font-semibold tracking-tight text-primary">
                        {result.overall}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Your score, setting the sector baseline
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Reveal>
        )
      }

      {/* PER-DIMENSION BREAKDOWN -------------------------------------- */}
      <Reveal delay={0.05}>
        <div className="mt-14">
          <SectionHeading
            eyebrow="Per-dimension breakdown"
            title="Where you lead, and where to focus."
          />
          <div className="mt-8 space-y-3">
            {dimRows.map((row) => (
              <DimensionRow key={row.meta.key} row={row} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* STRENGTHS & FOCUS ------------------------------------------- */}
      <Reveal delay={0.05}>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Top strengths */}
          <Card className="py-6">
            <CardHeader className="px-6 sm:px-8">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">Your strengths</CardTitle>
              </div>
              <CardDescription>
                The domains where your organisation is most mature.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8">
              {strengths.length > 0 && strengths[0].meta.key === focus[0]?.meta.key ? (
                <p className="text-sm text-muted-foreground">
                  Every domain scored in the same range — there is no single
                  standout strength this time. Keep sustaining this across the
                  whole function.
                </p>
              ) : (
                <ul className="space-y-4">
                  {strengths.map((s) => {
                    const rec =
                      DOMAIN_RECOMMENDATIONS[s.meta.key]?.[getBand(s.score)] ??
                      null;
                    return (
                      <li key={s.meta.key} className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10",
                            s.meta.accent
                          )}
                        >
                          <Icon name={s.meta.icon} className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{s.meta.label}</p>
                            <Badge
                              variant="outline"
                              className="text-[10px] uppercase tracking-wider"
                            >
                              {s.tier}
                            </Badge>
                            <span className="ml-auto font-mono text-sm font-semibold tabular-nums">
                              {s.score}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {rec ? rec.text : s.interp}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Priority focus */}
          <Card className="py-6">
            <CardHeader className="px-6 sm:px-8">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/15 text-amber-700">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">Priority focus area</CardTitle>
              </div>
              <CardDescription>
                Where the next dollar of effort will move the dial most.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8">
              {focus.length > 0 && (
                <PriorityFocusCard
                  item={focus[0]}
                  band={getBand(focus[0].score)}
                  onOpenService={onOpenService}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </Reveal>

      {/* WHAT YOUR TIER MEANS ----------------------------------------- */}
      <Reveal delay={0.05}>
        <Card className="mt-14 py-6">
          <CardHeader className="px-6 sm:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="size-2.5 rounded-full"
                style={{ background: tierMeta.color }}
              />
              <CardTitle className="text-xl">
                What your tier means — and what to do next.
              </CardTitle>
            </div>
            <CardDescription className="mt-1">
              {tierMeta.label} tier · {tierMeta.range} · {result.overall}/100
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {tierMeta.summary}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {TIER_RECOMMENDATIONS[result.tier].map((rec, i) => (
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

      {/* CTA ---------------------------------------------------------- */}
      <Reveal delay={0.05}>
        <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-primary text-primary-foreground">
          <div className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <Eyebrow className="text-primary-foreground/80">
                Take the next step
              </Eyebrow>
              <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Get your tailored briefing.
              </h2>
              <p className="mt-3 max-w-xl text-balance text-sm leading-relaxed text-primary-foreground/85">
                A 30-minute call with a Trennt partner to walk through your
                results, pressure-test the read, and translate your focus areas
                into a concrete 90-day plan.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={onFollowUp}
                className="gap-2 rounded-full bg-background text-foreground hover:bg-background/90"
              >
                Request a briefing
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onRetake}
                  className="gap-1.5 rounded-full text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retake
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onShare}
                  className="gap-1.5 rounded-full text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* TRUST NOTE --------------------------------------------------- */}
      <Reveal delay={0.05}>
        <div className="mt-8 flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
          <span>
            Your responses are stored securely and used only to compute your
            benchmark and improve aggregated insights. Assessment ID{" "}
            <span className="font-mono text-foreground/80">{result.id.slice(0, 8)}</span>
            .
          </span>
        </div>
      </Reveal>

      {/* Print-only helpers */}
      <div className="sr-only">
        <button onClick={() => typeof window !== "undefined" && window.print()}>
          <Printer className="h-4 w-4" />
          Download report
        </button>
      </div>
    </div >
  );
}

// ---------------------------------------------------------------------------
// Dimension row
// ---------------------------------------------------------------------------

function DimensionRow({
  row,
}: {
  row: {
    meta: (typeof DIMENSIONS)[number];
    score: number;
    tier: MaturityTier;
    interp: string;
  };
}) {
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-5 sm:p-5">
      <div className="flex items-center gap-3 sm:min-w-[200px]">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10",
            row.meta.accent
          )}
        >
          <Icon name={row.meta.icon} className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{row.meta.label}</p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {row.tier}
          </p>
        </div>
      </div>
      <div className="min-w-0">
        <Progress value={row.score} className="h-2" />
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {row.interp}
        </p>
      </div>
      <div className="flex items-center gap-2 sm:justify-end">
        <span className="font-mono text-2xl font-semibold tabular-nums">
          {row.score}
        </span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Comparison bars (You vs benchmark average)
// ---------------------------------------------------------------------------

function ComparisonBars({ you, avg }: { you: number; avg: number }) {
  const data = [
    { name: "You", value: you },
    { name: "Benchmark avg", value: avg },
  ];
  return (
    <div className="h-[160px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
        >
          <CartesianGrid
            horizontal={false}
            stroke="oklch(0.89 0.012 120)"
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: "oklch(0.48 0.02 150)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
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
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={28}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={
                  d.name === "You"
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

// ---------------------------------------------------------------------------
// Sector gauge — a compact three-bar comparison (you / sector / overall)
// ---------------------------------------------------------------------------

function SectorGauge({
  you,
  sector,
  overallAvg,
}: {
  you: number;
  sector: number;
  overallAvg: number;
}) {
  const rows = [
    {
      label: "You",
      value: you,
      color: "oklch(0.38 0.06 162)",
      bold: true,
    },
    {
      label: "Your sector",
      value: sector,
      color: "oklch(0.55 0.1 195)",
      bold: false,
    },
    {
      label: "All sectors",
      value: overallAvg,
      color: "oklch(0.72 0.13 75)",
      bold: false,
    },
  ];
  return (
    <div className="w-full max-w-[240px] space-y-3">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-center justify-between text-xs">
            <span
              className={
                r.bold
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              }
            >
              {r.label}
            </span>
            <span
              className={
                r.bold
                  ? "font-semibold text-foreground tabular-nums"
                  : "text-muted-foreground tabular-nums"
              }
            >
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

// ---------------------------------------------------------------------------
// Tier distribution mini-chart
// ---------------------------------------------------------------------------

function TierDistribution({
  distribution,
  you,
}: {
  distribution: Record<MaturityTier, number>;
  you: MaturityTier;
}) {
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
        return (
          <div key={t} className="flex items-center gap-3">
            <div className="flex w-28 items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ background: TIER_META[t].color }}
              />
              <span className="text-xs font-medium">{t}</span>
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
            <span className="w-12 text-right font-mono text-xs tabular-nums text-muted-foreground">
              {pct}%
            </span>
            {isYou && (
              <Badge
                variant="outline"
                className="border-primary/40 text-[10px] font-medium text-primary"
              >
                You
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
