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
    title: "Independence and objectivity",
    description:
      "We maintain complete independence in all our work, ensuring unbiased assessments and recommendations that serve only your organization's best interests.",
    icon: "ShieldCheck",
  },
  {
    title: "Excellence in execution",
    description:
      "We adhere strictly to professional standards and best practices, delivering high-quality work that you can trust.",
    icon: "CheckCircle2",
  },
  {
    title: "Integrity and transparency",
    description:
      "We are honest, transparent, and ethical in all our interactions. We will tell you what you need to hear, not what you want to hear.",
    icon: "MessagesSquare",
  },
  {
    title: "Collaboration and partnership",
    description:
      "We work alongside your team as trusted partners, transferring knowledge and building capability throughout the engagement.",
    icon: "Users",
  },
  {
    title: "Continuous improvement",
    description:
      "We are committed to learning and improving, staying current with the latest standards and practices in internal audit.",
    icon: "RefreshCw",
  },
  {
    title: "Results-focused",
    description:
      "We measure our success by the tangible improvements in your governance, risk management, and internal control processes.",
    icon: "Target",
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
                <Eyebrow>About Trennt</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  id="about-hero-heading"
                  className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.02]"
                >
                  An internal audit firm dedicated exclusively to{" "}
                  <span className="text-primary">internal audit delivery.</span>
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
                    <MapPin className="h-4 w-4 text-primary" />
                    {COMPANY.address}
                  </span>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-4">
              <Reveal delay={0.15}>
                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Contact us
                  </div>
                  <div className="mt-4 grid gap-3 text-sm">
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
      {/* WHO WE ARE                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="who-we-are-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Who we are"
              title="Your trusted internal audit partner."
            />
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>
                  Trennt is an internal audit firm based in Saudi Arabia,
                  dedicated exclusively to internal audit delivery. We are not a
                  generalist consulting firm—our entire practice is focused on
                  providing world-class internal audit services.
                </p>
                <p>
                  We support Boards, Audit Committees, and senior management by
                  providing objective insight into the effectiveness of risk
                  management, internal controls, and governance processes. Our
                  team consists of experienced internal audit professionals with
                  deep industry and subject matter expertise.
                </p>
                <p>
                  Through structured, risk-based engagements, Trennt helps
                  organizations strengthen governance, enhance control
                  effectiveness, and support informed decision-making. We work
                  collaboratively with your team to deliver practical, actionable
                  insights that drive real improvement.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* VALUES                                                              */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="values-heading"
        className="border-y border-border/60 bg-secondary/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading
            eyebrow="What we believe"
            title="The principles that guide our work."
            description="These values define who we are, how we work, and what you can expect when you partner with Trennt."
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
          eyebrow="Our team"
          title="Experienced internal audit professionals."
          description="Our team brings deep expertise in internal audit, risk management, governance, and controls across a wide range of industries."
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
                  <Eyebrow>Let's work together</Eyebrow>
                  <h2
                    id="about-cta-heading"
                    className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
                  >
                    Ready to strengthen your internal audit function?
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-balance">
                    We'd welcome the opportunity to discuss your needs and how
                    we can help. Contact us to schedule an initial conversation.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
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
                    className="h-11 gap-2 rounded-full border-border/70 px-6 hover:bg-accent hover:text-accent-foreground"
                  >
                    Contact us
                    <ArrowUpRight className="h-4 w-4" />
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
