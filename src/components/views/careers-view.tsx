"use client";

import * as React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Loader2,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useNav } from "@/lib/store";
import { PERKS } from "@/lib/content";
import type { CareerItem } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { Icon } from "@/components/site/icon";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


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
        className="relative overflow-hidden bg-[#003D3C] text-white py-16 lg:py-24 border-b border-white/10"
      >
        <div className="section-shell relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal y={14} duration={0.55}>
                <div className="text-[16px] sm:text-[18px] font-bold uppercase tracking-[0.18em] text-[#ADDFB3]">
                  {t('careers.hero.eyebrow')}
                </div>
              </Reveal>
              <Reveal y={14} duration={0.55} delay={0.05}>
                <h1
                  id="careers-hero-heading"
                  className="mt-4 text-[38px] sm:text-[52px] md:text-[60px] font-bold leading-[1.08] tracking-tight text-white"
                >
                  {t('careers.hero.heading')}{" "}
                  {t('careers.hero.heading_accent') && (
                    <span className="text-[#ADDFB3]">{t('careers.hero.heading_accent')}</span>
                  )}
                </h1>
              </Reveal>
              <Reveal y={14} duration={0.55} delay={0.1}>
                <p className="mt-6 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-white/80">
                  {t('careers.hero.description')}
                </p>
              </Reveal>
              <Reveal y={14} duration={0.55} delay={0.15}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    onClick={() => {
                      const el = document.getElementById("open-roles");
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="h-11 gap-2 rounded-full bg-[#ADDFB3] px-6 text-[14px] font-semibold text-[#003D3C] hover:bg-[#c2e8c4] transition-all"
                  >
                    {t('careers.hero.cta_roles')}
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setActiveRole(GENERAL_APPLICATION_ROLE)}
                    className="h-11 gap-2 rounded-full border-white/20 bg-white/10 px-6 text-[14px] font-semibold text-white hover:bg-white hover:text-[#003D3C] transition-all"
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
        className="section-shell scroll-mt-20 py-20 lg:py-28"
      >
        <Reveal y={14} duration={0.55}>
          <div className="max-w-3xl">
            <h2
              id="open-roles-heading"
              className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-[#121212] leading-[1.15] tracking-tight"
            >
              {t('careers.roles.title')}
            </h2>
            <p className="mt-4 text-[16px] sm:text-[18px] text-gray-600 leading-relaxed">
              {t('careers.roles.description')}
            </p>
          </div>
        </Reveal>

        <Reveal y={14} duration={0.55} delay={0.08}>
          <div className="mt-10 overflow-hidden rounded-[20px] border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:border-[#003D3C]/30 hover:shadow-md">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4F2] text-[#003D3C]">
                  <Send className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[20px] font-bold text-[#121212] tracking-tight">
                    {t('careers.roles.card_title')}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[14px] sm:text-[15px] leading-relaxed text-gray-600">
                    {t('careers.roles.card_description')}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Button
                  onClick={() => setActiveRole(GENERAL_APPLICATION_ROLE)}
                  size="lg"
                  className="h-11 gap-2 rounded-full bg-[#ADDFB3] px-7 text-[14px] font-semibold text-[#003D3C] hover:bg-[#c2e8c4] transition-all"
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
        className="bg-[#F8F9FA] py-20 lg:py-28 border-y border-gray-100"
      >
        <div className="section-shell">
          <Reveal y={14} duration={0.55}>
            <div className="max-w-3xl">
              <h2
                id="perks-heading"
                className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-[#121212] leading-[1.15] tracking-tight"
              >
                {t('careers.perks.title')}
              </h2>
              <p className="mt-4 text-[16px] sm:text-[18px] text-gray-600 leading-relaxed">
                {t('careers.perks.description')}
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((p, i) => (
              <Reveal key={i} y={14} duration={0.55} delay={(i % 3) * 0.06}>
                <div className="flex h-full flex-col rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#003D3C]/30 hover:shadow-md">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#EEF4F2] text-[#003D3C]">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[18px] font-bold text-[#121212] tracking-tight">
                    {l(p.title)}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-600">
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
        className="section-shell py-20 lg:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5">
            <Reveal y={14} duration={0.55}>
              <h2
                id="culture-heading"
                className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-[#121212] leading-[1.15] tracking-tight"
              >
                {t('careers.culture.title')}
              </h2>
              <p className="mt-6 text-[16px] sm:text-[18px] leading-relaxed text-gray-600">
                {t('careers.culture.p1')}
              </p>
              <p className="mt-4 text-[16px] sm:text-[18px] leading-relaxed text-gray-600">
                {t('careers.culture.p2')}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-6 sm:grid-cols-2">
              {CULTURE_VALUES.map((v, i) => (
                <Reveal key={i} y={14} duration={0.55} delay={(i % 2) * 0.06}>
                  <div className="flex h-full flex-col rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#003D3C]/30 hover:shadow-md">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#EEF4F2] text-[#003D3C]">
                      <Icon name={v.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-[18px] font-bold text-[#121212] tracking-tight">
                      {l(v.title)}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-gray-600">
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
        className="bg-[#003D3C] text-white py-20 lg:py-28"
      >
        <div className="section-shell">
          <Reveal y={14} duration={0.55}>
            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-8 sm:p-12 md:p-16 backdrop-blur-md">
              <div className="grid items-center gap-10 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <div className="text-[14px] font-semibold text-[#ADDFB3] tracking-wide">
                    {t('careers.cta.eyebrow')}
                  </div>
                  <h2
                    id="careers-cta-heading"
                    className="mt-3 text-[32px] sm:text-[44px] font-bold text-white leading-tight"
                  >
                    {t('careers.cta.title')}
                  </h2>
                  <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/80">
                    {t('careers.cta.description')}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
                  <Button
                    size="lg"
                    onClick={() => navigate("contact")}
                    className="h-11 gap-2 rounded-full bg-[#ADDFB3] px-6 text-[14px] font-semibold text-[#003D3C] hover:bg-[#c2e8c4] transition-all"
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

interface CvState {
  file: File | null;
  dataUrl: string | null;
  error: string | null;
}

const EMPTY_CV: CvState = { file: null, dataUrl: null, error: null };

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
  // One state object instead of three parallel useState setters: the reset
  // effect (below) used to fire three synchronous setStates and trigger
  // cascading re-renders (eslint react-hooks/set-state-in-effect).
  const [cv, setCv] = React.useState<CvState>(EMPTY_CV);
  const { file: cvFile, dataUrl: cvDataUrl, error: cvError } = cv;
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

  // Clear the CV state when a different role is opened. Render-phase
  // adjustment (setState-during-render with previous-value comparison)
  // instead of an effect, so no cascading render is triggered. Gated on the
  // new role being non-null so closing the dialog doesn't blank the content
  // mid exit-animation (matches the previous effect's `if (role)` semantics).
  const [prevRole, setPrevRole] = React.useState(role);
  if (role !== prevRole) {
    setPrevRole(role);
    if (role) setCv(EMPTY_CV);
  }

  // Reset the typed form fields whenever a new role is opened.
  // (RHF's reset() is not React setState, so this effect does not cascade.)
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [role, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCv(EMPTY_CV);
      return;
    }
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (ext !== ".pdf" && ext !== ".docx") {
      setCv({ ...EMPTY_CV, error: t('careers.form.errors.cv_invalid_type') });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCv({ ...EMPTY_CV, error: t('careers.form.errors.cv_invalid_size') });
      return;
    }
    setCv({ file, dataUrl: null, error: null });
    const reader = new FileReader();
    reader.onload = () => {
      setCv((prev) => ({ ...prev, dataUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setCv(EMPTY_CV);
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
              autoComplete="url"
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
