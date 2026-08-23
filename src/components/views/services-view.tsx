"use client";

import * as React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Handshake,
  Users,
  Building2,
  RefreshCcw,
  ShieldCheck,
  MessageSquare,
  Target,
  FileText,
  CheckSquare,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { useNav } from "@/lib/store";
import { METHODOLOGY, SERVICES } from "@/lib/content";
import type { ViewKey } from "@/lib/types";
import { Icon } from "@/components/site/icon";
import {
  Reveal,
  Eyebrow,
  SectionHeading,
  RevealStagger,
  useReducedMotion,
} from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const TAB_LAYOUT_TRANSITION = {
  type: "spring" as const,
  stiffness: 400,
  damping: 36,
  mass: 0.8,
};

const TAB_EASE = [0.16, 1, 0.3, 1] as const;

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: TAB_EASE },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: TAB_EASE },
  },
};

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "internal-audit-outsourcing": Handshake,
  "internal-audit-co-sourcing": Users,
  "internal-audit-function-establishment": Building2,
  "internal-audit-transformation": RefreshCcw,
  "quality-assurance-and-improvement-program": ShieldCheck,
};

const PROCESS_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "01": MessageSquare,
  "02": Target,
  "03": FileText,
  "04": CheckSquare,
};

function getCategoryInfo(slug: string, t: (k: string) => string) {
  if (slug === "internal-audit-outsourcing" || slug === "internal-audit-co-sourcing") {
    return { label: t("services.tabs.core"), isCore: true };
  }
  return { label: t("services.tabs.development"), isCore: false };
}

