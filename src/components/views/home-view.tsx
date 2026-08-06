"use client";

import * as React from "react";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import { useNav } from "@/lib/store";
import {
  COMPANY,
  METHODOLOGY,
  SERVICES,
  TESTIMONIALS,
  WHY_TRENNT,
} from "@/lib/content";
import { Icon } from "@/components/site/icon";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";



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
        <div className="absolute inset-0 bg-radial-fade" aria-hidden />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <Eyebrow>Exclusively internal audit</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  id="hero-heading"
                  className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.02]"
                >
                  Specialist internal audit services for
                  <span className="text-primary"> modern organizations.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance">
                  {COMPANY.description}
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    onClick={() => navigate("services")}
                    className="h-11 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-sm hover:bg-primary/90"
                  >
                    Explore services
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("contact")}
                    className="h-11 gap-2 rounded-full border-border/70 bg-background/60 backdrop-blur hover:bg-accent hover:text-accent-foreground"
                  >
                    Contact us
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={0.15}>
                <Card className="overflow-hidden rounded-2xl border-border/70 bg-card/95 p-6 shadow-sm backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Our services
                  </div>
                  <div className="mt-4 space-y-3">
                    {SERVICES.slice(0, 3).map((service, i) => (
                      <Reveal key={service.slug} delay={0.2 + i * 0.05}>
                        <button
                          onClick={() => navigate(service.slug as any)}
                          className="flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent"
                        >
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
                            <Icon name={service.icon} className="h-5 w-5" />
                          </span>
                          <div>
                            <div className="font-medium">{service.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {service.tagline}
                            </div>
                          </div>
                        </button>
                      </Reveal>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* WHY TRENNT                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <SectionHeading
                eyebrow="Why Trennt"
                title={WHY_TRENNT.title}
                description={WHY_TRENNT.description}
                className="max-w-md"
              />
            </Reveal>
            <div className="grid gap-6">
              {[
                {
                  title: "Independent and objective",
                  description:
                    "Our sole focus is internal audit, ensuring unbiased assessments and recommendations.",
                  icon: "ShieldCheck",
                },
                {
                  title: "Specialized expertise",
                  description:
                    "Deep knowledge of internal audit standards, governance, and risk management best practices.",
                  icon: "CheckCircle2",
                },
                {
                  title: "Tailored solutions",
                  description:
                    "Services customized to your organization's size, industry, and risk profile.",
                  icon: "Settings",
                },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <Card className="flex gap-4 p-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
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
            title="Comprehensive internal audit solutions."
            description="From outsourcing to transformation, we offer a full suite of services to strengthen your governance, risk management, and internal controls."
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
                onClick={() => navigate(s.slug as any)}
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
      {/* ENGAGEMENT PROCESS (METHODOLOGY)                                    */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="methodology-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <SectionHeading
          eyebrow="How we work"
          title="A structured, risk-based engagement process."
          description="Every engagement follows our proven four-step process, ensuring clarity, alignment, and measurable outcomes from start to finish."
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
      {/* TESTIMONIALS                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="testimonials-heading"
        className="border-y border-border/60 bg-secondary/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading
            eyebrow="In their words"
            title="What clients say about working with Trennt."
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
                <Eyebrow>Let's talk</Eyebrow>
                <h2
                  id="cta-heading"
                  className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
                >
                  Ready to strengthen your internal audit?
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-balance">
                  Whether you need outsourcing, co-sourcing, or support for your
                  existing function, we're here to help. Contact us to discuss
                  your needs.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Button
                  size="lg"
                  onClick={() => navigate("contact")}
                  className="h-11 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Contact us
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("about")}
                  className="h-11 gap-2 rounded-full border-border/70 hover:bg-accent hover:text-accent-foreground"
                >
                  Learn more
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
