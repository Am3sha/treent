"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, BookOpen, Sparkles, LineChart } from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useNav } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Reveal, RevealStagger, useReducedMotion } from "@/components/site/reveal";
import { CountUp } from "@/components/site/count-up";
import { TrenntParticleLogo } from "@/components/site/trennt-particle-logo";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function AnimatedProgressRing({
  percent,
  size = 56,
  stroke = 4,
}: {
  percent: number;
  size?: number;
  stroke?: number;
}) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = React.useState(() =>
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? percent
      : 0
  );

  React.useEffect(() => {
    if (reduced) {
      queueMicrotask(() => setProgress(percent));
      return;
    }
    let raf: number;
    let timeoutId: ReturnType<typeof setTimeout>;
    const startAnim = () => {
      const start = performance.now();
      const duration = 1200;
      const animate = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(percent * eased);
        if (t < 1) {
          raf = requestAnimationFrame(animate);
        } else {
          setProgress(percent);
        }
      };
      raf = requestAnimationFrame(animate);
    };
    timeoutId = setTimeout(startAnim, 600);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeoutId);
    };
  }, [percent, reduced]);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress / 100);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          stroke="currentColor"
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          stroke="currentColor"
          strokeLinecap="round"
          fill="none"
          className="text-[#003D3C]"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{ transition: reduced ? "none" : undefined }}
        />
      </svg>
      <span className="absolute text-[12px] font-bold text-[#003D3C]">
        {Math.round(progress)}%
      </span>
    </div>
  );
}

