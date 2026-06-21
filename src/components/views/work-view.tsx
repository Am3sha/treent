"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  Quote,
  Target,
  Wrench,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useNav } from "@/lib/store";
import { CASE_STUDIES } from "@/lib/content";
import type { CaseStudy } from "@/lib/types";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Icon } from "@/components/site/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SECTORS = ["All", ...Array.from(new Set(CASE_STUDIES.map((c) => c.sector)))];

export function WorkView() {
  const navigate = useNav((s) => s.navigate);
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);
  const [sector, setSector] = React.useState("All");

  // Sub-path routing: #/work/<slug>
  React.useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      const parts = hash.split("/");
      if (parts[0] === "work" && parts[1]) {
        const found = CASE_STUDIES.find((c) => c.slug === parts[1]);
        if (found) {
          setActiveSlug(found.slug);
          return;
        }
      }
      setActiveSlug(null);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const activeStudy = React.useMemo(
    () => CASE_STUDIES.find((c) => c.slug === activeSlug) ?? null,
    [activeSlug]
  );

  const filtered = React.useMemo(() => {
    return sector === "All"
      ? CASE_STUDIES
      : CASE_STUDIES.filter((c) => c.sector === sector);
  }, [sector]);

  const openStudy = (slug: string) => {
    window.location.hash = `/work/${slug}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToList = () => {
    window.location.hash = "/work";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (activeStudy) {
    return (
      <CaseStudyReader
        study={activeStudy}
        onBack={backToList}
        onNavigate={openStudy}
      />
    );
  }

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-secondary/30">
        <div className="absolute inset-0 bg-radial-fade opacity-70" />
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <Reveal>
            <Eyebrow>Our Work · Selected engagements</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.02]">
              Engagements where the work{" "}
              <span className="text-primary">outlived the project.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              A selection of recent work where we left behind capability, not
              dependency. Each engagement is real, measured, and still running
              today — long after our team stepped back.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Sector filter */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {SECTORS.map((s) => {
              const active = sector === s;
              return (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-all " +
                    (active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/70 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground")
                  }
                >
                  {s}
                </button>
              );
            })}
            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "engagement" : "engagements"}
            </span>
          </div>
        </div>
      </section>

      {/* Featured case study */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <Reveal>
            <button
              onClick={() => openStudy(featured.slug)}
              className="group block w-full text-left"
            >
              <Card className="overflow-hidden rounded-2xl border-border/70 transition-all hover:border-primary/30 hover:shadow-lg">
                <div className="grid gap-0 lg:grid-cols-[1.3fr_1fr]">
                  {/* Visual side */}
                  <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-secondary/40 p-10 md:p-14">
                    <div className="absolute inset-0 bg-grid opacity-30" />
                    <div className="absolute inset-0 bg-radial-fade opacity-60" />
                    <div className="relative flex flex-col items-center text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon name={featured.icon} className="h-10 w-10" />
                      </div>
                      <p className="mt-5 text-2xl font-semibold tracking-tight text-primary">
                        {featured.metric}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {featured.metricLabel}
                      </p>
                    </div>
                  </div>
                  {/* Content side */}
                  <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="rounded-full">
                        {featured.sector}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {featured.duration}
                      </span>
                    </div>
                    <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {featured.summary}
                    </p>
                    {/* Outcome chips */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {featured.outcomes.slice(0, 3).map((o) => (
                        <span
                          key={o.label}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/40 px-2.5 py-1 text-xs"
                        >
                          <span className="font-semibold text-foreground">
                            {o.value}
                          </span>
                          <span className="text-muted-foreground">{o.label}</span>
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {featured.client}
                      </span>
                      <span>·</span>
                      <span>{featured.services.join(", ")}</span>
                    </div>
                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Read the full case study
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          </Reveal>

          {/* Grid of remaining case studies */}
          {rest.length > 0 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((study, i) => (
                <Reveal key={study.slug} delay={Math.min(i * 0.05, 0.2)}>
                  <CaseStudyCard study={study} onOpen={() => openStudy(study.slug)} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-start gap-6 rounded-2xl border border-border/70 bg-background p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div>
                <h2 className="text-balance text-2xl font-semibold tracking-tight">
                  Could your organisation be the next case study?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start with the benchmark, or talk to us directly about where you
                  are and where you want to be.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate("benchmark-landing")}
                  className="gap-1.5 rounded-full"
                >
                  Take the benchmark
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => navigate("contact")}
                  variant="outline"
                  className="rounded-full"
                >
                  Talk to a partner
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Case study card
// ---------------------------------------------------------------------------

function CaseStudyCard({
  study,
  onOpen,
}: {
  study: CaseStudy;
  onOpen: () => void;
}) {
  return (
    <button onClick={onOpen} className="group block h-full w-full text-left">
      <Card className="flex h-full flex-col rounded-xl border-border/70 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="rounded-full">
            {study.sector}
          </Badge>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
            <Icon name={study.icon} className="h-4 w-4" />
          </span>
        </div>
        <h3 className="mt-4 text-balance text-lg font-semibold leading-snug tracking-tight">
          {study.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {study.summary}
        </p>
        <div className="mt-auto pt-5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold text-primary">
              {study.metric}
            </span>
            <span className="text-xs text-muted-foreground">
              {study.metricLabel}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {study.duration}
            <span>·</span>
            <span>{study.client}</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Read
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Card>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Case study reader
// ---------------------------------------------------------------------------

function CaseStudyReader({
  study,
  onBack,
  onNavigate,
}: {
  study: CaseStudy;
  onBack: () => void;
  onNavigate: (slug: string) => void;
}) {
  const navigate = useNav((s) => s.navigate);
  const related = React.useMemo(() => {
    return CASE_STUDIES.filter(
      (c) => c.slug !== study.slug && c.sector === study.sector
    )
      .concat(
        CASE_STUDIES.filter(
          (c) => c.slug !== study.slug && c.sector !== study.sector
        )
      )
      .slice(0, 3);
  }, [study]);

  return (
    <div className="bg-background">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All engagements
        </button>

        {/* Header */}
        <div className="mt-8 flex items-center gap-3">
          <Badge variant="outline" className="rounded-full">
            {study.sector}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {study.duration}
          </span>
        </div>

        <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-[2.75rem]">
          {study.title}
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {study.summary}
        </p>

        {/* Meta strip */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-border/60 py-4 text-sm">
          <span>
            <span className="text-muted-foreground">Client: </span>
            <span className="font-medium text-foreground">{study.client}</span>
          </span>
          <span>
            <span className="text-muted-foreground">Sector: </span>
            <span className="font-medium text-foreground">{study.sector}</span>
          </span>
          <span>
            <span className="text-muted-foreground">Duration: </span>
            <span className="font-medium text-foreground">{study.duration}</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {study.services.map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="rounded-full text-xs font-normal"
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>

        {/* Outcomes grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {study.outcomes.map((o) => (
            <div
              key={o.label}
              className="rounded-xl border border-border/70 bg-secondary/30 p-5 text-center"
            >
              <p className="text-2xl font-semibold tracking-tight text-primary">
                {o.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{o.label}</p>
            </div>
          ))}
        </div>

        {/* Challenge */}
        <section className="mt-12">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-semibold tracking-tight">
              The challenge
            </h2>
          </div>
          <ul className="mt-5 space-y-3">
            {study.challenge.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-base leading-relaxed text-foreground/90"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600/60" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Approach */}
        <section className="mt-10">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wrench className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-semibold tracking-tight">
              Our approach
            </h2>
          </div>
          <ol className="mt-5 space-y-4">
            {study.approach.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-base leading-relaxed text-foreground/90">
                  {item}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Results / quote */}
        {study.quote && (
          <section className="mt-12">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
              <Quote className="h-7 w-7 text-primary/50" />
              <p className="mt-3 text-lg font-medium italic leading-relaxed text-foreground">
                {study.quote.text}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                — {study.quote.author}, {study.quote.title}
              </p>
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <div className="mt-12 rounded-2xl border border-border/70 bg-secondary/30 p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Want results like these?
            </p>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Every engagement starts with a conversation. Tell us where you are and
            where you want to be.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              onClick={() => navigate("contact")}
              size="sm"
              className="gap-1.5 rounded-full"
            >
              Talk to a partner
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => navigate("benchmark-landing")}
              size="sm"
              variant="outline"
              className="rounded-full"
            >
              Take the benchmark
            </Button>
          </div>
        </div>
      </article>

      {/* Related case studies */}
      {related.length > 0 && (
        <section className="border-t border-border/60 bg-secondary/20">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
            <SectionHeading eyebrow="Keep reading" title="Related engagements" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <CaseStudyCard
                  key={s.slug}
                  study={s}
                  onOpen={() => onNavigate(s.slug)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
