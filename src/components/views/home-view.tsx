"use client";

import * as React from "react";
import Image from "next/image";
import { useNav } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function StatProgressRing({
  percent,
  size = 56,
  stroke = 4,
}: {
  percent: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - percent / 100);

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
          strokeDashoffset={targetOffset}
        />
      </svg>
      <span className="absolute text-[12px] font-bold text-[#003D3C]">
        {percent}%
      </span>
    </div>
  );
}

function StatBar({ percent }: { percent: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-[#003D3C] origin-left"
        style={{
          transform: `scaleX(${percent / 100})`,
        }}
      />
    </div>
  );
}

// Static watermark logo for the capabilities section: same geometry and
// final opacities the animated version settled on, zero motion.
const WATERMARK_POINTS: [number, number][] = [
  [20, 25], [35, 25], [50, 25], [65, 25], [80, 25],
  [50, 40], [50, 55], [50, 70], [50, 85], [50, 100],
  [95, 25], [95, 40], [95, 55], [95, 70], [95, 85], [95, 100],
  [110, 25], [125, 25], [135, 35], [135, 50], [125, 60], [110, 60],
  [115, 75], [125, 88], [135, 100],
  [150, 25], [150, 40], [150, 55], [150, 70], [150, 85], [150, 100],
  [165, 25], [180, 25], [190, 25],
  [165, 60], [180, 60],
  [165, 100], [180, 100], [190, 100],
  [205, 25], [205, 40], [205, 55], [205, 70], [205, 85], [205, 100],
  [217, 45], [228, 65], [238, 85],
  [250, 25], [250, 40], [250, 55], [250, 70], [250, 85], [250, 100],
  [265, 25], [265, 40], [265, 55], [265, 70], [265, 85], [265, 100],
  [277, 45], [288, 65], [298, 85],
  [310, 25], [310, 40], [310, 55], [310, 70], [310, 85], [310, 100],
  [325, 25], [340, 25], [355, 25], [370, 25], [385, 25],
  [355, 40], [355, 55], [355, 70], [355, 85], [355, 100],
];

function WatermarkLogo() {
  return (
    <div className="relative w-full max-w-[420px] aspect-[400/120]">
      <svg
        viewBox="0 0 400 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <text
          x="200"
          y="102"
          textAnchor="middle"
          fontSize="92"
          fontWeight="900"
          letterSpacing="0.08em"
          className="font-sans select-none"
          fill="#013D3E"
          opacity="0.18"
        >
          TRENNT
        </text>
        <g opacity="0.85">
          {WATERMARK_POINTS.map(([x, y], idx) => (
            <rect
              key={idx}
              x={x - 2}
              y={y - 4}
              width={idx % 3 === 0 ? 4.2 : 3.2}
              height={idx % 3 === 0 ? 8.5 : 6.5}
              rx="2"
              fill={idx % 2 === 0 ? "#013D3E" : "#005A58"}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export function HomeView() {
  const { t, isRTL } = useTranslation();
  const navigate = useNav((s) => s.navigate);

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
            <div className={cn("lg:col-span-6 xl:col-span-6 z-10", isRTL && "font-arabic")}>
              <div className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#ADDFB3]">
                {t("home.hero.eyebrow")}
              </div>

              <h1
                id="hero-heading"
                className={cn(
                  "mt-5 text-balance tracking-tight leading-[1.08]",
                  isRTL && "font-arabic"
                )}
              >
                <span className="block text-3xl font-semibold tracking-tight text-white/95 sm:text-4xl md:text-5xl lg:text-[52px]">
                  {t("home.hero.title_p1")}
                </span>
                <span className="mt-1 sm:mt-2 block text-3xl font-extrabold tracking-tight text-[#ADDFB3] sm:text-4xl md:text-5xl lg:text-[56px]">
                  {t("home.hero.title_p2")}
                </span>
              </h1>

              <p className="mt-6 max-w-md text-[16px] leading-[1.7] text-white/85 font-normal">
                {t("home.hero.description")}
              </p>

              <div className="mt-8">
                <Button
                  asChild
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("services");
                  }}
                  className="h-12 rounded-[10px] bg-white px-8 text-[15px] font-semibold text-[#003D3C] shadow-sm transition-all duration-200 ease-out hover:bg-[#ADDFB3] hover:shadow-[0_10px_30px_-12px_rgba(173,223,179,0.7)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <a href="/#/services">{t("home.hero.cta_primary")}</a>
                </Button>
              </div>
            </div>

            {/* RIGHT COLUMN: EXECUTIVE PORTRAIT & 3 FLOATING METRIC CARDS */}
            <div className="relative lg:col-span-6 xl:col-span-6 lg:mt-0">
              <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
                <div className="overflow-hidden rounded-t-[36px] border border-white/10 shadow-2xl">
                  <Image
                    src="/trennt-hero-01.webp"
                    alt="TRENNT Executive Specialist"
                    width={500}
                    height={580}
                    priority
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 500px, 580px"
                    className="h-[520px] w-full object-cover lg:h-[580px]"
                  />
                </div>

                {/* CARD 1: TOP LEFT BADGE — INTERNAL AUDIT PROGRESS */}
                <div className="absolute left-2 top-8 z-20 w-[220px] sm:w-[240px] rounded-[16px] bg-white p-4 shadow-2xl border border-black/5 text-[#121212] sm:-left-6">
                  <div className="text-[13px] font-bold text-[#003D3C]">
                    Internal Audit
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Engagement Progress
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <StatProgressRing percent={78} />
                    <div>
                      <div className="text-[12px] font-bold text-[#003D3C] leading-tight">
                        Engagement<br />Completion
                      </div>
                      <div className="mt-1 text-[10px] text-gray-500 leading-tight">
                        7 of 9 Engagement<br />in Progress
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: BOTTOM LEFT BADGE — INTERNAL CONTROLS */}
                <div className="absolute left-2 bottom-10 z-20 w-[210px] sm:w-[230px] rounded-[16px] bg-white p-4 shadow-2xl border border-black/5 text-[#121212] sm:-left-8">
                  <div className="text-[13px] font-bold text-[#003D3C]">
                    Internal Controls
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Board Oversight
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-[30px] font-extrabold text-[#003D3C] leading-none tracking-tight">
                      94%
                    </span>
                    <div className="text-right">
                      <span className="text-[12px] font-bold text-[#00794A]">
                        Effective
                      </span>
                      <div className="text-[10px] text-gray-500">
                        Controls in Place
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <StatBar percent={94} />
                  </div>
                </div>

                {/* CARD 3: BOTTOM RIGHT BADGE — GOVERNANCE ASSESSMENT */}
                <div className="absolute right-2 bottom-4 z-20 w-[210px] sm:w-[235px] rounded-[16px] bg-white p-4 shadow-2xl border border-black/5 text-[#121212] sm:-right-4">
                  <div className="text-[13px] font-bold text-[#003D3C]">
                    Governance Assessment
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Board Oversight
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-[30px] font-extrabold text-[#003D3C] leading-none tracking-tight">
                      92%
                    </span>
                    <div className="text-right">
                      <span className="text-[12px] font-bold text-[#9A6800]">
                        Strong
                      </span>
                      <div className="text-[10px] text-gray-500">
                        Governance Maturity
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <StatBar percent={92} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. ABOUT TRENNT SECTION                                          */}
      {/* ================================================================ */}
      <section className="bg-[#F8F9FA] py-20 lg:py-28 border-b border-gray-100">
        <div className="section-shell">
          <div className={cn("max-w-4xl w-full", isRTL && "ml-auto text-right")}>
            <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
              <span className="h-2 w-2 rounded-full bg-[#003D3C]" />
              {t('home.about.eyebrow')}
            </div>
            <h2 className="mt-6 text-[32px] sm:text-[40px] font-medium leading-[1.25] text-[#121212] tracking-tight">
              {t('home.about.heading')}
            </h2>
          </div>
        </div>
      </section>


      {/* 3. OUR EXPERTISE SECTION (Built Around Internal Audit)           */}
      {/* ================================================================ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="section-shell">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className={cn("lg:col-span-5", isRTL && "text-right")}>
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
                <span className="h-2 w-2 rounded-full bg-[#003D3C]" />
                {t('home.expertise.eyebrow')}
              </div>
              <h2 className="mt-4 text-[36px] sm:text-[44px] font-bold leading-[1.15] text-[#121212] whitespace-pre-line">
                {t('home.expertise.heading')}
              </h2>
              <p className={cn("mt-6 text-[15px] leading-relaxed text-gray-500 max-w-2xl", isRTL && "mr-0 ml-auto")}>
                {t('home.expertise.description')}
              </p>
            </div>
            <div className={cn("lg:col-span-7")}>
              <div className="relative overflow-hidden rounded-[24px] border border-gray-100 shadow-xl aspect-[4/3]">
                <Image
                  src="/trennt-hero-02.webp"
                  alt="Our Expertise"
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 40vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WATERMARK & SERVICES SECTION                                  */}
      {/* ================================================================ */}
      <section className="relative py-24 lg:py-36 bg-[#F4F7F6] overflow-hidden border-t border-b border-gray-100">
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-[36%] max-w-[420px] pointer-events-none select-none hidden md:block",
            isRTL ? "left-[5%]" : "right-[5%]"
          )}
          aria-hidden="true"
        >
          <WatermarkLogo />
        </div>

        <div className="section-shell relative z-10">
          <div className={cn("max-w-3xl w-full", isRTL && "ml-auto text-right")}>
            <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
              <span className="h-2 w-2 rounded-full bg-[#003D3C]" />
              {t('home.capabilities.eyebrow')}
            </div>
            <h2 className="mt-6 text-[32px] sm:text-[44px] font-medium leading-[1.25] text-[#121212] tracking-tight">
              {t('home.capabilities.heading')}
            </h2>

            <div className={cn("mt-8 flex", isRTL && "justify-end")}>
              <Button
                asChild
                onClick={(e) => {
                  e.preventDefault();
                  navigate("services");
                }}
                className="h-11 rounded-[8px] bg-[#EEF4F2] px-6 text-[14px] font-semibold text-[#003D3C] shadow-sm transition-all duration-200 ease-out hover:bg-[#D5EBD6] hover:shadow-[0_8px_20px_-12px_rgba(0,61,60,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <a href="/#/services">{t("home.capabilities.cta")}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
