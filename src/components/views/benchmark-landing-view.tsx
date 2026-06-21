"use client";

import * as React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Compass,
  Lock,
  RefreshCw,
  Sparkles,
  Users,
  BarChart3,
  FileText,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useNav } from "@/lib/store";
import {
  BENCHMARK_QUESTIONS,
  DIMENSIONS,
  TIER_META,
} from "@/lib/content";
import type { BenchmarkStats, MaturityTier } from "@/lib/types";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/site/icon";
import { cn } from "@/lib/utils";

const OUTCOMES = [
  {
    icon: Compass,
    title: "Your maturity tier",
    description:
      "A clear Nascent → Leading rating, normalised from 15 evidence-based questions across the five dimensions of digital maturity.",
  },
  {
    icon: BarChart3,
    title: "A per-dimension breakdown",
    description:
      "Where you lead, where you lag, and a radar profile that makes the shape of your organisation legible at a glance.",
  },
  {
    icon: Users,
    title: "Your position vs peers",
    description:
      "An honest percentile against every organisation that has benchmarked with us — not a flattering vanity number.",
  },
  {
    icon: FileText,
    title: "A tailored next-steps briefing",
    description:
      "Two-to-three recommendations calibrated to your tier, with an optional 1:1 consultation to make them concrete.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Answer 15 questions",
    description:
      "Fifteen sharp statements across five dimensions, on a 1–5 scale. Roughly eight minutes; no jargon, no homework required.",
  },
  {
    n: "02",
    title: "Get your score & tier",
    description:
      "We normalise your answers to a 0–100 maturity score, place you in one of four tiers, and compute your percentile vs the cohort.",
  },
  {
    n: "03",
    title: "Decide what's next",
    description:
      "Review your strengths and focus areas, then — if useful — request a tailored briefing with a Meridian partner.",
  },
];

const FAQ = [
  {
    q: "How long does it take?",
    a: "Most leaders complete the benchmark in six to nine minutes. There are 15 statements across five dimensions, each on a 1–5 scale. You can pause and resume — your responses are saved as you go.",
  },
  {
    q: "Is my data confidential?",
    a: "Yes. Your individual responses are stored securely and used only to compute your benchmark and to improve aggregated, anonymised insights. We never publish individual scores or share them with third parties. You can request deletion at any time.",
  },
  {
    q: "What do I get at the end?",
    a: "A full results report: your overall maturity score, tier, percentile against the cohort, a per-dimension radar profile, identified strengths and focus areas, and a short set of recommendations calibrated to your tier. You can request a 1:1 follow-up from the results page.",
  },
  {
    q: "Can my team take it too?",
    a: "Absolutely — and we encourage it. Running the benchmark across a leadership team reveals where there is alignment and where there is divergence on digital maturity. Get in touch via the follow-up form and we will set up a cohort view for your organisation.",
  },
];

