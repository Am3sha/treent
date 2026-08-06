"use client";

import * as React from "react";
import { ArrowLeft, Compass, Search, Home as HomeIcon } from "lucide-react";
import { useNav } from "@/lib/store";
import { Reveal, Eyebrow } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function NotFoundView() {
  const navigate = useNav((s) => s.navigate);
  const attemptedPath =
    typeof window !== "undefined"
      ? window.location.hash.replace(/^#/, "") || "/"
      : "/";

  const suggestions: { label: string; hint: string; view: Parameters<typeof navigate>[0] }[] = [
    { label: "Home", hint: "Start here", view: "home" },
    { label: "Services", hint: "What we do", view: "services" },
    { label: "Strategic Benchmark", hint: "Assess your maturity", view: "benchmark-landing" },
    { label: "Insights", hint: "Sector benchmarks", view: "benchmark-insights" },
    { label: "Contact", hint: "Talk to us", view: "contact" },
  ];

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-secondary/30">
        <div className="absolute inset-0 bg-radial-fade opacity-70" />
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" />
        {/* Soft gradient blobs for depth */}
        <div
          className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
          <Reveal>
            <Eyebrow>Error 404</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="relative mt-6 inline-block">
              <span className="select-none text-[120px] font-bold leading-none tracking-tighter text-primary/10 sm:text-[180px]">
                404
              </span>
              <Compass className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-primary sm:h-24 sm:w-24" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
              id="not-found-heading"
            >
              This page drifted off the map.
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground text-balance">
              The page you&apos;re looking for doesn&apos;t exist or may have
              moved. Let&apos;s get you back on course.
            </p>
          </Reveal>
          {attemptedPath && attemptedPath !== "/" && (
            <Reveal delay={0.2}>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Requested:{" "}
                <code className="font-mono text-foreground">{attemptedPath}</code>
              </p>
            </Reveal>
          )}
          <Reveal delay={0.25}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate("home")}>
                <HomeIcon className="mr-2 h-4 w-4" />
                Back to home
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("benchmark-landing")}
              >
                <Search className="mr-2 h-4 w-4" />
                Try the benchmark
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Suggestions */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <Reveal>
          <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Or explore
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((s, i) => (
            <Reveal key={s.label} delay={0.05 * i}>
              <button
                onClick={() => navigate(s.view)}
                className="group w-full text-left"
              >
                <Card className="h-full p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{s.label}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {s.hint}
                      </p>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted-foreground/50 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:text-primary" />
                  </div>
                </Card>
              </button>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
