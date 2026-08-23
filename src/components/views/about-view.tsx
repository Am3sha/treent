"use client";

import * as React from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck, MessagesSquare, Users, RefreshCw, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useNav } from "@/lib/store";
import { COMPANY } from "@/lib/content";
import { Icon } from "@/components/site/icon";
import { Reveal, RevealStagger, Eyebrow, useReducedMotion } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function AboutView() {
  const { t, l, isRTL } = useTranslation();
  const navigate = useNav((s) => s.navigate);
  const reduced = useReducedMotion();

  const getValues = () => [
    {
      title: t("about.values.v1.title"),
      description: t("about.values.v1.description"),
      icon: "ShieldCheck",
    },
    {
      title: t("about.values.v2.title"),
      description: t("about.values.v2.description"),
      icon: "CheckCircle2",
    },
    {
      title: t("about.values.v3.title"),
      description: t("about.values.v3.description"),
      icon: "MessagesSquare",
    },
    {
      title: t("about.values.v4.title"),
      description: t("about.values.v4.description"),
      icon: "Users",
    },
    {
      title: t("about.values.v5.title"),
      description: t("about.values.v5.description"),
      icon: "RefreshCw",
    },
    {
      title: t("about.values.v6.title"),
      description: t("about.values.v6.description"),
      icon: "Target",
    },
  ];

  return (
    <div className={cn("flex flex-col", isRTL && "font-arabic")}>
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative overflow-hidden bg-[#003D3C] text-white py-16 lg:py-24 border-b border-white/10"
      >
        <div className="section-shell relative z-10">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal y={14} duration={0.55}>
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#ADDFB3]">
                  <span className="h-2 w-2 rounded-full bg-[#ADDFB3]" />
                  {t("about.hero.eyebrow")}
                </div>
              </Reveal>
              <Reveal y={14} duration={0.55} delay={0.05}>
	                <h1
	                  id="about-hero-heading"
	                  className="mt-4 text-[38px] sm:text-[52px] md:text-[60px] font-bold leading-[1.08] tracking-tight text-white"
	                >
	                  {t("about.hero.title_p1")}{" "}
	                  <span className="text-[#ADDFB3]">{t("about.hero.title_p2")}</span>
	                </h1>
              </Reveal>
              <Reveal y={14} duration={0.55} delay={0.1}>
                <p className="mt-6 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-white/80">
                  {t("about.hero.description")}
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal y={14} duration={0.55} delay={0.15}>
                <div className="rounded-xl border border-white/12 bg-white/[0.05] p-5 sm:p-6 backdrop-blur-md shadow-lg">
                  {/* Subtle Eyebrow Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ADDFB3]">
                      {t("about.sidebar.eyebrow")}
                    </span>
                    <span className="text-[10px] font-medium text-white/50">
                      {t("about.sidebar.location")}
                    </span>
                  </div>

                  {/* Compact Executive Pillars */}
                  <div className="mt-4 space-y-3.5">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#ADDFB3]/15 text-[#ADDFB3]">
                        <ShieldCheck className="h-3 w-3" />
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{t("about.sidebar.p1.title")}</h4>
                        <p className="mt-0.5 text-[11px] leading-snug text-white/70">
                          {t("about.sidebar.p1.desc")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#ADDFB3]/15 text-[#ADDFB3]">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{t("about.sidebar.p2.title")}</h4>
                        <p className="mt-0.5 text-[11px] leading-snug text-white/70">
                          {t("about.sidebar.p2.desc")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#ADDFB3]/15 text-[#ADDFB3]">
                        <Users className="h-3 w-3" />
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{t("about.sidebar.p3.title")}</h4>
                        <p className="mt-0.5 text-[11px] leading-snug text-white/70">
                          {t("about.sidebar.p3.desc")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact Footer */}
                  <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-white/50 font-semibold">{t("about.sidebar.footer.eyebrow")}</div>
                      <a href={`mailto:${COMPANY.email}`} className="text-[11px] font-medium text-[#ADDFB3] hover:underline">
                        {COMPANY.email}
                      </a>
                    </div>
                    <Button
                      onClick={() => navigate("contact")}
                      className="h-8 gap-1 rounded-full bg-white/10 px-3.5 text-[11px] font-semibold text-white border border-white/20 hover:bg-white hover:text-[#003D3C] transition-all"
                    >
                      {t("nav.contact")}
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
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
        className="section-shell py-20 lg:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5">
            <Reveal y={14} duration={0.55}>
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
                <span className="h-2 w-2 rounded-full bg-[#003D3C]" />
                {t("about.who.eyebrow")}
              </div>
              <h2
                id="who-we-are-heading"
                className="mt-4 text-[32px] sm:text-[42px] font-bold text-[#121212] leading-tight"
              >
                {t("about.who.title")}
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal y={14} duration={0.55} delay={0.08}>
              <div className="space-y-6 text-[15px] sm:text-[16px] leading-relaxed text-gray-600">
                <p>
                  {t("about.who.p1")}
                </p>
                <p>
                  {t("about.who.p2")}
                </p>
                <p>
                  {t("about.who.p3")}
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
        className="bg-[#F8F9FA] py-20 lg:py-28 border-y border-gray-100"
      >
        <div className="section-shell">
          <Reveal y={14} duration={0.55}>
            <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
              <span className="h-2 w-2 rounded-full bg-[#003D3C]" />
              {t("about.values.eyebrow")}
            </div>
            <h2
              id="values-heading"
              className="mt-4 text-[32px] sm:text-[42px] font-bold text-[#121212]"
            >
              {t("about.values.title")}
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] text-gray-500 leading-relaxed">
              {t("about.values.description")}
            </p>
          </Reveal>

          <RevealStagger stagger={0.08} delay={0.1} y={14} childDuration={0.5} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getValues().map((v, i) => (
              <motion.div
                key={v.title}
                whileHover={reduced ? {} : { y: -5 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="group flex flex-col justify-between rounded-[16px] bg-white p-7 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-[0_20px_40px_-24px_rgba(0,61,60,0.2)] hover:border-gray-200"
              >
                <div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#EEF4F2] text-[#003D3C] transition-colors duration-200 group-hover:bg-[#003D3C] group-hover:text-[#ADDFB3]">
                    <Icon name={v.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-[18px] font-bold text-[#121212]">
                    {l(v.title)}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
                    {l(v.description)}
                  </p>
                </div>
              </motion.div>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="about-cta-heading"
        className="bg-[#003D3C] text-white py-20 lg:py-28"
      >
        <div className="section-shell">
          <Reveal y={14} duration={0.55}>
            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-8 sm:p-12 md:p-16 backdrop-blur-md">
              <div className="grid items-center gap-10 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#ADDFB3]">
                    <span className="h-2 w-2 rounded-full bg-[#ADDFB3]" />
                    {t("about.cta.eyebrow")}
                  </div>
                  <h2
                    id="about-cta-heading"
                    className="mt-4 text-[32px] sm:text-[44px] font-bold text-white leading-tight"
                  >
                    {t("about.cta.title")}
                  </h2>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/80">
                    {t("about.cta.description")}
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-3.5 sm:flex-row lg:justify-end">
                  <Button
                    onClick={() => navigate("services")}
                    className="h-11 gap-2 rounded-[10px] bg-[#ADDFB3] px-6 text-[14px] font-semibold text-[#003D3C] shadow-none transition-all duration-200 hover:bg-[#c2e8c4] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t("about.cta.primary")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => navigate("contact")}
                    className="h-11 gap-2 rounded-[10px] border border-white/30 bg-transparent px-6 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/50 active:scale-[0.98]"
                  >
                    {t("nav.contact")}
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
