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
import { DIMENSIONS, TIER_META } from "@/lib/content";
import type { MaturityTier } from "@/lib/types";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@/components/site/icon";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const TIER_LABELS: Record<MaturityTier, { en: string; ar: string }> = {
  initial: { en: "Initial", ar: "أولي" },
  developing: { en: "Developing", ar: "نامٍ" },
  defined: { en: "Defined", ar: "محدد" },
  established: { en: "Established", ar: "راسخ" },
  advanced: { en: "Advanced", ar: "متقدم" },
};

export function BenchmarkLandingView() {
  const { t, isRTL } = useTranslation();
  const navigate = useNav((s) => s.navigate);
  const startAssessment = useNav((s) => s.startAssessment);
  const result = useNav((s) => s.result);

  const handleStart = () => {
    startAssessment();
    navigate("benchmark-quiz");
  };

  const outcomesIcons = [Compass, BarChart3, Users, FileText, CheckCircle2];
  const outcomesItems = (t("benchmark_landing.outcomes.items", { returnObjects: true }) as Array<{ title: string; description: string }>) || [];
  const stepsItems = (t("benchmark_landing.steps.items", { returnObjects: true }) as Array<{ n: string; title: string; description: string }>) || [];
  const faqItems = (t("benchmark_landing.faq.items", { returnObjects: true }) as Array<{ q: string; a: string }>) || [];

  return (
    <div className="relative" >
      {/* HERO ---------------------------------------------------------- */}
      < section className="relative overflow-hidden" >
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-60" />
        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
          <Reveal>
            <Eyebrow>{t("benchmark_landing.hero.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1
              className={cn(
                "mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl",
                isRTL ? "leading-[1.28] md:leading-[1.18]" : "md:leading-[1.05]"
              )}
            >
              {t("benchmark_landing.hero.title_part1")}{" "}
              <span className="text-primary">{t("benchmark_landing.hero.title_highlight")}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
              {t("benchmark_landing.hero.description")}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={handleStart}
                className="h-12 gap-2 rounded-full px-7 text-base shadow-sm"
              >
                {t("benchmark_landing.hero.start_button")}
                <ArrowRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("contact")}
                className="h-12 gap-2 rounded-full px-7 text-base"
              >
                {t("benchmark_landing.hero.talk_button")}
              </Button>
              {result && (
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => navigate("benchmark-results")}
                  className="h-12 gap-2 rounded-full px-5 text-base"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t("benchmark_landing.hero.last_result_button")}
                </Button>
              )}
            </div>
          </Reveal>

        </div>
      </section >

      {/* FIVE DIMENSIONS AT A GLANCE ---------------------------------- */}
      < section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" >
        <div className="grid gap-3 sm:grid-cols-5">
          {DIMENSIONS.map((d, i) => (
            <Reveal key={d.key} delay={0.15 + i * 0.05}>
              <button
                onClick={() => navigate("benchmark-quiz")}
                className="group flex h-full w-full flex-col gap-2 rounded-xl border border-border/80 bg-card/60 px-4 py-5 text-left rtl:text-right shadow-2xs backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-medium tracking-widest text-primary/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <DimensionGlyph name={d.icon} />
                </div>
                <span className="text-[13px] font-semibold tracking-tight text-foreground">
                  {t(`benchmark_landing.dimensions.items.${d.key}.short`)}
                </span>
                <span className="text-[11px] leading-snug text-muted-foreground group-hover:text-primary/80 transition-colors">
                  {t(`benchmark_landing.dimensions.items.${d.key}.label`)}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section >

      {/* WHAT YOU'LL GET ---------------------------------------------- */}
      < section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28" >
        <Reveal>
          <SectionHeading
            eyebrow={t("benchmark_landing.outcomes.eyebrow")}
            title={t("benchmark_landing.outcomes.title")}
            description={t("benchmark_landing.outcomes.description")}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {outcomesItems.map((o, i) => {
            const IconComp = outcomesIcons[i] || Compass;
            return (
              <Reveal key={i} delay={i * 0.05}>
                <Card className="h-full gap-4 py-6 transition-shadow hover:shadow-md">
                  <CardHeader className="px-6">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <IconComp className="h-5 w-5" strokeWidth={1.75} />
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
            );
          })}
        </div>
      </section >

      {/* THE FIVE DIMENSIONS ------------------------------------------ */}
      < section className="border-y border-border/70 bg-secondary/30" >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <SectionHeading
              eyebrow={t("benchmark_landing.dimensions.eyebrow")}
              title={t("benchmark_landing.dimensions.title")}
              description={t("benchmark_landing.dimensions.description")}
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
                        {String(i + 1).padStart(2, "0")} · {t(`benchmark_landing.dimensions.items.${d.key}.short`)}
                      </Badge>
                    </div>
                    <CardTitle className="mt-1 text-lg">
                      {t(`benchmark_landing.dimensions.items.${d.key}.label`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(`benchmark_landing.dimensions.items.${d.key}.description`)}
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
                    {t("benchmark_landing.dimensions.extra_card")}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section >

      {/* HOW IT WORKS -------------------------------------------------- */}
      < section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28" >
        <Reveal>
          <SectionHeading
            eyebrow={t("benchmark_landing.steps.eyebrow")}
            title={t("benchmark_landing.steps.title")}
          />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {stepsItems.map((s, i) => (
            <div
              key={i}
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
      </section >

      {/* METHODOLOGY -------------------------------------------------- */}
      < section className="border-y border-border/70 bg-secondary/30" >
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <Eyebrow>{t("benchmark_landing.methodology.eyebrow")}</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("benchmark_landing.methodology.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                {t("benchmark_landing.methodology.p1")}
              </p>
              <p>
                {t("benchmark_landing.methodology.p2")}
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                {(Object.keys(TIER_META) as MaturityTier[]).map((tierKey) => (
                  <div
                    key={tierKey}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: TIER_META[tierKey].color }}
                      />
                      <span className="text-sm font-semibold">
                        {TIER_LABELS[tierKey][isRTL ? "ar" : "en"]}
                      </span>
                    </div>
                    <p className="mt-1.5 font-mono text-xs text-muted-foreground">
                      {TIER_META[tierKey].range}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-8 flex items-start gap-2 rounded-lg border border-border bg-card p-4 text-sm">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                <span>
                  {t("benchmark_landing.methodology.privacy")}{" "}
                  <span className="font-medium text-foreground dir-ltr inline-block">
                    info@trennt.sa
                  </span>
                  .
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </section >

      {/* FAQ ---------------------------------------------------------- */}
      < section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28" >
        <Reveal>
          <SectionHeading
            eyebrow={t("benchmark_landing.faq.eyebrow")}
            title={t("benchmark_landing.faq.title")}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Accordion type="single" collapsible className="mt-10 w-full">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left rtl:text-right text-base font-medium">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section >

      {/* FINAL CTA ---------------------------------------------------- */}
      < section className="border-t border-border/70 bg-secondary/30" >
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
                <Eyebrow className="justify-center">{t("benchmark_landing.cta.eyebrow")}</Eyebrow>
                <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                  {t("benchmark_landing.cta.title")}
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground">
                  {t("benchmark_landing.cta.description")}
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={handleStart}
                    className="h-12 gap-2 rounded-full px-8 text-base shadow-sm"
                  >
                    {t("benchmark_landing.hero.start_button")}
                    <ArrowUpRight className={cn("h-4 w-4", isRTL && "rotate-[-90deg]")} />
                  </Button>
                  {result && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("benchmark-results")}
                      className="h-12 gap-2 rounded-full px-6 text-base"
                    >
                      {t("benchmark_landing.cta.review_last")}
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

function DimensionGlyph({ name }: { name: string }) {
  return <Icon name={name} className="h-5 w-5" />;
}
