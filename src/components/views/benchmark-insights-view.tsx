"use client";

import * as React from "react";
import {
  BarChart3,
  Users,
  Building2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  Activity,
  Target,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { TooltipValueType } from "recharts";
import { useNav } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { DIMENSIONS, TIER_META } from "@/lib/content";
import type { BenchmarkStats, MaturityTier } from "@/lib/types";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Icon } from "@/components/site/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TIER_COLORS: Record<MaturityTier, string> = {
  initial: "oklch(0.55 0.12 35)",
  defined: "oklch(0.62 0.1 260)",
  developing: "oklch(0.72 0.13 75)",
  established: "oklch(0.55 0.1 162)",
  advanced: "oklch(0.52 0.1 195)",
};

const DIMENSION_COLORS = [
  "oklch(0.52 0.1 162)",
  "oklch(0.72 0.13 75)",
  "oklch(0.55 0.09 195)",
  "oklch(0.6 0.08 50)",
  "oklch(0.55 0.12 35)",
];

function formatDuration(sec: number): string {
  if (!sec || sec <= 0) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatWeek(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function BenchmarkInsightsView() {
  const { t, l, lang, isRTL } = useTranslation();
  const navigate = useNav((s) => s.navigate);
  const [stats, setStats] = React.useState<BenchmarkStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/benchmark/stats", { cache: "no-store" });
        if (!res.ok) throw new Error("failed");
        const json = (await res.json()) as { ok: boolean; data?: BenchmarkStats };
        if (!cancelled) {
          setStats(json.data ?? null);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dimensionData = React.useMemo(() => {
    if (!stats) return [];
    return DIMENSIONS.map((d) => ({
      dimension: l(d.short),
      fullLabel: l(d.label),
      average: stats.dimensionAverages[d.key],
    }));
  }, [stats, l]);

  const tierData = React.useMemo(() => {
    if (!stats) return [];
    return (["initial", "developing", "defined", "established", "advanced"] as MaturityTier[]).map(
      (tierKey) => ({
        name: l(TIER_META[tierKey].label),
        value: stats.tierDistribution[tierKey] ?? 0,
        fill: TIER_COLORS[tierKey],
      })
    );
  }, [stats, l]);

  const radarData = React.useMemo(() => {
    if (!stats) return [];
    return DIMENSIONS.map((d) => ({
      dimension: l(d.short),
      average: stats.dimensionAverages[d.key],
    }));
  }, [stats, l]);

  return (
    <div className={cn("bg-background", isRTL && "font-arabic")}>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-secondary/30">
        <div className="absolute inset-0 bg-radial-fade opacity-70" />
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <Reveal>
            <Eyebrow>{t("benchmark.insights.hero.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.02]">
              {t("benchmark.insights.hero.title_p1")}{" "}
              <span className="text-primary">{t("benchmark.insights.hero.title_p2")}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("benchmark.insights.hero.description")}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => navigate("benchmark-landing")}
                className="gap-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t("benchmark.insights.hero.cta_primary")}
                <ArrowUpRight className={cn("h-4 w-4", isRTL && "rotate-90")} />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("contact")}
                className="rounded-full"
              >
                {t("benchmark.insights.hero.cta_secondary")}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {loading ? (
        <InsightsSkeleton />
      ) : error ? (
        <ErrorState onRetry={() => window.location.reload()} />
      ) : stats && stats.totalAssessments === 0 ? (
        <EmptyState onStart={() => navigate("benchmark-landing")} />
      ) : stats ? (
        <>
          {/* KPI strip */}
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <Reveal>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KpiCard
                  icon={<Users className="h-4 w-4" />}
                  label={t("benchmark.insights.kpi.total.label")}
                  value={stats.totalAssessments.toString()}
                  sub={t("benchmark.insights.kpi.total.sub")}
                />
                <KpiCard
                  icon={<Target className="h-4 w-4" />}
                  label={t("benchmark.insights.kpi.average.label")}
                  value={`${stats.averageOverall}`}
                  sub={t("benchmark.insights.kpi.average.sub")}
                  accent
                />
                <KpiCard
                  icon={<Activity className="h-4 w-4" />}
                  label={t("benchmark.insights.kpi.advanced.label")}
                  value={`${Math.round(
                    ((stats.tierDistribution.advanced ?? 0) /
                      Math.max(stats.totalAssessments, 1)) *
                      100
                  )}%`}
                  sub={t("benchmark.insights.kpi.advanced.sub")}
                />
                <KpiCard
                  icon={<Clock className="h-4 w-4" />}
                  label={t("benchmark.insights.kpi.duration.label")}
                  value={formatDuration(stats.avgDurationSec)}
                  sub={t("benchmark.insights.kpi.duration.sub")}
                />
              </div>
            </Reveal>
          </section>

          {/* Dimension averages — radar + bar */}
          <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow={t("benchmark.insights.dimensions.eyebrow")}
                title={t("benchmark.insights.dimensions.title")}
                description={t("benchmark.insights.dimensions.description")}
              />
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-5">
              <Reveal delay={0.05} className="lg:col-span-2">
                <Card className="h-full rounded-xl border-border/70 p-6">
                  <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {t("benchmark.insights.dimensions.profile_label")}
                  </h3>
                  <div className="mt-4 h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} outerRadius={100}>
                        <PolarGrid stroke="oklch(0.7 0.02 150 / 0.3)" />
                        <PolarAngleAxis
                          dataKey="dimension"
                          tick={{ fontSize: 11, fill: "oklch(0.45 0.02 150)" }}
                        />
                        <PolarRadiusAxis
                          domain={[0, 100]}
                          tick={{ fontSize: 9, fill: "oklch(0.55 0.02 150)" }}
                          angle={90}
                        />
                        <Radar
                          name="Average"
                          dataKey="average"
                          stroke="oklch(0.38 0.06 162)"
                          fill="oklch(0.38 0.06 162)"
                          fillOpacity={0.25}
                          strokeWidth={2}
                        />
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
                </Card>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-3">
                <Card className="h-full rounded-xl border-border/70 p-6">
                  <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {t("benchmark.insights.dimensions.bar_label")}
                  </h3>
                  <div className="mt-4 h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dimensionData}
                        layout="vertical"
                        margin={{ left: 8, right: 24, top: 8, bottom: 8 }}
                      >
                        <CartesianGrid
                          horizontal={false}
                          stroke="oklch(0.89 0.012 120)"
                        />
                        <XAxis
                          type="number"
                          domain={[0, 100]}
                          tick={{ fontSize: 11, fill: "oklch(0.48 0.02 150)" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="dimension"
                          width={90}
                          tick={{ fontSize: 12, fill: "oklch(0.21 0.02 150)" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "oklch(0.38 0.06 162 / 0.05)" }}
                          contentStyle={{
                            borderRadius: 8,
                            border: "1px solid oklch(0.89 0.012 120)",
                            fontSize: 12,
                          }}
                          formatter={(v: TooltipValueType | undefined) => [`${typeof v === "number" ? v : 0} / 100`, t("benchmark.insights.common.average")]}
                        />
                        <Bar dataKey="average" radius={[0, 6, 6, 0]} barSize={28}>
                          {dimensionData.map((_, i) => (
                            <Cell key={i} fill={DIMENSION_COLORS[i % DIMENSION_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Reveal>
            </div>

            {/* Dimension detail cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {DIMENSIONS.map((d, i) => {
                const score = stats.dimensionAverages[d.key];
                return (
                  <Reveal key={d.key} delay={0.05 * i}>
                    <Card className="h-full rounded-xl border-border/70 p-5 transition-all hover:border-primary/30 hover:shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 text-primary">
                          <Icon name={d.icon} className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {l(d.short)}
                        </span>
                      </div>
                      <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                        {score}
                        <span className="text-base font-normal text-muted-foreground">
                          {" "}
                          / 100
                        </span>
                      </p>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${score}%`,
                            backgroundColor: DIMENSION_COLORS[i],
                          }}
                        />
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {l(d.description)}
                      </p>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* Tier distribution + trend */}
          <section className="border-y border-border/60 bg-secondary/30">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
              <Reveal>
                <SectionHeading
                  eyebrow={t("benchmark.insights.distribution.eyebrow")}
                  title={t("benchmark.insights.distribution.title")}
                  description={t("benchmark.insights.distribution.description")}
                />
              </Reveal>
              <div className="mt-10 grid gap-6 lg:grid-cols-5">
                <Reveal delay={0.05} className="lg:col-span-2">
                  <Card className="h-full rounded-xl border-border/70 p-6">
                    <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {t("benchmark.insights.distribution.tiers_label")}
                    </h3>
                    <div className="mt-4 h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={tierData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={90}
                            paddingAngle={2}
                          >
                            {tierData.map((entry, i) => (
                              <Cell key={i} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: 8,
                              border: "1px solid oklch(0.89 0.012 120)",
                              fontSize: 12,
                            }}
                          />
                          <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: 12 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {(
                        ["initial", "developing", "defined", "established", "advanced"] as MaturityTier[]
                      ).map((tier) => (
                        <div
                          key={tier}
                          className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: TIER_COLORS[tier] }}
                          />
                          <span className="text-xs font-medium text-foreground">
                            {stats.tierDistribution[tier] ?? 0}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {isRTL ? t(`benchmark.tiers.${tier}.label`) : tier}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Reveal>
                <Reveal delay={0.1} className="lg:col-span-3">
                  <Card className="h-full rounded-xl border-border/70 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {t("benchmark.insights.distribution.trend_label")}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="gap-1 text-xs font-normal"
                      >
                        <TrendingUp className="h-3 w-3" />
                        {t("benchmark.insights.distribution.trend_badge")}
                      </Badge>
                    </div>
                    <div className="mt-4 h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={stats.trend.map((t) => ({
                            ...t,
                            label: formatWeek(t.weekStart),
                          }))}
                          margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="0%"
                                stopColor="oklch(0.38 0.06 162)"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="100%"
                                stopColor="oklch(0.38 0.06 162)"
                            stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            vertical={false}
                            stroke="oklch(0.89 0.012 120)"
                          />
                          <XAxis
                            dataKey="label"
                            tick={{ fontSize: 10, fill: "oklch(0.48 0.02 150)" }}
                            axisLine={false}
                            tickLine={false}
                            interval={1}
                            reversed={isRTL}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 10, fill: "oklch(0.48 0.02 150)" }}
                            axisLine={false}
                            tickLine={false}
                            width={28}
                            orientation={isRTL ? "right" : "left"}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 8,
                              border: "1px solid oklch(0.89 0.012 120)",
                              fontSize: 12,
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="oklch(0.38 0.06 162)"
                            strokeWidth={2}
                            fill="url(#trendGrad)"
                            name={t("benchmark.insights.distribution.trend_name")}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Breakdowns: industry + company size */}
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow={t("benchmark.insights.segments.eyebrow")}
                title={t("benchmark.insights.segments.title")}
                description={t("benchmark.insights.segments.description")}
              />
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Reveal delay={0.05}>
                <Card className="h-full rounded-xl border-border/70 p-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {t("benchmark.insights.segments.industry_label")}
                    </h3>
                  </div>
                  <div className="mt-5 space-y-3">
                    {stats.byIndustry.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {t("benchmark.insights.segments.no_data")}
                      </p>
                    ) : (
                      stats.byIndustry.map((row) => (
                        <div key={row.label}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-foreground">
                              {row.label}
                            </span>
                            <span className="text-muted-foreground">
                              {row.average}/100 · {row.count}{" "}
                              {row.count === 1 ? t("benchmark.insights.common.org") : t("benchmark.insights.common.orgs")}
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary/70"
                              style={{ width: `${row.average}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </Reveal>
              <Reveal delay={0.1}>
                <Card className="h-full rounded-xl border-border/70 p-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {t("benchmark.insights.segments.size_label")}
                    </h3>
                  </div>
                  <div className="mt-5 h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.byCompanySize.map((s) => ({
                          ...s,
                          label: s.label,
                        }))}
                        margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                      >
                        <CartesianGrid
                          vertical={false}
                          stroke="oklch(0.89 0.012 120)"
                        />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 11, fill: "oklch(0.48 0.02 150)" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fontSize: 10, fill: "oklch(0.48 0.02 150)" }}
                          axisLine={false}
                          tickLine={false}
                          width={28}
                        />
                        <Tooltip
                          cursor={{ fill: "oklch(0.38 0.06 162 / 0.05)" }}
                          contentStyle={{
                            borderRadius: 8,
                            border: "1px solid oklch(0.89 0.012 120)",
                            fontSize: 12,
                          }}
                          formatter={(v: any) => [`${typeof v === "number" ? v : 0} / 100`, t("benchmark.insights.common.average")]}
                          labelFormatter={(label) => `${t("benchmark.insights.segments.size_tooltip_prefix")}: ${label}`}
                        />
                        <Bar
                          dataKey="average"
                          radius={[6, 6, 0, 0]}
                          barSize={48}
                          fill="oklch(0.72 0.13 75)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t("benchmark.insights.segments.size_footer")}
                  </p>
                </Card>
              </Reveal>
            </div>
          </section>

          {/* Insights summary */}
          <section className="border-t border-border/60 bg-secondary/30">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
              <Reveal>
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-1">
                    <Eyebrow>{t("benchmark.insights.observations.eyebrow")}</Eyebrow>
                    <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                      {t("benchmark.insights.observations.title")}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {t("benchmark.insights.observations.description")}
                    </p>
                  </div>
                  <div className="grid gap-4 lg:col-span-2 sm:grid-cols-3">
                    <InsightCard
                      icon={<BarChart3 className="h-4 w-4" />}
                      title={t("benchmark.insights.observations.strongest.title")}
                      body={
                        stats.dimensionAverages
                          ? (() => {
                              const entries = Object.entries(stats.dimensionAverages);
                              entries.sort((a, b) => b[1] - a[1]);
                              const top = entries[0];
                              const topDim = DIMENSIONS.find((d) => d.key === top[0]);
                              const dimLabel = isRTL ? t(`benchmark.dimensions.${top[0]}.label`) : (topDim?.label ?? top[0]);
                              return t("benchmark.insights.observations.strongest.body")
                                .replace("{dimension}", dimLabel)
                                .replace("{score}", top[1].toString());
                            })()
                          : "—"
                      }
                    />
                    <InsightCard
                      icon={<AlertCircle className="h-4 w-4" />}
                      title={t("benchmark.insights.observations.weakest.title")}
                      body={
                        stats.dimensionAverages
                          ? (() => {
                              const entries = Object.entries(stats.dimensionAverages);
                              entries.sort((a, b) => a[1] - b[1]);
                              const bottom = entries[0];
                              const bottomDim = DIMENSIONS.find(
                                (d) => d.key === bottom[0]
                              );
                              const dimLabel = isRTL ? t(`benchmark.dimensions.${bottom[0]}.label`) : (bottomDim?.label ?? bottom[0]);
                              return t("benchmark.insights.observations.weakest.body")
                                .replace("{dimension}", dimLabel)
                                .replace("{score}", bottom[1].toString());
                            })()
                          : "—"
                      }
                    />
                    <InsightCard
                      icon={<Sparkles className="h-4 w-4" />}
                      title={t("benchmark.insights.observations.frontier.title")}
                      body={t("benchmark.insights.observations.frontier.body")
                        .replace("{percent}", Math.round(
                          ((stats.tierDistribution.advanced ?? 0) /
                            Math.max(stats.totalAssessments, 1)) *
                            100
                        ).toString())}
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary px-8 py-12 text-primary-foreground sm:px-12 md:py-16">
                <div className="absolute inset-0 bg-grid opacity-10" />
                <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-xl">
                    <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                      {t("benchmark.insights.cta.title")}
                    </h2>
                    <p className="mt-3 text-primary-foreground/80">
                      {t("benchmark.insights.cta.description")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      onClick={() => navigate("benchmark-landing")}
                      className="gap-1.5 rounded-full bg-background text-foreground hover:bg-background/90"
                    >
                      {t("benchmark.insights.cta.primary")}
                      <ArrowUpRight className={cn("h-4 w-4", isRTL && "rotate-90")} />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("contact")}
                      className="rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                      {t("benchmark.insights.cta.secondary")}
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        </>
      ) : null}
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <Card
      className={`rounded-xl border-border/70 p-5 transition-all hover:border-primary/30 hover:shadow-sm ${
        accent ? "bg-primary/5" : ""
      }`}
    >
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span
          className={`text-3xl font-semibold tracking-tight md:text-4xl ${
            accent ? "text-primary" : "text-foreground"
          }`}
        >
          {value}
        </span>
        {sub && (
          <span className="text-sm text-muted-foreground">{sub}</span>
        )}
      </div>
    </Card>
  );
}

function InsightCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="h-full rounded-xl border-border/70 bg-background/60 p-5">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs font-medium uppercase tracking-[0.14em]">
          {title}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{body}</p>
    </Card>
  );
}

function InsightsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <Skeleton className="h-[340px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[340px] rounded-xl lg:col-span-3" />
      </div>
      <Skeleton className="mt-6 h-40 rounded-xl" />
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold">{t("benchmark.insights.error.title")}</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {t("benchmark.insights.error.description")}
        </p>
        <Button onClick={onRetry} className="mt-6 rounded-full">
          {t("benchmark.insights.error.cta")}
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ onStart }: { onStart: () => void }) {
  const { t, isRTL } = useTranslation();
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <BarChart3 className="h-10 w-10 text-primary" />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          {t("benchmark.insights.empty.title")}
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {t("benchmark.insights.empty.description")}
        </p>
        <Button onClick={onStart} className="mt-6 gap-1.5 rounded-full">
          {t("benchmark.insights.empty.cta")}
          <ArrowUpRight className={cn("h-4 w-4", isRTL && "rotate-90")} />
        </Button>
      </div>
    </div>
  );
}