function AnimatedBar({
  percent,
  delay = 0,
}: {
  percent: number;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const [width, setWidth] = React.useState(() =>
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? percent
      : 0
  );

  React.useEffect(() => {
    if (reduced) {
      queueMicrotask(() => setWidth(percent));
      return;
    }
    let raf: number;
    let timeoutId: ReturnType<typeof setTimeout>;
    const startAnim = () => {
      const start = performance.now();
      const duration = 1200;
      const animate = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setWidth(percent * eased);
        if (t < 1) {
          raf = requestAnimationFrame(animate);
        } else {
          setWidth(percent);
        }
      };
      raf = requestAnimationFrame(animate);
    };
    timeoutId = setTimeout(startAnim, delay);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeoutId);
    };
  }, [percent, delay, reduced]);

  return (
    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-[#003D3C]"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function HomeView() {
  const navigate = useNav((s) => s.navigate);
  const reduced = useReducedMotion();

  const { scrollY } = useScroll();
  const heroImgY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -20]);
  const heroImgScale = useTransform(scrollY, [0, 600], [1, reduced ? 1 : 1.03]);

  const heroHeadline: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.8, ease: EASE_OUT, delay: reduced ? 0 : 0.1 },
    },
  };

  const heroEyebrow: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.6, ease: EASE_OUT },
    },
  };

  const heroBody: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.65, ease: EASE_OUT, delay: reduced ? 0 : 0.4 + i * 0.1 },
    }),
  };

  const heroCta: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.55, ease: EASE_OUT, delay: reduced ? 0 : 0.7 },
    },
  };

  const heroImageContainer: Variants = {
    hidden: { opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 18 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.85, ease: EASE_OUT, delay: reduced ? 0 : 0.2 },
    },
  };

  const statCard1: Variants = {
    hidden: { opacity: 0, x: reduced ? 0 : -24, y: reduced ? 0 : 10 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: reduced ? 0 : 0.65, ease: EASE_OUT, delay: reduced ? 0 : 0.55 },
    },
  };

  const statCard2: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.65, ease: EASE_OUT, delay: reduced ? 0 : 0.75 },
    },
  };

  const statCard3: Variants = {
    hidden: { opacity: 0, x: reduced ? 0 : 24, y: reduced ? 0 : 12 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: reduced ? 0 : 0.65, ease: EASE_OUT, delay: reduced ? 0 : 0.95 },
    },
  };

  return (
    <div className="flex flex-col bg-white text-[#121212] overflow-x-hidden">
      {/* ================================================================ */}
      {/* 1. HERO SECTION                                                  */}
      {/* ================================================================ */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden bg-[#003D3C] text-white pt-10 pb-20 lg:pt-16 lg:pb-32"
      >
        <div className="section-shell relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* LEFT COLUMN: TYPOGRAPHY & CTA */}
            <div className="lg:col-span-6 xl:col-span-6 z-10">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={heroEyebrow}
                className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#ADDFB3]"
              >
                DRIVING CONFIDENCE THROUGH
              </motion.div>

              <motion.h1
                id="hero-heading"
                initial="hidden"
                animate="visible"
                variants={heroHeadline}
                className="mt-4 text-[48px] sm:text-[62px] lg:text-[72px] font-extrabold uppercase leading-[0.96] tracking-[0.05em] text-[#ADDFB3]"
              >
                STRATEGIC<br />INSIGHT
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={0}
                variants={heroBody}
                className="mt-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#ADDFB3]"
              >
                Internal Audit. Delivered with Independence.
              </motion.p>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={0}
                variants={heroBody}
                className="mt-6 max-w-md text-[16px] leading-[1.7] text-white/85 font-normal"
              >
                Independent internal audit insight that helps organisations focus on what matters, strengthen governance, and make better-informed decisions.
              </motion.p>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={1}
                variants={heroBody}
                className="mt-6 text-[15px] font-medium text-white/75"
              >
                Integrity. Insight. Impact.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={heroCta}
                className="mt-8"
              >
                <Button
                  onClick={() => navigate("contact")}
                  className="h-12 rounded-[10px] bg-white px-8 text-[15px] font-semibold text-[#003D3C] shadow-sm transition-all duration-200 ease-out hover:bg-[#ADDFB3] hover:shadow-[0_10px_30px_-12px_rgba(173,223,179,0.7)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started
                </Button>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: EXECUTIVE PORTRAIT & 3 FLOATING METRIC CARDS */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroImageContainer}
              className="relative lg:col-span-6 xl:col-span-6 lg:mt-0"
            >
              <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
                <motion.div
                  style={{ y: heroImgY, scale: heroImgScale }}
                  className="overflow-hidden rounded-t-[36px] border border-white/10 shadow-2xl"
                >
                  <Image
                    src="/trennt-hero-01.webp"
                    alt="TRENNT Executive Specialist"
                    width={500}
                    height={580}
                    priority
                    sizes="(max-width: 1024px) 500px, 580px"
                    style={{ width: "auto", height: "auto" }}
                    className="h-[520px] w-full object-cover lg:h-[580px] transition-transform duration-[6000ms] ease-out hover:scale-[1.03]"
                  />
                </motion.div>

                {/* CARD 1: TOP LEFT BADGE — INTERNAL AUDIT PROGRESS */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={statCard1}
                  className="absolute left-2 top-8 z-20 w-[220px] sm:w-[240px] rounded-[16px] bg-white p-4 shadow-2xl border border-black/5 text-[#121212] sm:-left-6"
                >
                  <div className="text-[13px] font-bold text-[#003D3C]">
                    Internal Audit
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Engagement Progress
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <AnimatedProgressRing percent={78} />
                    <div>
                      <div className="text-[12px] font-bold text-[#003D3C] leading-tight">
                        Engagement<br />Completion
                      </div>
                      <div className="mt-1 text-[10px] text-gray-500 leading-tight">
                        7 of 9 Engagement<br />in Progress
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* CARD 2: BOTTOM LEFT BADGE — INTERNAL CONTROLS */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={statCard2}
                  className="absolute left-2 bottom-10 z-20 w-[210px] sm:w-[230px] rounded-[16px] bg-white p-4 shadow-2xl border border-black/5 text-[#121212] sm:-left-8"
                >
                  <div className="text-[13px] font-bold text-[#003D3C]">
                    Internal Controls
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Board Oversight
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-[30px] font-extrabold text-[#003D3C] leading-none tracking-tight">
                      <CountUp value="94%" duration={1300} delay={800} />
                    </span>
                    <div className="text-right">
                      <span className="text-[12px] font-bold text-[#008A54]">
                        Effective
                      </span>
                      <div className="text-[10px] text-gray-500">
                        Controls in Place
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <AnimatedBar percent={94} delay={900} />
                  </div>
                </motion.div>

                {/* CARD 3: BOTTOM RIGHT BADGE — GOVERNANCE ASSESSMENT */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={statCard3}
                  className="absolute right-2 bottom-4 z-20 w-[210px] sm:w-[235px] rounded-[16px] bg-white p-4 shadow-2xl border border-black/5 text-[#121212] sm:-right-4"
                >
                  <div className="text-[13px] font-bold text-[#003D3C]">
                    Governance Assessment
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Board Oversight
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-[30px] font-extrabold text-[#003D3C] leading-none tracking-tight">
                      <CountUp value="92%" duration={1300} delay={1000} />
                    </span>
                    <div className="text-right">
                      <span className="text-[12px] font-bold text-[#E69D00]">
                        Strong
                      </span>
                      <div className="text-[10px] text-gray-500">
                        Governance Maturity
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <AnimatedBar percent={92} delay={1100} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. ABOUT TRENNT SECTION                                  */}
      {/* ================================================================ */}
      <section className="bg-[#F8F9FA] py-20 lg:py-28 border-b border-gray-100">
        <div className="section-shell">
          <div className="max-w-4xl">
            <Reveal y={16} duration={0.6}>
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
                <span className="h-2 w-2 rounded-full bg-[#003D3C]" />
                About Trennt
              </div>
              <h2 className="mt-6 text-[32px] sm:text-[40px] font-medium leading-[1.25] text-[#121212] tracking-tight">
                Through independent internal audit, we help organizations strengthen governance, uncover opportunities, and make confident decisions.
              </h2>
            </Reveal>
          </div>
        </div>
      </section>


      {/* 3. OUR EXPERTISE SECTION (Built Around Internal Audit)           */}
      {/* ================================================================ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="section-shell">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <Reveal y={16} duration={0.6} className="lg:col-span-5">
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
                <span className="h-2 w-2 rounded-full bg-[#003D3C]" />
                Our Expertise
              </div>
              <h2 className="mt-4 text-[36px] sm:text-[44px] font-bold leading-[1.15] text-[#121212]">
                Built Around<br />Internal Audit.
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-gray-500 max-w-md">
                Internal audit is our sole focus. That specialisation shapes our methods, capabilities, and delivery approach around the needs of modern internal audit functions. The result is independent perspective, practical insight, and measurable value.
              </p>

              <div className="mt-10">
                <Button
                  onClick={() => navigate("services")}
                  className="h-11 rounded-[8px] bg-[#003D3C] px-6 text-[14px] font-semibold text-white transition-all duration-200 ease-out hover:bg-[#002f2e] hover:shadow-[0_10px_24px_-10px_rgba(0,61,60,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Know More
                </Button>
              </div>
            </Reveal>

            <Reveal y={16} duration={0.6} delay={0.1} className="lg:col-span-7">
              <div className="relative h-[420px] w-full overflow-hidden rounded-[24px] shadow-lg group sm:h-[480px]">
                <Image
                  src="/trennt-hero-02.webp"
                  alt="TRENNT Internal Audit Specialists reviewing document"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 800px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. WATERMARK & SERVICES SECTION                                  */}
      {/* ================================================================ */}
      <Reveal
        as="section"
        y={18}
        duration={0.65}
        className="relative py-24 lg:py-36 bg-[#F4F7F6] overflow-hidden border-t border-b border-gray-100"
      >
        <div
          className="absolute right-[3%] top-1/2 -translate-y-1/2 w-[36%] max-w-[420px] pointer-events-none select-none hidden md:block"
          aria-hidden="true"
        >
          <TrenntParticleLogo />
        </div>

        <div className="section-shell relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
              <span className="h-2 w-2 rounded-full bg-[#003D3C]" />
              Capabilities
            </div>
            <h2 className="mt-6 text-[32px] sm:text-[44px] font-medium leading-[1.25] text-[#121212] tracking-tight">
              Practical solutions tailored to strengthen governance, enhance internal controls, and support confident decision-making.
            </h2>

            <div className="mt-8">
              <Button
                onClick={() => navigate("services")}
                className="h-11 rounded-[8px] bg-[#EEF4F2] px-6 text-[14px] font-semibold text-[#003D3C] shadow-sm transition-all duration-200 ease-out hover:bg-[#D5EBD6] hover:shadow-[0_8px_20px_-12px_rgba(0,61,60,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Know More
              </Button>
            </div>

            <p className="mt-8 text-[13.5px] text-gray-500 max-w-lg leading-relaxed">
              Every engagement is tailored to strengthen governance, improve internal controls, and support strategic decision-making.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ================================================================ */}
      {/* 8. LATEST ARTICLES & PERSPECTIVES SECTION                        */}
      {/* ================================================================ */}
      <section className="py-20 lg:py-28 bg-white border-t border-gray-100">
        <div className="section-shell">
          <Reveal y={14} duration={0.55}>
            <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
              <span className="h-2 w-2 rounded-full bg-[#003D3C]" />
              Insights
            </div>

            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="text-[36px] sm:text-[44px] font-bold text-[#121212]">
                Latest Articles &amp;<br />Perspectives
              </h2>
              <p className="max-w-md text-[14px] leading-relaxed text-gray-500">
                Stay informed on the latest thinking in governance, internal audit, risk management, and organizational performance.
              </p>
            </div>
          </Reveal>

          <RevealStagger stagger={0.1} delay={0.1} y={14} childDuration={0.55} className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "The Future of Internal Audit",
                desc: "How modern internal audit is evolving to deliver greater strategic value, stronger governance, and more informed decision-making.",
                icon: BookOpen,
                tag: "Governance",
              },
              {
                title: "Building Better Internal Controls",
                desc: "Actionable steps for organizations to develop effective control environments that support operational efficiency and sustainable growth.",
                icon: Sparkles,
                tag: "Internal Audit",
              },
              {
                title: "Strengthening Governance",
                desc: "Key practices for board oversight, internal audit alignment, and transparent risk reporting in growing enterprises.",
                icon: LineChart,
                tag: "Risk & Controls",
              },
            ].map((article, idx) => {
              const IconComp = article.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={reduced ? {} : { y: -5 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="group flex flex-col justify-between transition-transform duration-300 ease-out"
                >
                  <div>
                    <div className="relative h-48 w-full rounded-[12px] overflow-hidden bg-gradient-to-br from-[#EAEFEF] via-[#F4F7F6] to-[#DEE8E6] flex items-center justify-center border border-[#003D3C]/5">
                      <div className="absolute inset-0 bg-[radial-gradient(#003D3C_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.06] transition-transform duration-500 ease-out group-hover:scale-[1.05]" />
                      <div className="relative flex flex-col items-center gap-2 transition-transform duration-500 ease-out group-hover:scale-[1.08]">
                        <div className="h-12 w-12 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center shadow-xs border border-[#003D3C]/10 text-[#003D3C]/70">
                          <IconComp className="h-6 w-6 stroke-[1.75]" />
                        </div>
                        <span className="text-[11px] font-bold tracking-widest text-[#003D3C]/40 uppercase">
                          {article.tag}
                        </span>
                      </div>
                    </div>
                    <h3 className="mt-6 text-[18px] font-bold text-[#121212]">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
                      {article.desc}
                    </p>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate("benchmark-insights")}
                      className="text-[13px] font-semibold text-[#003D3C] inline-flex items-center gap-1.5 group/link"
                    >
                      <span className="hover-underline-grow">Read Article</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-all duration-250 ease-out group-hover/link:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </RevealStagger>
        </div>
      </section>
    </div>
  );
}
