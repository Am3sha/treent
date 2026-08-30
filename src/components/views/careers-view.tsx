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
import { useTranslation } from "@/lib/i18n";
import { Icon } from "@/components/site/icon";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    title: { en: "Professional Judgement", ar: "الحكم المهني" },
    description: {
      en: "We expect our people to apply sound judgement, challenge appropriately, and maintain objectivity.",
      ar: "نتوقع من فريقنا تطبيق حكم مهني سليم، وممارسة التحدي المهني عند الحاجة، والمحافظة على الموضوعية."
    },
    icon: "Compass",
  },
  {
    title: { en: "Quality and Accountability", ar: "الجودة والمسؤولية" },
    description: {
      en: "Each team member is accountable for the quality, accuracy, and professionalism of their work.",
      ar: "كل عضو في الفريق مسؤول عن جودة ودقة ومهنية عمله."
    },
    icon: "GraduationCap",
  },
  {
    title: { en: "Collaboration", ar: "التعاون" },
    description: {
      en: "Engagements are delivered through close coordination, clear responsibilities, and effective review.",
      ar: "تُنفذ المهام من خلال تنسيق واضح، ومسؤوليات محددة، ومراجعة مهنية فعالة."
    },
    icon: "Building2",
  },
  {
    title: { en: "Continuous Learning", ar: "التعلم المستمر" },
    description: {
      en: "Professional development is part of how we maintain and strengthen our internal audit capability.",
      ar: "يمثل التطوير المهني جزءًا أساسيًا من المحافظة على قدراتنا وتعزيزها في المراجعة الداخلية."
    },
    icon: "HeartHandshake",
  },
];



export function CareersView() {
  const { t, l, lang } = useTranslation();
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
                <Eyebrow>{t('careers.hero.eyebrow')}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  id="careers-hero-heading"
                  className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.02]"
                >
                  {t('careers.hero.heading')}{" "}
                  <span className="text-primary">{t('careers.hero.heading_accent')}</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
                  {t('careers.hero.description')}
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
                    {t('careers.hero.cta_roles')}
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("contact")}
                    className="h-11 gap-2 rounded-full border-border/70 px-6 hover:bg-accent hover:text-accent-foreground"
                  >
                    {t('careers.hero.cta_apply')}
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
            eyebrow={t('careers.roles.eyebrow')}
            title={t('careers.roles.title')}
            description={t('careers.roles.description')}
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
                            {l(role.title)}
                          </h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {l(role.team)} · {l(role.level)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="rounded-full border-border/70 text-xs font-medium"
                        >
                          <MapPin className="mr-1 h-3 w-3" />
                          {l(role.location)}
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
                          {l(role.summary)}
                        </p>
                        <div className="mt-6">
                          <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
                            {t('careers.roles.responsibilities')}
                          </div>
                          <ul className="mt-3 space-y-2.5">
                            {role.responsibilities.map((r, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90"
                              >
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span>{l(r)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          {t('careers.roles.requirements')}
                        </div>
                        <ul className="mt-3 space-y-2.5">
                          {role.requirements.map((r, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                            >
                              <span
                                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/50"
                                aria-hidden
                              />
                              <span>{l(r)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6">
                          <Button
                            onClick={() => setActiveRole(role)}
                            className="h-10 gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-sm hover:bg-primary/90"
                          >
                            {t('careers.roles.apply_button')}
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
            eyebrow={t('careers.perks.eyebrow')}
            title={t('careers.perks.title')}
            description={t('careers.perks.description')}
            className="max-w-2xl"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((p, i) => (
              <Reveal key={i} delay={(i % 3) * 0.06}>
                <div className="flex h-full flex-col rounded-xl border border-border/70 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold tracking-tight">
                    {l(p.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {l(p.description)}
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
              eyebrow={t('careers.culture.eyebrow')}
              title={t('careers.culture.title')}
            />
            <Reveal delay={0.05}>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {t('careers.culture.p1')}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {t('careers.culture.p2')}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {CULTURE_VALUES.map((v, i) => (
                <Reveal key={i} delay={(i % 2) * 0.06}>
                  <div className="flex h-full flex-col rounded-xl border border-border/70 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <Icon name={v.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold tracking-tight">
                      {l(v.title)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {l(v.description)}
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
                  <Eyebrow>{t('careers.cta.eyebrow')}</Eyebrow>
                  <h2
                    id="careers-cta-heading"
                    className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
                  >
                    {t('careers.cta.title')}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-balance">
                    {t('careers.cta.description')}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                  <Button
                    size="lg"
                    onClick={() => navigate("contact")}
                    className="h-11 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-sm hover:bg-primary/90"
                  >
                    {t('careers.cta.button')}
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
            title: t('careers.form.success_title'),
            description: t('careers.form.success_desc', { name }),
          });
          setActiveRole(null);
        }}
        onError={(msg) => {
          toast({
            title: t('careers.form.error_title'),
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
  const { t, l } = useTranslation();
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
          roleTitle: l(role.title),
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
            {t('careers.form.title')} {l(role?.title)}
          </DialogTitle>
          <DialogDescription>
            {l(role?.team)} · {l(role?.location)} · {role?.type} · {l(role?.level)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apply-name">
                {t('careers.form.labels.name')} <span className="text-destructive">*</span>
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
                {t('careers.form.labels.email')} <span className="text-destructive">*</span>
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
              <Label htmlFor="apply-phone">{t('careers.form.labels.phone')}</Label>
              <Input
                id="apply-phone"
                {...register("phone")}
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apply-years">{t('careers.form.labels.experience')}</Label>
              <Input
                id="apply-years"
                type="number"
                min={0}
                max={50}
                {...register("yearsExp")}
                placeholder={t('careers.form.placeholders.experience')}
                aria-invalid={!!errors.yearsExp}
              />
              {errors.yearsExp && (
                <p className="text-xs text-destructive">{errors.yearsExp.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apply-linkedin">{t('careers.form.labels.linkedin')}</Label>
              <Input
                id="apply-linkedin"
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apply-portfolio">{t('careers.form.labels.portfolio')}</Label>
              <Input
                id="apply-portfolio"
                {...register("portfolio")}
                placeholder="https://…"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apply-message">
              {t('careers.form.labels.message')}
            </Label>
            <Textarea
              id="apply-message"
              {...register("message")}
              placeholder={t('careers.form.placeholders.message')}
              className="min-h-28 resize-y"
            />
            <p className="text-xs text-muted-foreground">
              {t('careers.form.labels.optional')}
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
              {t('careers.form.buttons.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="gap-2 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('careers.form.buttons.submitting')}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t('careers.form.buttons.submit')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
