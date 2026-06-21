"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Quote, Activity } from "lucide-react";
import { useNav } from "@/lib/store";
import {
  CASE_STUDIES,
  COMPANY,
  LEADERSHIP,
  METHODOLOGY,
  SERVICES,
  STATS,
  TESTIMONIALS,
} from "@/lib/content";
import { Icon } from "@/components/site/icon";
import { CountUp } from "@/components/site/count-up";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { QuickBenchmark } from "@/components/site/quick-benchmark";

function AnimatedBar({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: number;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
        />
      </div>
    </div>
  );
}

export function HomeView() {
  const navigate = useNav((s) => s.navigate);

  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b border-border/60"
      >
        {/* Gradient mesh — soft colored blobs for depth */}
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "oklch(0.38 0.06 162)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "oklch(0.72 0.13 75)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-radial-fade" aria-hidden />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <Eyebrow>Independent strategy · technology · data</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  id="hero-heading"
                  className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.02]"
                >
                  Strategy, technology &amp; data for the{" "}
                  <span className="text-primary">next standard.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance">
                  TRENNT Consulting Group is an independent consulting firm helping
                  world-leading organizations turn strategy into measurable outcomes
                  — across digital transformation, data &amp; AI, and operational
                  excellence.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    onClick={() => navigate("benchmark-landing")}
                    className="h-11 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-sm hover:bg-primary/90"
                  >
                    Take the Strategic Benchmark Assessment
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("services")}
                    className="h-11 gap-2 rounded-full border-border/70 bg-background/60 px-6 backdrop-blur hover:bg-accent hover:text-accent-foreground"
                  >
                    Explore services
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>

              {/* trust bar */}
              <Reveal delay={0.2}>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                  <span className="font-medium text-foreground/70">
                    Trusted by
                  </span>
                  <span>Asteria Financial</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>Tundra Industrials</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>Northwind Logistics</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>Mersey Health Partners</span>
                </div>
              </Reveal>
            </div>

            {/* visual panel */}
            <div className="lg:col-span-5">
              <Reveal delay={0.15}>
                <div className="relative">
                  <div
                    className="absolute -inset-3 -z-10 rounded-3xl bg-primary/5 blur-2xl"
                    aria-hidden
                  />
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Card className="overflow-hidden rounded-2xl border-border/70 bg-card/95 p-6 shadow-sm backdrop-blur">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 text-primary">
                            <Icon name="Compass" className="h-4 w-4" />
                          </span>
                          <div className="text-sm font-medium">
                            Strategic Maturity Snapshot
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          </span>
                          Live cohort
                        </span>
                      </div>
                      <div className="mt-6 space-y-4">
                        {[
                          { label: "Strategy & Vision", v: 72 },
                          { label: "Technology & Architecture", v: 58 },
                          { label: "Culture & Talent", v: 64 },
                          { label: "Data & AI", v: 41 },
                          { label: "Operations & Delivery", v: 69 },
                        ].map((row, i) => (
                          <AnimatedBar
                            key={row.label}
                            label={row.label}
                            value={row.v}
                            delay={0.4 + i * 0.12}
                          />
                        ))}
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                            Overall
                          </div>
                          <div className="text-2xl font-semibold tabular-nums text-primary">
                            61 / 100
                          </div>
                        </div>
                        <Badge className="rounded-full bg-accent text-accent-foreground">
                          Established
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                  {/* Activity chip below card */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="mt-4 hidden items-center justify-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-3 py-2.5 sm:inline-flex"
                  >
                    <Activity className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-muted-foreground">
                      <span className="font-semibold text-foreground">247</span>{" "}
                      assessments completed this quarter
                    </span>
                  </motion.div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* STATS BAND                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="stats-heading"
        className="border-b border-border/60 bg-secondary/40"
      >
        <h2 id="stats-heading" className="sr-only">
          By the numbers
        </h2>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <div className="flex flex-col">
                  <dt className="sr-only">{s.label}</dt>
                  <dd
                    className="text-4xl font-semibold tabular-nums tracking-tight text-primary md:text-5xl"
                  >
                    <CountUp value={s.value} />
                  </dd>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {s.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SERVICES PREVIEW                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="services-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What we do"
            title="Six practices, one operating model."
            description="We bring strategy, technology, data, operations, security and sustainability under one roof — so transformation is coherent, not coordinated."
            className="max-w-2xl"
          />
          <Reveal delay={0.1}>
            <Button
              variant="ghost"
              onClick={() => navigate("services")}
              className="gap-2 text-primary hover:text-primary"
            >
              View all services
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.06}>
              <button
                onClick={() => navigate("services")}
                className="group flex h-full w-full flex-col items-start rounded-xl border border-border/70 bg-card p-6 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.tagline}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Learn more
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* BENCHMARK FEATURE BAND                                              */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="benchmark-heading"
        className="relative overflow-hidden bg-primary text-primary-foreground"
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.98 0.01 95) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.98 0.01 95) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-primary-foreground/80">
                  <span className="h-px w-6 bg-primary-foreground/40" />
                  Free tool · 8 minutes
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2
                  id="benchmark-heading"
                  className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl"
                >
                  How strategically mature is your organisation, really?
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:text-lg text-balance">
                  The Trennt Strategic Benchmark Assessment is a free, structured
                  assessment across five dimensions. Answer fifteen questions,
                  get a calibrated score, a strategic maturity tier, and a per-dimension
                  breakdown — benchmarked against our engagement dataset.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {[
                    "5 dimensions",
                    "15 questions",
                    "8 minutes",
                    "No email to start",
                  ].map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium"
                    >
                      <Check className="h-3.5 w-3.5" />
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8">
                  <Button
                    size="lg"
                    onClick={() => navigate("benchmark-landing")}
                    className="h-11 gap-2 rounded-full bg-primary-foreground px-6 text-primary shadow-sm hover:bg-primary-foreground/90"
                  >
                    Start the benchmark
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.15}>
                <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/70">
                    What you&apos;ll get
                  </div>
                  <ul className="mt-4 space-y-3 text-sm">
                    {[
                      "An overall strategic strategic maturity score from 0 to 100",
                      "A tier: Nascent, Developing, Established, or Leading",
                      "Per-dimension breakdown across the five axes",
                      "Percentile ranking vs benchmark dataset",
                      "A short, tailored set of next moves",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground" />
                        <span className="text-primary-foreground/90">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* QUICK BENCHMARK PREVIEW                                             */}
      {/* ------------------------------------------------------------------ */}
      <QuickBenchmark />

      {/* ------------------------------------------------------------------ */}
      {/* METHODOLOGY                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="methodology-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <SectionHeading
          eyebrow="How we work"
          title="A method that leaves capability behind, not dependency."
          description="Every engagement moves through four deliberate phases. Value is tracked weekly against the original investment case — not discovered at the end."
          className="max-w-2xl"
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {METHODOLOGY.map((m, i) => (
            <Reveal key={m.step} delay={i * 0.06}>
              <div className="relative h-full rounded-xl border border-border/70 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <Icon name={m.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {m.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CASE STUDIES                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="case-studies-heading"
        className="border-y border-border/60 bg-secondary/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Selected work"
              title="Outcomes, not decks."
              description="A few recent engagements where the work outlived the project."
              className="max-w-2xl"
            />
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {CASE_STUDIES.slice(0, 3).map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.07}>
                <button
                  onClick={() => navigate("work")}
                  className="group block h-full w-full text-left"
                >
                  <Card className="flex h-full flex-col rounded-xl border-border/70 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="rounded-full border-border/70 text-xs font-medium"
                      >
                        {c.sector}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {c.client}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight">
                      {c.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {c.summary}
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/70 pt-5">
                      <div>
                        <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Result
                        </div>
                        <div className="mt-1 text-sm font-semibold text-foreground">
                          {c.result}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Impact
                        </div>
                        <div className="mt-1 text-base font-semibold text-primary">
                          {c.metric}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {c.metricLabel}
                        </div>
                      </div>
                    </div>
                  </Card>
                </button>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("work")}
              className="gap-1.5 rounded-full"
            >
              View all engagements
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* TESTIMONIALS                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="testimonials-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <SectionHeading
          eyebrow="In their words"
          title="What clients say after the project closes."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.07}>
              <figure className="flex h-full flex-col rounded-xl border border-border/70 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                <Quote className="h-7 w-7 text-primary/40" aria-hidden />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-border/70 pt-4">
                  <div className="text-sm font-semibold">{t.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.title}, {t.company}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* LEADERSHIP PREVIEW                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="leadership-heading"
        className="border-t border-border/60 bg-secondary/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Leadership"
              title="Senior practitioners, not a roster of names."
              description="The partners who lead our work have run the operations, built the platforms, and stood in front of the boards they now advise."
              className="max-w-2xl"
            />
            <Reveal delay={0.1}>
              <Button
                variant="ghost"
                onClick={() => navigate("about")}
                className="gap-2 text-primary hover:text-primary"
              >
                Meet the team
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.slice(0, 4).map((p, i) => (
              <Reveal key={p.name} delay={i * 0.05}>
                <button
                  onClick={() => navigate("about")}
                  className="group flex h-full w-full flex-col items-start rounded-xl border border-border/70 bg-card p-6 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20">
                    {p.initials}
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight">
                    {p.name}
                  </h3>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary/80">
                    {p.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.bio}
                  </p>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FINAL CTA                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="cta-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-8 sm:p-12 md:p-16">
            <div className="absolute inset-0 -z-10 bg-radial-fade opacity-80" aria-hidden />
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <Eyebrow>Find your next standard</Eyebrow>
                <h2
                  id="cta-heading"
                  className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
                >
                  Ready to find your next standard?
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-balance">
                  Start with the free benchmark, or talk to us about an
                  engagement. Either way, you&apos;ll leave the conversation
                  with a clearer view of where to play next.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Button
                  size="lg"
                  onClick={() => navigate("benchmark-landing")}
                  className="h-11 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Take the benchmark
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("contact")}
                  className="h-11 gap-2 rounded-full border-border/70 px-6 hover:bg-accent hover:text-accent-foreground"
                >
                  Talk to us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
