"use client";

import * as React from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useNav } from "@/lib/store";
import { METHODOLOGY, SERVICES } from "@/lib/content";
import { Icon } from "@/components/site/icon";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ENGAGEMENT_MODEL = [
  {
    label: "Diagnosis",
    duration: "2 – 6 weeks",
    detail:
      "A focused diagnostic that surfaces the constraints that actually matter, the value at stake, and the risks worth taking.",
  },
  {
    label: "Design",
    duration: "2 – 8 weeks",
    detail:
      "Target-state design, co-created with your people. Investment case, roadmap, and the decision gates between phases.",
  },
  {
    label: "Delivery",
    duration: "3 – 18 months",
    detail:
      "Small, embedded pods — typically 2–6 Trennt people plus client team members — shipping in weekly increments.",
  },
  {
    label: "Embed",
    duration: "Ongoing",
    detail:
      "Hand-over to your operating teams with playbooks, metrics, and a sustained-improvement system that runs without us.",
  },
];

export function ServicesView() {
  const navigate = useNav((s) => s.navigate);
  const [activeSlug, setActiveSlug] = React.useState<string>(SERVICES[0]?.slug ?? "");

  // Scroll-spy: track which service card is in view
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const slug = entry.target.id.replace("service-", "");
            setActiveSlug(slug);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    SERVICES.forEach((s) => {
      const el = document.getElementById(`service-${s.slug}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (slug: string) => {
    const el = document.getElementById(`service-${slug}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="services-hero-heading"
        className="relative overflow-hidden border-b border-border/60"
      >
        <div className="absolute inset-0 bg-radial-fade" aria-hidden />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Services</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1
                id="services-hero-heading"
                className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.02]"
              >
                Six practices that, together, run a transformation end to end.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
                Strategy without delivery is theatre. Delivery without strategy
                is busywork. We bring both under one operating model, so the
                diagnosis sets the direction and the direction is what gets
                built.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* STICKY QUICK-NAV WITH SCROLL-SPY                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Services quick navigation"
            className="flex gap-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {SERVICES.map((s, i) => {
              const active = activeSlug === s.slug;
              return (
                <button
                  key={s.slug}
                  onClick={() => handleNavClick(s.slug)}
                  className={cn(
                    "group inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] transition-colors",
                      active ? "text-primary-foreground/70" : "text-muted-foreground/60"
                    )}
                  >
                    0{i + 1}
                  </span>
                  {s.title}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SERVICES LIST                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="services-list-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <h2 id="services-list-heading" className="sr-only">
          All services
        </h2>
        <div className="space-y-8">
          {SERVICES.map((s, i) => {
            const reversed = i % 2 === 1;
            const active = activeSlug === s.slug;
            return (
              <Reveal key={s.slug} delay={0.05}>
                <Card
                  id={`service-${s.slug}`}
                  className={cn(
                    "scroll-mt-24 overflow-hidden rounded-2xl border-border/70 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5",
                    active && "border-primary/40 ring-1 ring-primary/20"
                  )}
                >
                  <div
                    className={
                      "grid gap-0 lg:grid-cols-12 " +
                      (reversed ? "lg:[direction:rtl]" : "")
                    }
                  >
                    {/* left: header */}
                    <div className="border-b border-border/70 p-8 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-10 [direction:ltr]">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/8 text-primary">
                          <Icon name={s.icon} className="h-6 w-6" />
                        </span>
                        <Badge
                          variant="outline"
                          className="rounded-full border-border/70 font-mono text-[10px] uppercase tracking-[0.15em]"
                        >
                          0{i + 1}
                        </Badge>
                      </div>
                      <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-sm font-medium text-primary">
                        {s.tagline}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {s.description}
                      </p>
                      <div className="mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("contact")}
                          className="gap-2 rounded-full"
                        >
                          Discuss this engagement
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* right: outcomes + deliverables */}
                    <div className="grid gap-8 p-8 sm:grid-cols-2 lg:col-span-7 lg:p-10 [direction:ltr]">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
                          Outcomes
                        </div>
                        <ul className="mt-4 space-y-3">
                          {s.outcomes.map((o) => (
                            <li
                              key={o}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90"
                            >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span>{o}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          Deliverables
                        </div>
                        <ul className="mt-4 space-y-3">
                          {s.deliverables.map((d) => (
                            <li
                              key={d}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                            >
                              <span
                                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/50"
                                aria-hidden
                              />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* METHODOLOGY BAND                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="methodology-heading"
        className="border-y border-border/60 bg-secondary/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading
            eyebrow="How we work"
            title="Diagnose, design, deliver, embed."
            description="Every engagement moves through the same four phases. Value is tracked weekly against the original investment case — not discovered at the end."
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
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ENGAGEMENT MODEL                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="engagement-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <SectionHeading
          eyebrow="Engagement model"
          title="What an engagement actually looks like."
          description="Practical expectations on duration, team size, and how the work is run — so you can plan around it."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ENGAGEMENT_MODEL.map((e, i) => (
            <Reveal key={e.label} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-xl border border-border/70 bg-card p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-base font-semibold tracking-tight">
                    {e.label}
                  </h3>
                  <span className="font-mono text-xs text-primary">
                    {e.duration}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {e.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 grid gap-4 rounded-2xl border border-border/70 bg-secondary/40 p-6 sm:grid-cols-3 sm:p-8">
            {[
              {
                label: "Team size",
                value: "2 – 8",
                sub: "Trennt practitioners, plus client team members embedded in pods.",
              },
              {
                label: "Governance",
                value: "Weekly",
                sub: "Steering committee reviews value tracking dashboard against investment case.",
              },
              {
                label: "Engagement length",
                value: "6 wks – 18 mo",
                sub: "From focused diagnostic to multi-phase transformation programmes.",
              },
            ].map((x) => (
              <div key={x.label}>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {x.label}
                </div>
                <div className="mt-1 text-2xl font-semibold tabular-nums text-primary">
                  {x.value}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {x.sub}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="services-cta-heading"
        className="border-t border-border/60 bg-secondary/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-8 sm:p-12 md:p-16">
              <div
                className="absolute inset-0 -z-10 bg-radial-fade opacity-80"
                aria-hidden
              />
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <Eyebrow>Start a conversation</Eyebrow>
                  <h2
                    id="services-cta-heading"
                    className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
                  >
                    Tell us where you want to be in twelve months.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-balance">
                    The first conversation is always free. We&apos;ll pressure
                    test the brief, suggest where to start, and tell you if
                    we&apos;re not the right fit.
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
        </div>
      </section>
    </div>
  );
}
