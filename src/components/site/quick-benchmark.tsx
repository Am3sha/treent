"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, Sparkles, Check } from "lucide-react";
import { useNav } from "@/lib/store";
import { BENCHMARK_QUESTIONS, scoreToTier, TIER_META } from "@/lib/content";
import { Reveal, Eyebrow } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Dimension, MaturityTier } from "@/lib/types";

// 3-question teaser drawn from the client-approved benchmark set.
// Score: A=3, B=2, C=1, D=0 → 0-100 provisional read.
const QUICK_QUESTIONS: { id: string; dimension: Dimension; prompt: string; options: { letter: string; label: string; score: number }[] }[] = (() => {
  const pick = (ids: string[]) =>
    ids
      .map((id) => BENCHMARK_QUESTIONS.find((q) => q.id === id))
      .filter((q): q is NonNullable<typeof q> => Boolean(q));
  return [
    ...pick(["gov-1", "risk-6", "exec-11"]),
  ];
})();

export function QuickBenchmark() {
  const navigate = useNav((s) => s.navigate);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUICK_QUESTIONS.length;

  // Calculate provisional score (A=3, B=2, C=1, D=0; normalise against max 9)
  const provisionalScore = React.useMemo(() => {
    if (answeredCount === 0) return 0;
    let sum = 0;
    for (const q of QUICK_QUESTIONS) {
      const letter = answers[q.id];
      if (letter) {
        const opt = q.options.find((o) => o.letter === letter);
        if (opt) sum += opt.score;
      }
    }
    return Math.round((sum / 9) * 100);
  }, [answers, answeredCount]);

  const tier: MaturityTier = scoreToTier(provisionalScore);
  const tierMeta = TIER_META[tier];

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <section
      aria-labelledby="quick-benchmark-heading"
      className="relative overflow-hidden border-y border-border/60 bg-secondary/30"
    >
      <div className="absolute inset-0 bg-grid opacity-30 mask-fade-b" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <Reveal>
          <div className="text-center">
            <Eyebrow className="justify-center">60-second preview</Eyebrow>
            <h2
              id="quick-benchmark-heading"
              className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
            >
              Not sure you need the full assessment?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground text-balance">
              Answer three questions. Get a provisional read on your strategic
              maturity — then decide if you want the full picture.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="mt-10 overflow-hidden rounded-2xl border-border/70 bg-card p-6 shadow-sm sm:p-8">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="questions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Progress indicator */}
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {answeredCount} / {QUICK_QUESTIONS.length} answered
                    </span>
                    <div className="flex gap-1.5">
                      {QUICK_QUESTIONS.map((q, i) => (
                        <span
                          key={q.id}
                          className={cn(
                            "h-1.5 w-8 rounded-full transition-colors duration-300",
                            answers[q.id]
                              ? "bg-primary"
                              : "bg-secondary"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {QUICK_QUESTIONS.map((q, qi) => (
                      <div key={q.id} className="border-b border-border/50 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {qi + 1}
                          </span>
                          <div className="flex-1">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary/70">
                              {q.dimension}
                            </span>
                            <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                              {q.prompt}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {q.options.map((opt) => {
                                const selected = answers[q.id] === opt.letter;
                                return (
                                  <button
                                    key={opt.letter}
                                    onClick={() =>
                                      setAnswers((prev) => ({
                                        ...prev,
                                        [q.id]: opt.letter,
                                      }))
                                    }
                                    className={cn(
                                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                                      selected
                                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                        : "border-border/70 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                    )}
                                  >
                                    {selected && (
                                      <Check className="h-3 w-3" />
                                    )}
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                      This is a preview — the full assessment covers 5 domains
                      across 26 questions.
                    </p>
                    <Button
                      onClick={() => setSubmitted(true)}
                      disabled={!allAnswered}
                      className="gap-2 rounded-full"
                    >
                      See my preview
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  {/* Score reveal */}
                  <div className="flex flex-col items-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      <Sparkles className="h-3 w-3" />
                      Your provisional tier
                    </span>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-4"
                    >
                      <div
                        className="text-6xl font-bold tabular-nums tracking-tighter"
                        style={{ color: tierMeta.color }}
                      >
                        {provisionalScore}
                        <span className="text-2xl font-medium text-muted-foreground">
                          /100
                        </span>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <Badge3D
                        label={tierMeta.label}
                        color={tierMeta.color}
                      />
                      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground text-balance">
                        {tierMeta.summary}
                      </p>
                    </motion.div>
                  </div>

                  {/* Dimension breakdown */}
                  <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
                    {QUICK_QUESTIONS.map((q) => {
                      const letter = answers[q.id];
                      const opt = letter ? q.options.find((o) => o.letter === letter) : undefined;
                      const pct = opt ? Math.round((opt.score / 3) * 100) : 0;
                      return (
                        <div
                          key={q.id}
                          className="rounded-xl border border-border/60 bg-background/50 p-3"
                        >
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {q.dimension === "governance"
                              ? "Governance"
                              : q.dimension === "risk"
                                ? "Risk"
                                : q.dimension === "execution"
                                  ? "Execution"
                                  : q.dimension === "reporting"
                                    ? "Reporting"
                                    : "Capability"}
                          </div>
                          <div className="mt-1 text-xl font-semibold tabular-nums text-foreground">
                            {pct}
                          </div>
                          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: tierMeta.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
                  >
                    <Button
                      size="lg"
                      onClick={() => navigate("benchmark-landing")}
                      className="gap-2 rounded-full"
                    >
                      Take the full assessment
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="ghost"
                      onClick={handleReset}
                      className="gap-2 rounded-full"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Try again
                    </Button>
                  </motion.div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    The full assessment covers all 5 audit capability domains,
                    plus a cohort percentile and per-domain radar chart.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

function Badge3D({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm"
      style={{
        backgroundColor: `color-mix(in oklch, ${color} 15%, transparent)`,
        color: color,
        boxShadow: `0 1px 2px color-mix(in oklch, ${color} 20%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}
