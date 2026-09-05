"use client";

import * as React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  FileText,
  Loader2,
  MapPin,
  Send,
  Upload,
  X,
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



const GENERAL_APPLICATION_ROLE: CareerItem = {
  slug: "general-application",
  title: { en: "General Application", ar: "تقديم طلب عام" },
  team: { en: "All Fields & Specialties", ar: "جميع المجالات والتخصصات" },
  level: { en: "All Levels", ar: "كافة المستويات" },
  location: { en: "Riyadh, KSA", ar: "الرياض، المملكة العربية السعودية" },
  type: "Full-time",
  summary: {
    en: "We welcome applications across all fields—including Internal Audit, IT, AI, Strategy, and Advisory. Submit your CV and details for current or upcoming opportunities.",
    ar: "نرحب بالتقديم من كافة التخصصات والمجالات (المراجعة الداخلية، تقنية المعلومات، الذكاء الاصطناعي، الاستراتيجية، وغيرها). يمكنك تقديم بياناتك وسيرتك الذاتية للفرص الحالية والمستقبلية."
  },
  responsibilities: [],
  requirements: [],
};

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
                    onClick={() => setActiveRole(GENERAL_APPLICATION_ROLE)}
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
      {/* OPEN ROLES / GENERAL APPLICATION                                    */}
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

        <Reveal>
          <div className="mt-12 overflow-hidden rounded-2xl border border-border/70 bg-card p-6 sm:p-8 transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Send className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {t('careers.roles.card_title')}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground/90">
                    {t('careers.roles.card_description')}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Button
                  onClick={() => setActiveRole(GENERAL_APPLICATION_ROLE)}
                  size="lg"
                  className="h-11 gap-2 rounded-full bg-primary px-7 text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  {t('careers.roles.apply_button')}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
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
  const { t, l, lang } = useTranslation();
  const [submitting, setSubmitting] = React.useState(false);
  const [cvFile, setCvFile] = React.useState<File | null>(null);
  const [cvDataUrl, setCvDataUrl] = React.useState<string | null>(null);
  const [cvError, setCvError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
        message: "",
      });
      setCvFile(null);
      setCvDataUrl(null);
      setCvError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [role, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCvFile(null);
      setCvDataUrl(null);
      setCvError(null);
      return;
    }
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (ext !== ".pdf" && ext !== ".docx") {
      setCvError(t('careers.form.errors.cv_invalid_type'));
      setCvFile(null);
      setCvDataUrl(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError(t('careers.form.errors.cv_invalid_size'));
      setCvFile(null);
      setCvDataUrl(null);
      return;
    }
    setCvError(null);
    setCvFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setCvDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setCvFile(null);
    setCvDataUrl(null);
    setCvError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!role) return;
    if (cvError) return;

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
          resume: cvDataUrl || undefined,
          message: data.message?.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Request failed");
      }
      onSubmitted(data.name.trim().split(" ")[0]);
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
      <DialogContent className="max-h-[82vh] overflow-y-auto rounded-3xl border border-border/80 bg-background/95 p-4 shadow-2xl backdrop-blur-xl sm:max-w-[410px] sm:p-5 text-foreground">
        <DialogHeader className="text-right rtl:text-right ltr:text-left">
          <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
            {role?.slug === "general-application"
              ? (lang === "ar" ? "تقديم طلب الانضمام" : "General Application")
              : `${t('careers.form.title')} ${l(role?.title)}`}
          </DialogTitle>
          {role?.slug !== "general-application" && (
            <DialogDescription className="mt-0.5 text-[11px] text-muted-foreground">
              {l(role?.team)} · {l(role?.location)} · {role?.type} · {l(role?.level)}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-2.5" noValidate>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="apply-name" className="text-[11px] font-medium text-foreground">
                {t('careers.form.labels.name')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="apply-name"
                {...register("name")}
                autoComplete="name"
                className="h-8.5 rounded-xl text-xs"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-[10px] text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="apply-email" className="text-[11px] font-medium text-foreground">
                {t('careers.form.labels.email')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="apply-email"
                type="email"
                {...register("email")}
                autoComplete="email"
                className="h-8.5 rounded-xl text-xs"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-[10px] text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="apply-phone" className="text-[11px] font-medium text-foreground">{t('careers.form.labels.phone')}</Label>
              <Input
                id="apply-phone"
                {...register("phone")}
                autoComplete="tel"
                className="h-8.5 rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="apply-years" className="text-[11px] font-medium text-foreground">{t('careers.form.labels.experience')}</Label>
              <Input
                id="apply-years"
                type="number"
                min={0}
                max={50}
                {...register("yearsExp")}
                className="h-8.5 rounded-xl text-xs"
                aria-invalid={!!errors.yearsExp}
              />
              {errors.yearsExp && (
                <p className="text-[10px] text-destructive">{errors.yearsExp.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="apply-linkedin" className="text-[11px] font-medium text-foreground">{t('careers.form.labels.linkedin')}</Label>
            <Input
              id="apply-linkedin"
              {...register("linkedin")}
              className="h-8.5 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="apply-cv" className="text-[11px] font-medium text-foreground">
              {t('careers.form.labels.cv')}
            </Label>
            <input
              ref={fileInputRef}
              id="apply-cv"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              onChange={handleFileChange}
              className="hidden"
            />

            {!cvFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-dashed border-border/80 bg-muted/20 px-3 py-2 text-left transition-all hover:border-primary/50 hover:bg-primary/5 rtl:text-right"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {t('careers.form.placeholders.cv')}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      PDF / DOCX (Max 5MB)
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-border/70 bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {lang === "ar" ? "اختر ملفاً" : "Browse"}
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-2 px-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <div className="truncate">
                    <p className="truncate text-xs font-medium text-foreground">
                      {cvFile.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove CV"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {cvError && (
              <p className="text-[10px] font-medium text-destructive">{cvError}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="apply-message" className="text-[11px] font-medium text-foreground">
              {t('careers.form.labels.message')}
            </Label>
            <Textarea
              id="apply-message"
              {...register("message")}
              className="min-h-14 resize-y rounded-xl text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              {t('careers.form.labels.optional')}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-1.5 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={submitting}
              className="h-8.5 rounded-full text-xs"
            >
              {t('careers.form.buttons.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-8.5 gap-2 rounded-full bg-primary text-xs text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t('careers.form.buttons.submitting')}
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
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
