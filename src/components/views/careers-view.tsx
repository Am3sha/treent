"use client";

import * as React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";
import { useNav } from "@/lib/store";
import { CAREERS, PERKS } from "@/lib/content";
import type { CareerItem } from "@/lib/types";
import { Icon } from "@/components/site/icon";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const applicationFormSchema = z.object({
  name: z.string().min(1, "Please tell us your name."),
  email: z.string().email("That doesn't look like a valid email."),
  phone: z.string().optional(),
  yearsExp: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
      "Enter a valid number of years."
    ),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  message: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;


const CULTURE_VALUES = [
  {
    title: "Senior by default",
    description:
      "We hire people who can run work, not staff them onto someone else's. Every consultant owns their workstreams from week one.",
    icon: "Compass",
  },
  {
    title: "Apprenticeship, not curriculum",
    description:
      "You learn by sitting next to a partner who has done it ten times. We invest in protected learning time, not training theatres.",
    icon: "GraduationCap",
  },
  {
    title: "One firm, four offices",
    description:
      "Small enough that the partners know your work. Large enough that the next engagement can be in a different city, sector, or practice.",
    icon: "Building2",
  },
  {
    title: "Life outside the deck",
    description:
      "We don't glamourise hours. We expect you to use your parental leave, your sabbatical, and your four work-from-anywhere weeks.",
    icon: "HeartHandshake",
  },
];



export function CareersView() {
  const navigate = useNav((s) => s.navigate);
  const { toast } = useToast();
  const [activeRole, setActiveRole] = React.useState<CareerItem | null>(null);

  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="careers-hero-heading"
        className="relative overflow-hidden border-b border-border/60"
      >
        <div className="absolute inset-0 bg-radial-fade" aria-hidden />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <Eyebrow>Careers at Trennt</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  id="careers-hero-heading"
                  className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.02]"
                >
                  Build a career on{" "}
                  <span className="text-primary">work that outlasts you.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
                  We hire senior practitioners who want to own outcomes, mentor
                  the next generation, and build a firm they&apos;re proud of.
                  Small teams, real work, no theatre.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    onClick={() => {
                      const el = document.getElementById("open-roles");
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="h-11 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-sm hover:bg-primary/90"
                  >
                    See open roles
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("contact")}
                    className="h-11 gap-2 rounded-full border-border/70 px-6 hover:bg-accent hover:text-accent-foreground"
                  >
                    Open application
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* OPEN ROLES                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="open-roles"
        aria-labelledby="open-roles-heading"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Open roles"
            title="Five roles, currently open."
            description="We hire deliberately. If a role isn't here, it isn't open — but we still read open applications."
            className="max-w-2xl"
          />
        </div>

        <div className="mt-12">
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            {CAREERS.map((role, i) => (
              <Reveal key={role.slug} delay={Math.min(i * 0.04, 0.2)}>
                <AccordionItem
                  value={role.slug}
                  className="overflow-hidden rounded-2xl border border-border/70 bg-card px-5 transition-all first:border-b data-[state=open]:border-primary/30 data-[state=open]:shadow-sm sm:px-7"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex w-full flex-col items-start gap-3 py-2 pr-4 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <div className="flex items-start gap-4">
                        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                          <Briefcase className="h-4 w-4" />
                        </span>
                        <div>
                          <h3 className="text-base font-semibold tracking-tight text-foreground">
                            {role.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {role.team} · {role.level}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="rounded-full border-border/70 text-xs font-medium"
                        >
                          <MapPin className="mr-1 h-3 w-3" />
                          {role.location}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="rounded-full text-xs font-medium"
                        >
                          {role.type}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-8 py-2 sm:grid-cols-2">
                      <div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {role.summary}
                        </p>
                        <div className="mt-6">
                          <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
                            What you&apos;ll own
                          </div>
                          <ul className="mt-3 space-y-2.5">
                            {role.responsibilities.map((r) => (
                              <li
                                key={r}
                                className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90"
                              >
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          What we&apos;re looking for
                        </div>
                        <ul className="mt-3 space-y-2.5">
                          {role.requirements.map((r) => (
                            <li
                              key={r}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                            >
                              <span
                                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/50"
                                aria-hidden
                              />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6">
                          <Button
                            onClick={() => setActiveRole(role)}
                            className="h-10 gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-sm hover:bg-primary/90"
                          >
                            Apply for this role
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Reveal>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* PERKS                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="perks-heading"
        className="border-y border-border/60 bg-secondary/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <SectionHeading
            eyebrow="Perks & benefits"
            title="Designed for careers, not contracts."
            description="A benefit set that says: we expect you to be here in ten years, and to have a life outside the firm while you do."
            className="max-w-2xl"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.06}>
                <div className="flex h-full flex-col rounded-xl border border-border/70 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CULTURE                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="culture-heading"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Our culture"
              title="Small firm, long careers, real ownership."
            />
            <Reveal delay={0.05}>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Trennt is a partnership in the old sense: the people who own
                the firm are the people who do the work. That shapes everything
                — how we hire, how we promote, how we behave on engagements. We
                are deliberately small, deliberately senior, and deliberately
                independent.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                If you want to be a generalist who can run a board readout on
                Monday and a process map on Wednesday, this is the place. If you
                want a clear ladder to climb, it isn&apos;t.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {CULTURE_VALUES.map((v, i) => (
                <Reveal key={v.title} delay={(i % 2) * 0.06}>
                  <div className="flex h-full flex-col rounded-xl border border-border/70 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <Icon name={v.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold tracking-tight">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {v.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="careers-cta-heading"
        className="border-t border-border/60 bg-secondary/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-8 sm:p-12 md:p-16">
              <div
                className="absolute inset-0 -z-10 bg-radial-fade opacity-80"
                aria-hidden
              />
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <Eyebrow>Don&apos;t see your role?</Eyebrow>
                  <h2
                    id="careers-cta-heading"
                    className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
                  >
                    Send an open application.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-balance">
                    We read every open application that comes in. If you&apos;ve
                    done the work and want to do it somewhere smaller and more
                    senior, tell us.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                  <Button
                    size="lg"
                    onClick={() => navigate("contact")}
                    className="h-11 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-sm hover:bg-primary/90"
                  >
                    Send open application
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* APPLICATION DIALOG                                                  */}
      {/* ------------------------------------------------------------------ */}
      <ApplicationDialog
        role={activeRole}
        onClose={() => setActiveRole(null)}
        onSubmitted={(name) => {
          toast({
            title: "Application received",
            description: `Thanks, ${name}. We'll review and be in touch within five business days.`,
          });
          setActiveRole(null);
        }}
        onError={(msg) => {
          toast({
            title: "Couldn't submit your application",
            description: msg,
            variant: "destructive",
          });
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Apply Dialog
// ---------------------------------------------------------------------------

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}

function ApplicationDialog({
  role,
  onClose,
  onSubmitted,
  onError,
}: {
  role: CareerItem | null;
  onClose: () => void;
  onSubmitted: (name: string) => void;
  onError: (msg: string) => void;
}) {
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      yearsExp: "",
      linkedin: "",
      portfolio: "",
      message: "",
    },
  });

  // Reset form whenever a new role is opened
  React.useEffect(() => {
    if (role) {
      reset({
        name: "",
        email: "",
        phone: "",
        yearsExp: "",
        linkedin: "",
        portfolio: "",
        message: "",
      });
    }
  }, [role, reset]);

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!role) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone?.trim() || undefined,
          roleSlug: role.slug,
          roleTitle: role.title,
          yearsExp: data.yearsExp ? Number(data.yearsExp) : undefined,
          linkedin: data.linkedin?.trim() || undefined,
          portfolio: data.portfolio?.trim() || undefined,
          message: data.message?.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Request failed");
      }
      const result = (await res.json()) as { ok: true; data: { id: string } };
      onSubmitted(data.name.trim().split(" ")[0]);
      // Use the id if you want; keep onSubmitted signature simple
      void result.data.id;
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or email us directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={!!role}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl tracking-tight">
            Apply for {role?.title}
          </DialogTitle>
          <DialogDescription>
            {role?.team} · {role?.location} · {role?.type} · {role?.level}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apply-name">
                Full name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="apply-name"
                {...register("name")}
                autoComplete="name"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apply-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="apply-email"
                type="email"
                {...register("email")}
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apply-phone">Phone</Label>
              <Input
                id="apply-phone"
                {...register("phone")}
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apply-years">Years of experience</Label>
              <Input
                id="apply-years"
                type="number"
                min={0}
                max={50}
                {...register("yearsExp")}
                placeholder="e.g. 7"
                aria-invalid={!!errors.yearsExp}
              />
              {errors.yearsExp && (
                <p className="text-xs text-destructive">{errors.yearsExp.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apply-linkedin">LinkedIn URL</Label>
              <Input
                id="apply-linkedin"
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apply-portfolio">Portfolio / GitHub</Label>
              <Input
                id="apply-portfolio"
                {...register("portfolio")}
                placeholder="https://…"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apply-message">
              Why Trennt, and why this role?
            </Label>
            <Textarea
              id="apply-message"
              {...register("message")}
              placeholder="A few sentences on what you're looking for and what you'd bring."
              className="min-h-28 resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Optional, but it&apos;s the first thing we read.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={submitting}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="gap-2 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