export function ServicesView() {
  const { t, l, isRTL } = useTranslation();
  const navigate = useNav((s) => s.navigate);
  const [activeSlug, setActiveSlug] = React.useState<string>(
    SERVICES[0]?.slug ?? ""
  );
  const reduced = useReducedMotion();
  const tabContentRef = React.useRef<HTMLDivElement>(null);

  const activeIdx = SERVICES.findIndex((s) => s.slug === activeSlug);
  const activeService = SERVICES[activeIdx] ?? SERVICES[0];

  const handleNavClick = (slug: string) => {
    setActiveSlug(slug);
    if (tabContentRef.current) {
      tabContentRef.current.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
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
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-grid mask-fade-b opacity-50 pointer-events-none"
          initial={false}
          animate={
            reduced
              ? {}
              : { x: [0, 6, 0], y: [0, -5, 0] }
          }
          transition={{
            duration: 26,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
          <div className="max-w-4xl">
            <Reveal>
              <Eyebrow>{t("services.hero.eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1
                id="services-hero-heading"
                className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.02] text-[#121212]"
              >
                {t("services.hero.heading")}{" "}
                <span className="bg-gradient-to-r from-[#003D3C] via-[#005B58] to-[#003D3C] bg-clip-text text-transparent">
                  {t("services.hero.heading_accent")}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
                {t("services.hero.description")}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 text-[15px] font-semibold text-[#003D3C]">
                {t("services.hero.highlight")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>
      {/* ------------------------------------------------------------------ */}
      {/* STICKY TAB SELECTOR WITH LAYOUT-ID INDICATOR                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="sticky top-[88px] z-30 border-b border-gray-200/80 bg-white/90 backdrop-blur-md shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal y={8} duration={0.45} delay={0.02}>
            <nav
              aria-label="Services quick navigation"
              className="flex gap-2 overflow-x-auto py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {SERVICES.map((s, i) => {
                const active = activeSlug === s.slug;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => handleNavClick(s.slug)}
                    className={cn(
                      "group relative inline-flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 select-none border",
                      active
                        ? "text-white border-[#003D3C] shadow-sm"
                        : "text-gray-700 hover:text-[#003D3C] bg-gray-50/80 hover:bg-[#EEF4F2] border-gray-200/70"
                    )}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {active && (
                      <motion.span
                        layoutId={reduced ? undefined : "active-service-tab"}
                        transition={
                          reduced
                            ? { duration: 0 }
                            : TAB_LAYOUT_TRANSITION
                        }
                        className="absolute inset-0 z-0 rounded-full bg-[#003D3C]"
                        aria-hidden
                      />
                    )}
                    <span
                      className={cn(
                        "relative z-10 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-200",
                        active
                          ? "bg-[#ADDFB3] text-[#003D3C]"
                          : "bg-white text-[#003D3C]/70 border border-gray-200 group-hover:border-[#003D3C]/20"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative z-10 tracking-tight">
                      {l(s.title)}
                    </span>
                  </button>
                );
              })}
            </nav>
          </Reveal>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ACTIVE SERVICE DETAIL (TAB CONTENT)                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        ref={tabContentRef}
        aria-labelledby="services-list-heading"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <h2 id="services-list-heading" className="sr-only">
          {t("services.full_list.eyebrow")}
        </h2>
        <Reveal y={10} duration={0.5}>
          <AnimatePresence mode="wait">
            {activeService && (() => {
              const IconCmp = SERVICE_ICONS[activeService.slug];
              const category = getCategoryInfo(activeService.slug, t);
              return (
                <motion.div
                  key={activeService.slug}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{
                    duration: reduced ? 0 : 0.38,
                    ease: TAB_EASE,
                  }}
                >
                  <Card
                    id={`service-${activeService.slug}`}
                    className="overflow-hidden rounded-2xl border-2 border-[#003D3C]/15 border-l-4 border-l-[#003D3C] rtl:border-l-2 rtl:border-r-4 rtl:border-r-[#003D3C] bg-[#FAFBFA] shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-[#003D3C]/5"
                  >
                    <div className="grid gap-0 lg:grid-cols-12">
                      {/* left: header */}
                      <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="show"
                        className="border-b border-gray-200/80 p-8 lg:col-span-5 lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l lg:p-10"
                      >
                        <motion.div variants={headerItemVariants}>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4F2] text-[#003D3C] border border-[#003D3C]/10 shadow-2xs">
                              {IconCmp ? (
                                <IconCmp className="h-5 w-5 stroke-[1.75]" />
                              ) : (
                                <Icon name={activeService.icon} className="h-5 w-5" />
                              )}
                            </span>
                            <span className="font-mono text-xs font-semibold text-[#003D3C]/70 bg-white border border-[#003D3C]/10 px-2.5 py-0.5 rounded-full">
                              {String(activeIdx + 1).padStart(2, "0")}
                            </span>
                            <Badge
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border-0 shadow-2xs",
                                category.isCore
                                  ? "bg-[#003D3C] text-white"
                                  : "bg-[#ADDFB3] text-[#003D3C]"
                              )}
                            >
                              {category.label}
                            </Badge>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF4F2] text-[#013D3E] border border-[#013D3E]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider font-mono">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#013D3E]" />
                              {t("services.common.viewing")}
                            </span>
                          </div>
                        </motion.div>
                        <motion.div variants={headerItemVariants}>
                          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[#121212]">
                            {l(activeService.title)}
                          </h3>
                        </motion.div>
                        <motion.div variants={headerItemVariants}>
                          <p className="mt-2 text-sm font-semibold text-[#003D3C]">
                            {l(activeService.tagline)}
                          </p>
                        </motion.div>
                        <motion.div variants={headerItemVariants}>
                          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            {l(activeService.description)}
                          </p>
                        </motion.div>
                        <motion.div variants={headerItemVariants}>
                          <div className="mt-8">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(activeService.slug as ViewKey)}
                              className="gap-2 rounded-full border-gray-300 bg-white text-[#003D3C] font-semibold transition-all duration-200 ease-out hover:bg-[#EEF4F2] hover:border-[#003D3C]/30 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              {t("services.common.learn_more")}
                              <ArrowRight className={cn("h-3.5 w-3.5", isRTL && "rotate-180")} />
                            </Button>
                          </div>
                        </motion.div>
                      </motion.div>

                      {/* right: outcomes + deliverables */}
                      <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="show"
                        className="grid gap-8 p-8 sm:grid-cols-2 lg:col-span-7 lg:p-10"
                      >
                        <div className="pr-2 rtl:pr-0 rtl:pl-2">
                          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003D3C]/90">
                            {t('services.sections.outcomes')}
                          </div>
                          <ul className="mt-4 space-y-3">
                            {activeService.outcomes.map((o, i) => (
                              <motion.li
                                key={i}
                                variants={itemVariants}
                                className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90 font-medium"
                              >
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#003D3C]" />
                                <span>{l(o)}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-t pt-6 sm:border-t-0 sm:border-l sm:border-gray-200/80 sm:pl-8 sm:pt-0 rtl:sm:border-l-0 rtl:sm:border-r rtl:sm:pl-0 rtl:sm:pr-8">
                          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            {t('services.sections.deliverables')}
                          </div>
                          <ul className="mt-4 space-y-3">
                            {activeService.deliverables.map((d, i) => (
                              <motion.li
                                key={i}
                                variants={itemVariants}
                                className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                              >
                                <span
                                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#003D3C]/60"
                                  aria-hidden
                                />
                                <span>{l(d)}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </Reveal>

        {/* ------------------------------------------------------------------ */}
        {/* FULL SERVICES LIST (ALL 5 CARDS)                                    */}
        {/* ------------------------------------------------------------------ */}
        <Reveal y={12} duration={0.55} delay={0.08} className="mt-20">
          <SectionHeading
            eyebrow={t("services.full_list.eyebrow")}
            title={t("services.full_list.title")}
            description={t("services.full_list.description")}
            className="max-w-2xl"
          />
        </Reveal>

        <div className="mt-14 space-y-8">
          {SERVICES.map((s, i) => {
            const IconCmp = SERVICE_ICONS[s.slug];
            const category = getCategoryInfo(s.slug, t);

            return (
              <Reveal key={s.slug} delay={0.04 + i * 0.04}>
                <Card
                  className={cn(
                    "scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-all duration-300 hover:border-[#003D3C]/30 hover:shadow-lg hover:shadow-[#003D3C]/5 hover:-translate-y-1"
                  )}
                >
                  <div className="grid gap-0 lg:grid-cols-12">
                    <div className="border-b border-gray-200/80 p-8 lg:col-span-5 lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l lg:p-10">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4F2] text-[#003D3C] border border-[#003D3C]/10 shadow-2xs">
                          {IconCmp ? (
                            <IconCmp className="h-5 w-5 stroke-[1.75]" />
                          ) : (
                            <Icon name={s.icon} className="h-5 w-5" />
                          )}
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#003D3C]/70 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-full">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Badge
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border-0 shadow-2xs",
                            category.isCore
                              ? "bg-[#003D3C] text-white"
                              : "bg-[#ADDFB3] text-[#003D3C]"
                          )}
                        >
                          {category.label}
                        </Badge>
                      </div>
                      <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[#121212]">
                        {l(s.title)}
                      </h3>
                      <p className="mt-2 text-sm font-semibold text-[#003D3C]">
                        {l(s.tagline)}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {l(s.description)}
                      </p>
                      <div className="mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavClick(s.slug)}
                          className="gap-2 rounded-full border-gray-300 bg-white text-[#003D3C] font-semibold transition-all duration-200 ease-out hover:bg-[#EEF4F2] hover:border-[#003D3C]/30 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {t("services.common.jump_to_overview")}
                          <ArrowRight className={cn("h-3.5 w-3.5", isRTL && "rotate-180")} />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-8 p-8 sm:grid-cols-2 lg:col-span-7 lg:p-10">
                      <RevealStagger stagger={0.08} y={8} childDuration={0.45}>
                        <div className="pr-2 rtl:pr-0 rtl:pl-2">
                          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003D3C]/90">
                            {t('services.sections.outcomes')}
                          </div>
                          <ul className="mt-4 space-y-3">
                            {s.outcomes.map((o, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90 font-medium"
                              >
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#003D3C]" />
                                <span>{l(o)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </RevealStagger>
                      <RevealStagger stagger={0.08} y={8} childDuration={0.45} delay={0.05}>
                        <div className="border-t pt-6 sm:border-t-0 sm:border-l sm:border-gray-200/80 sm:pl-8 sm:pt-0 rtl:sm:border-l-0 rtl:sm:border-r rtl:sm:pl-0 rtl:sm:pr-8">
                          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            {t('services.sections.deliverables')}
                          </div>
                          <ul className="mt-4 space-y-3">
                            {s.deliverables.map((d, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                              >
                                <span
                                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#003D3C]/60"
                                  aria-hidden
                                />
                                <span>{l(d)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </RevealStagger>
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ENGAGEMENT PROCESS                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="engagement-process-heading"
        className="border-y border-gray-200/80 bg-[#F8F9FA]"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading
            eyebrow={t("services.process.eyebrow")}
            title={t("services.process.heading")}
            description={t("services.process.description")}
            className="max-w-2xl"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {METHODOLOGY.map((m, i) => {
              const ProcessIconCmp = PROCESS_ICONS[m.step];
              return (
                <Reveal key={m.step} delay={i * 0.06}>
                  <div className="group relative flex flex-col justify-between h-full rounded-2xl border border-gray-200/80 bg-white p-7 shadow-xs transition-all duration-300 hover:border-[#003D3C]/30 hover:shadow-md hover:-translate-y-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4F2] text-[#003D3C] border border-[#003D3C]/10 shadow-2xs">
                          {ProcessIconCmp ? (
                            <ProcessIconCmp className="h-5 w-5 stroke-[1.75]" />
                          ) : (
                            <Icon name={m.icon} className="h-5 w-5" />
                          )}
                        </span>
                        <span className="font-mono text-3xl font-extralight tracking-tight text-[#003D3C]/30 group-hover:text-[#003D3C]/60 transition-colors duration-300">
                          {m.step}
                        </span>
                      </div>
                      <h3 className="mt-6 text-lg font-semibold tracking-tight text-[#121212]">
                        {l(m.title)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {l(m.description)}
                      </p>
                    </div>
                    <div className="mt-6 h-1 w-full rounded-full bg-gray-100 group-hover:bg-[#003D3C] transition-colors duration-300" aria-hidden />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="services-cta-heading"
        className="bg-[#F8F9FA] pb-20 pt-8 sm:pb-24 lg:pb-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#003D3C] p-8 sm:p-12 md:p-16 shadow-2xl text-white">
              <div
                className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-[#ADDFB3]/10 blur-3xl pointer-events-none"
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-grid mask-fade-b opacity-25 pointer-events-none"
                aria-hidden
              />
              <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ADDFB3]">
                    {t("services.cta.eyebrow")}
                  </span>
                  <h2
                    id="services-cta-heading"
                    className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl text-white"
                  >
                    {t("services.cta.title")}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 text-balance">
                    {t("services.cta.description")}
                  </p>
                </div>
                <div className="flex flex-col gap-3.5 sm:flex-row lg:justify-end">
                  <Button
                    size="lg"
                    onClick={() => navigate("framework-agreements")}
                    className="h-12 gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-[#003D3C] shadow-sm transition-all duration-200 ease-out hover:bg-[#ADDFB3] hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t("services.framework.eyebrow")}
                    <ArrowRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
                  </Button>
                  <button
                    type="button"
                    onClick={() => navigate("contact")}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-7 text-[15px] font-semibold text-white transition-all duration-200 ease-out hover:bg-white/10 hover:border-white/50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t("services.cta.button")}
                    <ArrowUpRight className={cn("h-4 w-4", isRTL && "rotate-[-90deg]")} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
