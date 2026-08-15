"use client";

import * as React from "react";
import { ArrowRight, ArrowUpRight, MapPin, CheckCircle2, ShieldCheck, MessagesSquare, Users, RefreshCw, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useNav } from "@/lib/store";
import { COMPANY, LEADERSHIP } from "@/lib/content";
import { Icon } from "@/components/site/icon";
import { Reveal, RevealStagger, Eyebrow, SectionHeading, useReducedMotion } from "@/components/site/reveal";
import { CountUp } from "@/components/site/count-up";
import { Button } from "@/components/ui/button";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

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
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col">
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
                  About Trennt
                </div>
              </Reveal>
              <Reveal y={14} duration={0.55} delay={0.05}>
                <h1
                  id="about-hero-heading"
                  className="mt-4 text-[38px] sm:text-[52px] md:text-[60px] font-bold leading-[1.08] tracking-tight text-white"
                >
                  An internal audit firm dedicated exclusively to{" "}
                  <span className="text-[#ADDFB3]">internal audit delivery.</span>
                </h1>
              </Reveal>
              <Reveal y={14} duration={0.55} delay={0.1}>
                <p className="mt-6 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-white/80">
                  {COMPANY.description}
                </p>
              </Reveal>
              <Reveal y={14} duration={0.55} delay={0.15}>
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px] font-medium text-white/70">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#ADDFB3]" />
                    {COMPANY.address}
                  </span>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal y={14} duration={0.55} delay={0.15}>
                <div className="rounded-xl border border-white/12 bg-white/[0.05] p-5 sm:p-6 backdrop-blur-md shadow-lg">
                  {/* Subtle Eyebrow Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ADDFB3]">
                      Exclusive Practice
                    </span>
                    <span className="text-[10px] font-medium text-white/50">
                      Riyadh, KSA
                    </span>
                  </div>

                  {/* Compact Executive Pillars */}
                  <div className="mt-4 space-y-3.5">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#ADDFB3]/15 text-[#ADDFB3]">
                        <ShieldCheck className="h-3 w-3" />
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-white">100% Dedicated Practice</h4>
                        <p className="mt-0.5 text-[11px] leading-snug text-white/70">
                          Exclusively focused on internal audit — zero generalist dilution.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#ADDFB3]/15 text-[#ADDFB3]">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-white">IIA Standards Compliance</h4>
                        <p className="mt-0.5 text-[11px] leading-snug text-white/70">
                          Aligned with IIA Global Standards & KSA governance rules.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#ADDFB3]/15 text-[#ADDFB3]">
                        <Users className="h-3 w-3" />
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Board & Leadership Partner</h4>
                        <p className="mt-0.5 text-[11px] leading-snug text-white/70">
                          Independent objective insight for Audit Committees & C-suites.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact Footer */}
                  <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-white/50 font-semibold">Direct Inquiry</div>
                      <a href={`mailto:${COMPANY.email}`} className="text-[11px] font-medium text-[#ADDFB3] hover:underline">
                        {COMPANY.email}
                      </a>
                    </div>
                    <Button
                      onClick={() => navigate("contact")}
                      className="h-8 gap-1 rounded-full bg-white/10 px-3.5 text-[11px] font-semibold text-white border border-white/20 hover:bg-white hover:text-[#003D3C] transition-all"
                    >
                      Contact Us
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
      {/* STATS HIGHLIGHT BAR                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-[#F4F7F6] py-12 border-b border-gray-100">
        <div className="section-shell">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center md:text-left">
            <div>
              <div className="text-[36px] sm:text-[44px] font-extrabold text-[#003D3C] tracking-tight">
                <CountUp value="100%" duration={1200} />
              </div>
              <div className="text-[13px] font-semibold text-gray-500 mt-1">
                Internal Audit Focus
              </div>
            </div>
            <div>
              <div className="text-[36px] sm:text-[44px] font-extrabold text-[#003D3C] tracking-tight">
                <CountUp value="50+" duration={1400} />
              </div>
              <div className="text-[13px] font-semibold text-gray-500 mt-1">
                Successful Engagements
              </div>
            </div>
            <div>
              <div className="text-[36px] sm:text-[44px] font-extrabold text-[#003D3C] tracking-tight">
                <CountUp value="15+" duration={1600} />
              </div>
              <div className="text-[13px] font-semibold text-gray-500 mt-1">
                Years Team Experience
              </div>
            </div>
            <div>
              <div className="text-[36px] sm:text-[44px] font-extrabold text-[#003D3C] tracking-tight">
                <CountUp value="98%" duration={1800} />
              </div>
              <div className="text-[13px] font-semibold text-gray-500 mt-1">
                Client Satisfaction
              </div>
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
                Who We Are
              </div>
              <h2
                id="who-we-are-heading"
                className="mt-4 text-[32px] sm:text-[42px] font-bold text-[#121212] leading-tight"
              >
                Independent internal audit, focused on what matters.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal y={14} duration={0.55} delay={0.08}>
              <div className="space-y-6 text-[15px] sm:text-[16px] leading-relaxed text-gray-600">
                <p>
                  Trennt is an internal audit firm based in Saudi Arabia,
                  dedicated exclusively to internal audit delivery. We are not a
                  generalist consulting firm—our entire practice is focused on
                  providing world-class internal audit services.
                </p>
                <p>
                  We work with Boards, Audit Committees, and executive
                  management, providing clear and objective insight into the
                  effectiveness of governance, risk management, and internal
                  controls.
                </p>
                <p>
                  Our risk-based engagements direct attention to the areas of
                  greatest importance, strengthen the control environment, and
                  give leadership a sounder basis for decision-making.
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
              What We Believe
            </div>
            <h2
              id="values-heading"
              className="mt-4 text-[32px] sm:text-[42px] font-bold text-[#121212]"
            >
              The principles that guide our work.
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] text-gray-500 leading-relaxed">
              These values define who we are, how we work, and what you can expect when you partner with Trennt.
            </p>
          </Reveal>

          <RevealStagger stagger={0.08} delay={0.1} y={14} childDuration={0.5} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
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
                    {v.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
                    {v.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* LEADERSHIP                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="leadership-heading"
        className="section-shell py-20 lg:py-28"
      >
        <Reveal y={14} duration={0.55}>
          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
            <span className="h-2 w-2 rounded-full bg-[#003D3C]" />
            Our Team
          </div>
          <h2
            id="leadership-heading"
            className="mt-4 text-[32px] sm:text-[42px] font-bold text-[#121212]"
          >
            Experienced internal audit professionals.
          </h2>
          <p className="mt-3 max-w-2xl text-[14px] text-gray-500 leading-relaxed">
            Our team brings deep expertise in internal audit, risk management, governance, and controls across a wide range of industries.
          </p>
        </Reveal>

        <RevealStagger stagger={0.08} delay={0.1} y={14} childDuration={0.5} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LEADERSHIP.map((p, i) => (
            <motion.div
              key={p.name}
              whileHover={reduced ? {} : { y: -5 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="flex flex-col rounded-[16px] bg-white p-7 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-[0_20px_40px_-24px_rgba(0,61,60,0.2)] hover:border-gray-200"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#003D3C] text-[15px] font-extrabold text-[#ADDFB3] shadow-xs">
                  {p.initials}
                </span>
                <div>
                  <h3 className="text-[17px] font-bold text-[#121212]">
                    {p.name}
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#003D3C]">
                    {p.role}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-[13px] leading-relaxed text-gray-500">
                {p.bio}
              </p>
            </motion.div>
          ))}
        </RevealStagger>
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
                    Let's Work Together
                  </div>
                  <h2
                    id="about-cta-heading"
                    className="mt-4 text-[32px] sm:text-[44px] font-bold text-white leading-tight"
                  >
                    Ready to strengthen your internal audit function?
                  </h2>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/80">
                    We'd welcome the opportunity to discuss your needs and how
                    we can help. Contact us to schedule an initial conversation.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-3.5 sm:flex-row lg:justify-end">
                  <Button
                    onClick={() => navigate("services")}
                    className="h-11 gap-2 rounded-[10px] bg-[#ADDFB3] px-6 text-[14px] font-semibold text-[#003D3C] shadow-none transition-all duration-200 hover:bg-[#c2e8c4] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Explore Services
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => navigate("contact")}
                    className="h-11 gap-2 rounded-[10px] border border-white/30 bg-transparent px-6 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/50 active:scale-[0.98]"
                  >
                    Contact Us
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
