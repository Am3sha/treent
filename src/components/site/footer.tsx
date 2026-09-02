"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Linkedin, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { useNav } from "@/lib/store";
import { COMPANY } from "@/lib/content";
import type { ViewKey } from "@/lib/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Reveal, RevealStagger, RevealItem, useReducedMotion, EASE_OUT } from "@/components/site/reveal";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const FOOTER_NAV: { heading: string; links: { label: string; view: ViewKey }[] }[] = [
  {
    heading: "Navigation",
    links: [
      { label: "About", view: "about" },
      { label: "Services", view: "services" },
      { label: "Contact", view: "contact" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Internal Audit Outsourcing", view: "internal-audit-outsourcing" },
      { label: "Internal Audit Co-Sourcing", view: "internal-audit-co-sourcing" },
      { label: "Function Establishment", view: "internal-audit-function-establishment" },
      { label: "Internal Audit Transformation", view: "internal-audit-transformation" },
      { label: "QAIP", view: "quality-assurance-and-improvement-program" },
      { label: "Framework Agreements", view: "framework-agreements" },
    ],
  },
  {
    heading: "Benchmark",
    links: [
      { label: "Overview", view: "benchmark-landing" },
      { label: "Start Assessment", view: "benchmark-quiz" },
    ],
  },
];

const newsletterFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

