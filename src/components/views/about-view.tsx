"use client";

import * as React from "react";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { useNav } from "@/lib/store";
import { COMPANY, LEADERSHIP, STATS } from "@/lib/content";
import { Icon } from "@/components/site/icon";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const VALUES = [
  {
    title: "Outcomes over outputs",
    description:
      "We measure ourselves by what changes in your business, not what we shipped. The investment case is the scorecard.",
    icon: "Target",
  },
  {
    title: "Independent always",
    description:
      "We take no commissions, no kickbacks, no vendor referrals. The advice is the product, and it's yours.",
    icon: "ShieldCheck",
  },
  {
    title: "Capability, not dependency",
    description:
      "We design our own exit from day one. The playbook, the metrics, and the team stay when we leave.",
    icon: "Infinite",
  },
  {
    title: "Evidence over opinion",
    description:
      "We start with data and pressure-test it. Strong opinions are welcome, but they are held weakly against the evidence.",
    icon: "Microscope",
  },
  {
    title: "Candour is kindness",
    description:
      "We will tell you what not to do. We will tell you when the strategy is wrong. Politely, and on the record.",
    icon: "MessagesSquare",
  },
  {
    title: "Long games, short cycles",
    description:
      "We work in weekly increments against multi-year horizons. Patience and urgency, held together.",
    icon: "Hourglass",
  },
];

export function AboutView() {
  const navigate = useNav((s) => s.navigate);

  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative overflow-hidden border-b border-border/60"
      >
        <div className="absolute inset-0 bg-radial-fade" aria-hidden />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal>
                <Eyebrow>About Meridian Advisory</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  id="about-hero-heading"
                  className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.02]"
                >
                  An independent firm for organisations that intend to{" "}
                  <span className="text-primary">outlast the cycle.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
                  {COMPANY.description}
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      Founded {COMPANY.foundedYear}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {COMPANY.offices.length} offices worldwide
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      140+
                    </span>{" "}
                    practitioners
                  </span>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-4">
              <Reveal delay={0.15}>
                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Headquarters
                  </div>
                  <div className="mt-2 text-base font-semibold">
                    {COMPANY.address}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        Email
                      </div>
                      <a
                        href={`mailto:${COMPANY.email}`}
                        className="text-foreground hover:text-primary"
                      >
                        {COMPANY.email}
                      </a>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        Phone
                      </div>
                      <a
                        href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                        className="text-foreground hover:text-primary"
                      >
                        {COMPANY.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* STORY / PURPOSE                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="story-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Why we exist"
              title="Built to give the advice, not to bill for it."
            />
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>
                  Meridian was founded in {COMPANY.foundedYear} by a group of
                  partners who had spent years inside the largest consultancies
                  and grown tired of the model: sprawling teams, generic
                  frameworks, and an incentive to extend the engagement. We
                  started Meridian to do the opposite.
                </p>
                <p>
                  We are deliberately independent. We take no commissions on
                  technology decisions, no referral fees from implementation
                  partners, and no equity in vendors we recommend. The advice is
                  the product, and it is yours. We staff small, senior teams —
                  the partners who sell the work are the partners who do the
                  work — and we measure ourselves by what changes in your
                  business after we leave.
                </p>
                <p>
                  Eleven years on, that stance has become the firm&apos;s
                  identity. We work with organisations across financial
                  services, industrials, health, and the public sector — board
                  rooms, executive teams, and the operators who actually run the
                  place. The thread is the same: clear diagnosis, co-designed
                  answers, and the discipline to make change stick.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* STATS BAND                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="about-stats-heading"
        className="border-y border-border/60 bg-secondary/40"
      >
        <h2 id="about-stats-heading" className="sr-only">
          Meridian by the numbers
        </h2>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <div className="flex flex-col">
                  <dd className="text-4xl font-semibold tabular-nums tracking-tight text-primary md:text-5xl">
                    {s.value}
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
      {/* LEADERSHIP                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="leadership-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <SectionHeading
          eyebrow="Leadership"
          title="The partners who do the work."
          description="Our partners carry their own workstreams, sit with client teams, and are accountable for outcomes — not presentations. They are the team you meet in the pitch and the team you work with for the duration."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LEADERSHIP.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.06}>
              <Card className="flex h-full flex-col rounded-xl border-border/70 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary ring-1 ring-inset ring-primary/20">
                    {p.initials}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {p.name}
                    </h3>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary/80">
                      {p.role}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {p.bio}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* OFFICES                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="offices-heading"
        className="border-t border-border/60 bg-secondary/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading
            eyebrow="Where we are"
            title="Four offices, one firm."
            description="A small, senior footprint across the world's principal financial and commercial centres — close to the work, close to the people who own it."
            className="max-w-2xl"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COMPANY.offices.map((o, i) => (
              <Reveal key={o.city} delay={i * 0.05}>
                <div className="flex h-full flex-col rounded-xl border border-border/70 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {o.flag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {o.city}
                  </h3>
                  <p className="text-sm text-muted-foreground">{o.country}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* VALUES                                                              */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="values-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <SectionHeading
          eyebrow="What we believe"
          title="Six principles we hold ourselves to."
          description="These are the rules of the firm. They are how we hire, how we behave on engagements, and how we decide what work to take."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={(i % 3) * 0.06}>
              <div className="flex h-full flex-col rounded-xl border border-border/70 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Icon name={v.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-tight">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="about-cta-heading"
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
                  <Eyebrow>Work with us</Eyebrow>
                  <h2
                    id="about-cta-heading"
                    className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
                  >
                    Let&apos;s talk about what you&apos;re trying to change.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-balance">
                    Whether you have a defined brief or a half-formed
                    hypothesis, we are happy to spend an hour on it — no decks,
                    no obligation.
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