export function BenchmarkLandingView() {
  const navigate = useNav((s) => s.navigate);
  const startAssessment = useNav((s) => s.startAssessment);
  const result = useNav((s) => s.result);

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
        const data = (await res.json()) as BenchmarkStats;
        if (cancelled) return;
        if (!data || data.totalAssessments === 0) {
          setStatsState("empty");
          setStats(data ?? null);
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

  const handleStart = () => {
    startAssessment();
    navigate("benchmark-quiz");
  };

  return (
    <div className="relative">
      {/* HERO ---------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-60" />
        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
          <Reveal>
            <Eyebrow>The Meridian Benchmark</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl md:leading-[1.05]">
              How digitally mature is your organisation,{" "}
              <span className="text-primary">really?</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
              A fifteen-question diagnostic, grounded in five dimensions of
              digital maturity. Eight minutes in, you get an honest score, a
              tier, a percentile against your peers, and a clear sense of where
              to focus next.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={handleStart}
                className="h-12 gap-2 rounded-full px-7 text-base shadow-sm"
              >
                Start the assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("contact")}
                className="h-12 gap-2 rounded-full px-7 text-base"
              >
                Talk to us
              </Button>
              {result && (
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => navigate("benchmark-results")}
                  className="h-12 gap-2 rounded-full px-5 text-base"
                >
                  <RefreshCw className="h-4 w-4" />
                  View your last result
                </Button>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary/70" /> ~8 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary/70" /> Confidential
                &amp; secure
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary/70" /> No signup
                to start
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS STRIP -------------------------------------------------- */}
      <section className="border-y border-border/70 bg-secondary/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          <StatCell
            label="Organisations benchmarked"
            value={
              statsState === "loading" ? (
                <Skeleton className="h-9 w-24" />
              ) : statsState === "empty" || statsState === "error" ? (
                <span className="text-3xl font-semibold tracking-tight text-foreground">
                  Be the first
                </span>
              ) : (
                <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                  {stats.totalAssessments.toLocaleString()}
                </span>
              )
            }
            sub={
              statsState === "empty"
                ? "Set the benchmark for your sector"
                : "And counting, across sectors"
            }
          />
          <StatCell
            label="Average maturity score"
            value={
              statsState === "loading" ? (
                <Skeleton className="h-9 w-24" />
              ) : statsState === "empty" || statsState === "error" ? (
                <span className="text-3xl font-semibold tracking-tight text-foreground">
                  —
                </span>
              ) : (
                <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                  {stats.averageOverall.toFixed(0)}
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / 100
                  </span>
                </span>
              )
            }
            sub="Mean across all submissions"
          />
          <StatCell
            label="Questions"
            value={
              <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                {BENCHMARK_QUESTIONS.length}
              </span>
            }
            sub="Across 5 dimensions"
          />
          <StatCell
            label="Tiers"
            value={
              <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                4
              </span>
            }
            sub="Nascent → Leading"
          />
        </div>
        {statsState === "loaded" && (
          <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate("benchmark-insights")}
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Explore the full insights dashboard
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        )}
      </section>

      {/* WHAT YOU'LL GET ---------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="What you'll get"
            title="A genuine diagnostic, not a quiz."
            description="You will leave with a defensible read on your digital maturity — and a clear point of view on what to do about it."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OUTCOMES.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.05}>
              <Card className="h-full gap-4 py-6 transition-shadow hover:shadow-md">
                <CardHeader className="px-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <o.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <CardTitle className="mt-2 text-base font-semibold">
                    {o.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {o.description}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* THE FIVE DIMENSIONS ------------------------------------------ */}
      <section className="border-y border-border/70 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="What we measure"
              title="Five dimensions of digital maturity."
              description="Maturity is not one number — it is a shape. We assess the five dimensions that, in our experience, separate organisations that compound from those that stall."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {DIMENSIONS.map((d, i) => (
              <Reveal key={d.key} delay={i * 0.05}>
                <Card className="h-full gap-3 py-6 transition-shadow hover:shadow-md">
                  <CardHeader className="px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-9 items-center justify-center rounded-md bg-primary/10",
                          d.accent
                        )}
                      >
                        <DimensionGlyph name={d.icon} />
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                        {String(i + 1).padStart(2, "0")} · {d.short}
                      </Badge>
                    </div>
                    <CardTitle className="mt-1 text-lg">{d.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {d.description}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
            <Reveal delay={0.25}>
              <Card className="h-full justify-center border-dashed bg-transparent py-6 shadow-none">
                <CardContent className="flex h-full flex-col items-start justify-center gap-3 px-6">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Each dimension carries three sharp statements — drawn from
                    our work with 320+ organisations — designed to surface
                    where you genuinely are, not where you wish you were.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS -------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps. About eight minutes."
          />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col gap-3 bg-card p-6 sm:p-8"
            >
              <span className="font-mono text-sm font-medium tracking-widest text-primary/80">
                {s.n}
              </span>
              <h3 className="text-lg font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* METHODOLOGY -------------------------------------------------- */}
      <section className="border-y border-border/70 bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <Eyebrow>Methodology &amp; trust</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              How the scoring works — and how we keep your data safe.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Each of the fifteen statements uses a 1–5 Likert scale. Your
                answers are normalised to a 0–100 maturity score per dimension
                (where 1 maps to 0 and 5 maps to 100), and a weighted overall
                score is computed across all five. The overall score places you
                in one of four tiers — Nascent, Developing, Established, or
                Leading — with bespoke recommendations for each.
              </p>
              <p>
                Your percentile is computed against every other completed
                benchmark in our dataset. It is descriptive, not prescriptive:
                a low percentile is information, not a verdict.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                {(Object.keys(TIER_META) as MaturityTier[]).map((t) => (
                  <div
                    key={t}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: TIER_META[t].color }}
                      />
                      <span className="text-sm font-semibold">{t}</span>
                    </div>
                    <p className="mt-1.5 font-mono text-xs text-muted-foreground">
                      {TIER_META[t].range}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-8 flex items-start gap-2 rounded-lg border border-border bg-card p-4 text-sm">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                <span>
                  Your responses are stored securely and used only to compute
                  your benchmark and improve aggregated, anonymised insights.
                  We never share individual scores. You can request deletion at
                  any time by emailing{" "}
                  <span className="font-medium text-foreground">
                    hello@meridianadvisory.com
                  </span>
                  .
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ ---------------------------------------------------------- */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Frequently asked"
            title="Good questions, briefly answered."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Accordion type="single" collapsible className="mt-10 w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      {/* FINAL CTA ---------------------------------------------------- */}
      <section className="border-t border-border/70 bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl p-px">
              {/* Gradient border */}
              <div
                className="absolute inset-0 rounded-3xl opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.38 0.06 162), oklch(0.72 0.13 75), oklch(0.52 0.1 195))",
                }}
                aria-hidden
              />
              <div className="relative rounded-[calc(1.5rem-1px)] bg-background px-6 py-14 text-center sm:px-12 md:py-20">
                <Eyebrow className="justify-center">Begin</Eyebrow>
                <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                  Eight minutes. A clearer picture of where you stand.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground">
                  There is no signup required to start. Your responses save
                  automatically as you go.
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={handleStart}
                    className="h-12 gap-2 rounded-full px-8 text-base shadow-sm"
                  >
                    Start the assessment
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  {result && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("benchmark-results")}
                      className="h-12 gap-2 rounded-full px-6 text-base"
                    >
                      Review your last result
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function StatCell({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 bg-secondary/30 px-5 py-8 sm:px-6">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1">{value}</div>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

// Small wrapper so we can lazily map dimension.icon (a lucide name string) via
// the project's Icon helper without a second import surface.
function DimensionGlyph({ name }: { name: string }) {
  return <Icon name={name} className="h-5 w-5" />;
}