export function Footer() {
  const { t, l, isRTL } = useTranslation();
  const navigate = useNav((s) => s.navigate);
  const [status, setStatus] = React.useState<"idle" | "loading" | "ok" | "already-subscribed" | "err">("idle");
  const reduced = useReducedMotion();

  const getFooterNav = () => [
    {
      heading: t("footer.nav_heading"),
      links: [
        { label: t("nav.about"), view: "about" as ViewKey },
        { label: t("nav.services"), view: "services" as ViewKey },
        { label: t("nav.contact"), view: "contact" as ViewKey },
      ],
    },
    {
      heading: t("footer.services_heading"),
      links: [
        { label: isRTL ? "الاستعانة بمصادر خارجية للمراجعة الداخلية" : "Internal Audit Outsourcing", view: "internal-audit-outsourcing" as ViewKey },
        { label: isRTL ? "المشاركة في المراجعة الداخلية" : "Internal Audit Co-Sourcing", view: "internal-audit-co-sourcing" as ViewKey },
        { label: isRTL ? "تأسيس وظيفة المراجعة" : "Function Establishment", view: "internal-audit-function-establishment" as ViewKey },
        { label: isRTL ? "تحول المراجعة الداخلية" : "Internal Audit Transformation", view: "internal-audit-transformation" as ViewKey },
        { label: isRTL ? "برنامج ضمان وتحسين الجودة" : "QAIP", view: "quality-assurance-and-improvement-program" as ViewKey },
        { label: isRTL ? "اتفاقيات الإطار" : "Framework Agreements", view: "framework-agreements" as ViewKey },
      ],
    },
    {
      heading: t("footer.benchmark_heading"),
      links: [
        { label: isRTL ? "نظرة عامة" : "Overview", view: "benchmark-landing" as ViewKey },
        { label: t("nav.start_assessment"), view: "benchmark-quiz" as ViewKey },
      ],
    },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const subscribe = async (data: NewsletterFormValues) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const result = (await res.json()) as { ok: boolean; data?: { alreadySubscribed?: boolean } };
      if (!res.ok) throw new Error("failed");
      setStatus(result.data?.alreadySubscribed ? "already-subscribed" : "ok");
      reset();
    } catch {
      setStatus("err");
    }
  };

  const socialHover = reduced
    ? {}
    : {
      backgroundColor: "#ADDFB3",
      color: "#013D3E",
      scale: 1.07,
      y: -2,
      borderColor: "rgba(173,223,179,0.6)",
    };

  return (
    <footer className={cn("mt-auto bg-[#013D3E] text-white", isRTL && "font-arabic")}>
      <div className="section-shell pt-16 pb-7">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal y={12} duration={0.58} className="lg:col-span-4">
            <div className="space-y-5">
              <motion.div
                initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
                whileInView={
                  reduced
                    ? {}
                    : {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.5,
                        ease: EASE_OUT,
                        delay: 0.1,
                      },
                    }
                }
                viewport={{ once: true, margin: "-60px 0px -60px 0px" }}
              >
                <Logo variant="light" />
              </motion.div>

              <form onSubmit={handleSubmit(subscribe)} className="max-w-sm">
                <label
                  htmlFor="footer-newsletter"
                  className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#ADDFB3]/80"
                >
                  The Trennt Quarterly
                </label>
                <div className="mt-2 flex flex-col gap-2.5">
                  <div className="flex gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm focus-within:border-[#ADDFB3]/50 transition-all duration-300 ease-out">
                    <input
                      id="footer-newsletter"
                      type="email"
                      {...register("email")}
                      placeholder="you@company.com"
                      className="h-11 flex-1 rounded-full bg-transparent px-5 text-[14px] text-white placeholder:text-white/40 outline-none"
                    />
                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      whileHover={reduced || status === "loading" ? {} : { scale: 1.03, y: -1 }}
                      whileTap={reduced || status === "loading" ? {} : { scale: 0.98 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      className="mr-1.5 my-1.5 inline-flex h-[38px] items-center rounded-full bg-[#ADDFB3] px-5 text-[13px] font-semibold text-[#013D3E] transition-all duration-200 ease-out hover:bg-white hover:shadow-[0_4px_16px_-6px_rgba(173,223,179,0.7)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                    >
                      {status === "loading" ? "…" : "Subscribe"}
                    </motion.button>
                  </div>
                  {errors.email && (
                    <p className="text-[12px] text-[#FFB4B4]">
                      {errors.email.message}
                    </p>
                  )}
                  {status === "ok" && (
                    <p className="text-[12px] text-[#ADDFB3]">
                      Thank you — you&apos;re on the list.
                    </p>
                  )}
                  {status === "already-subscribed" && (
                    <p className="text-[12px] text-[#ADDFB3]">
                      You&apos;re already subscribed to The Trennt Quarterly.
                    </p>
                  )}
                  {status === "err" && (
                    <p className="text-[12px] text-[#FFB4B4]">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </div>
              </form>

              <div className="flex gap-2.5">
                {[
                  { icon: Linkedin, href: COMPANY.social.linkedin, label: "LinkedIn", isLucide: true },
                  { icon: XIcon, href: COMPANY.social.twitter, label: "X", isLucide: false },
                ].map(({ icon: Icon, href, label, isLucide }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    initial={{ opacity: 1, backgroundColor: "transparent", color: "rgba(255,255,255,0.65)", scale: 1, y: 0, borderColor: "rgba(255,255,255,0.15)" }}
                    whileHover={socialHover}
                    transition={{ duration: 0.23, ease: EASE_OUT }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65"
                  >
                    {isLucide ? (
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </motion.a>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {getFooterNav().map((col, idx) => (
              <Reveal
                key={col.heading}
                y={12}
                duration={0.58}
                delay={reduced ? 0 : 0.09 + idx * 0.09}
              >
                <div>
                  <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#ADDFB3]/80">
                    {col.heading}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <button
                          onClick={() => navigate(l.view)}
                          className="group inline-flex items-center gap-1.5 text-[14px] text-white/75 transition-colors duration-200 ease-out hover:text-white"
                        >
                          <span className="hover-underline-grow">{l.label}</span>
                          <ArrowUpRight className={cn("h-3 w-3 opacity-0 transition-all duration-250 ease-out group-hover:opacity-100 group-hover:translate-x-0", isRTL ? "translate-x-1" : "-translate-x-1")} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-5">
          <RevealStagger stagger={0.05} delay={reduced ? 0 : 0.42} y={10} childDuration={0.5}>
            <div className="flex items-start gap-6">
              <div className="flex flex-wrap flex-1 items-center gap-x-8 gap-y-3 text-[13px] text-white/55">
                <div className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 text-[#ADDFB3]/70" strokeWidth={1.6} />
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="transition-colors duration-200 ease-out hover:text-white hover-underline-grow"
                  >
                    {COMPANY.email}
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 text-[#ADDFB3]/70" strokeWidth={1.6} />
                  <span>{l(COMPANY.address)}</span>
                </div>
              </div>
              <motion.button
                onClick={() => navigate("contact")}
                whileHover={reduced ? {} : { scale: 1.025, y: -1 }}
                whileTap={reduced ? {} : { scale: 0.99 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-[13px] font-medium text-white transition-colors duration-250 ease-out hover:border-[#ADDFB3]/50 hover:bg-[#ADDFB3]/10 hover:text-[#ADDFB3] group"
              >
                {t("footer.cta_talk")}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
              </motion.button>
            </div>

            <div className="mt-2.5 flex flex-col items-start justify-between gap-3 text-[12px] text-white/45 sm:flex-row sm:items-center">
              <p>
                {t("footer.copyright").replace("{year}", new Date().getFullYear().toString())}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <button
                  onClick={() => navigate("legal")}
                  className="inline-flex items-center gap-1 transition-colors duration-200 ease-out hover:text-white group"
                >
                  <span className="hover-underline-grow">Privacy &amp; Terms</span>
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          </RevealStagger>
        </div>
      </div>
    </footer>
  );
}
