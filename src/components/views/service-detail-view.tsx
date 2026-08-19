"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ArrowUpRight,
    Check,
    Handshake,
    Users,
    Building2,
    RefreshCcw,
    ShieldCheck,
    CheckSquare,
    Sparkles,
} from "lucide-react";
import { SERVICES } from "@/lib/content";
import type { ViewKey } from "@/lib/types";
import { useNav } from "@/lib/store";
import { Reveal, RevealStagger, Eyebrow, useReducedMotion } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { NotFoundView } from "@/components/views/not-found-view";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    "internal-audit-outsourcing": Handshake,
    "internal-audit-co-sourcing": Users,
    "internal-audit-function-establishment": Building2,
    "internal-audit-transformation": RefreshCcw,
    "quality-assurance-and-improvement-program": ShieldCheck,
};

function getCategoryInfo(slug: string) {
    if (slug === "internal-audit-outsourcing" || slug === "internal-audit-co-sourcing") {
        return { label: "Core", isCore: true };
    }
    return { label: "Development", isCore: false };
}

export function ServiceDetailView({ slug }: { slug: string }) {
    const navigate = useNav((s) => s.navigate);
    const reduced = useReducedMotion();
    const service = SERVICES.find((s) => s.slug === slug);

    if (!service) return <NotFoundView />;

    const IconComp = SERVICE_ICONS[service.slug] ?? ShieldCheck;
    const category = getCategoryInfo(service.slug);
    const otherServices = SERVICES.filter((s) => s.slug !== slug);

    return (
        <div className="flex flex-col">
            {/* ------------------------------------------------------------------ */}
            {/* HERO / HEADER SECTION                                             */}
            {/* ------------------------------------------------------------------ */}
            <section
                aria-labelledby="service-detail-hero-heading"
                className="relative overflow-hidden border-b border-gray-200/80 bg-white"
            >
                <div className="absolute inset-0 bg-radial-fade" aria-hidden />
                <motion.div
                    aria-hidden
                    className="absolute inset-0 bg-grid mask-fade-b opacity-40 pointer-events-none"
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
                    <div className="max-w-3xl">
                        {/* Category Pill & Eyebrow */}
                        <Reveal>
                            <div className="flex flex-wrap items-center gap-3">
                                <Eyebrow>Services</Eyebrow>
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider shadow-2xs",
                                        category.isCore
                                            ? "bg-[#003D3C] text-white"
                                            : "bg-[#ADDFB3] text-[#003D3C]"
                                    )}
                                >
                                    <Sparkles className="h-3 w-3" />
                                    {category.label} Service
                                </span>
                            </div>
                        </Reveal>

                        {/* Title & Icon */}
                        <Reveal delay={0.05}>
                            <div className="mt-6 flex items-start gap-4">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4F2] text-[#003D3C] border border-[#003D3C]/10 shadow-2xs mt-1">
                                    <IconComp className="h-6 w-6 stroke-[1.75]" />
                                </span>
                                <h1
                                    id="service-detail-hero-heading"
                                    className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#121212] sm:text-5xl md:text-6xl md:leading-[1.02]"
                                >
                                    {service.title}
                                </h1>
                            </div>
                        </Reveal>

                        {/* Description */}
                        <Reveal delay={0.1}>
                            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
                                {service.description}
                            </p>
                        </Reveal>

                        {/* Standard Key Facts Badges */}
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------------ */}
            {/* KEY BENEFITS & KEY DELIVERABLES CARDS                              */}
            {/* ------------------------------------------------------------------ */}
            <section className="bg-white py-16 sm:py-24 lg:py-28 border-b border-gray-200/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal y={12}>
                        <div className="rounded-2xl border border-gray-200/80 bg-[#FAFBFA] p-8 sm:p-10 md:p-12 shadow-xs">
                            <div className="grid gap-10 sm:gap-12 lg:grid-cols-2">
                                {/* Key Benefits */}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF4F2] text-[#003D3C]">
                                            <Check className="h-4 w-4 stroke-[2.5]" />
                                        </span>
                                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003D3C]">
                                            Key Benefits
                                        </h3>
                                    </div>
                                    <RevealStagger className="mt-6 space-y-3.5">
                                        {service.outcomes.map((benefit, i) => (
                                            <Reveal key={i} delay={i * 0.04}>
                                                <li className="flex items-start gap-3 text-sm font-medium text-gray-800 leading-snug">
                                                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#003D3C]/10 text-[#003D3C]">
                                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                                    </span>
                                                    <span>{benefit}</span>
                                                </li>
                                            </Reveal>
                                        ))}
                                    </RevealStagger>
                                </div>

                                {/* Key Deliverables */}
                                <div className="lg:border-l lg:border-gray-200/80 lg:pl-10">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF4F2] text-[#003D3C]">
                                            <CheckSquare className="h-4 w-4 stroke-[2]" />
                                        </span>
                                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003D3C]">
                                            Key Deliverables
                                        </h3>
                                    </div>
                                    <RevealStagger className="mt-6 space-y-3.5">
                                        {service.deliverables.map((deliverable, i) => (
                                            <Reveal key={i} delay={i * 0.04}>
                                                <li className="flex items-start gap-3 text-sm font-medium text-gray-700 leading-snug">
                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#003D3C]" aria-hidden />
                                                    <span>{deliverable}</span>
                                                </li>
                                            </Reveal>
                                        ))}
                                    </RevealStagger>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ------------------------------------------------------------------ */}
            {/* EXPLORE OTHER SERVICES                                             */}
            {/* ------------------------------------------------------------------ */}
            <section className="bg-[#F8F9FA] py-16 sm:py-24 lg:py-28 border-b border-gray-200/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal>
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200/80 pb-8">
                            <div>
                                <Eyebrow>Service Catalogue</Eyebrow>
                                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#121212] sm:text-3xl">
                                    Explore other internal audit services
                                </h2>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => navigate("services")}
                                className="inline-flex gap-2 rounded-full border-gray-300 text-[#003D3C] hover:bg-[#EEF4F2] self-start sm:self-auto"
                            >
                                View all services
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </Reveal>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {otherServices.map((other, idx) => {
                            const OtherIcon = SERVICE_ICONS[other.slug] ?? ShieldCheck;
                            const cat = getCategoryInfo(other.slug);
                            return (
                                <Reveal key={other.slug} delay={idx * 0.06}>
                                    <div
                                        onClick={() => navigate(other.slug as ViewKey)}
                                        className="group relative flex h-full cursor-pointer flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#003D3C]/40 hover:shadow-md"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4F2] text-[#003D3C] border border-[#003D3C]/10">
                                                    <OtherIcon className="h-5 w-5 stroke-[1.75]" />
                                                </span>
                                                <span
                                                    className={cn(
                                                        "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider",
                                                        cat.isCore
                                                            ? "bg-[#003D3C] text-white"
                                                            : "bg-[#ADDFB3] text-[#003D3C]"
                                                    )}
                                                >
                                                    {cat.label}
                                                </span>
                                            </div>
                                            <h4 className="mt-4 text-base font-semibold text-[#121212] group-hover:text-[#003D3C] transition-colors">
                                                {other.title}
                                            </h4>
                                            <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                                {other.tagline}
                                            </p>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[#003D3C] group-hover:underline">
                                            Learn more
                                            <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </div>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------------ */}
            {/* CLOSING CTA SECTION                                                */}
            {/* ------------------------------------------------------------------ */}
            <section
                aria-labelledby="service-cta-heading"
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
                                        Start a conversation
                                    </span>
                                    <h2
                                        id="service-cta-heading"
                                        className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl text-white"
                                    >
                                        Ready to discuss your internal audit needs?
                                    </h2>
                                    <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 text-balance">
                                        We&apos;d welcome the opportunity to understand your
                                        requirements and discuss how we can help. Contact us to
                                        schedule an initial conversation.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3.5 sm:flex-row lg:justify-end">
                                    <Button
                                        size="lg"
                                        onClick={() => navigate("framework-agreements")}
                                        className="h-12 gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-[#003D3C] shadow-sm transition-all duration-200 ease-out hover:bg-[#ADDFB3] hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Framework agreements
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => navigate("contact")}
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-7 text-[15px] font-semibold text-white transition-all duration-200 ease-out hover:bg-white/10 hover:border-white/50 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Contact us
                                        <ArrowUpRight className="h-4 w-4" />
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
