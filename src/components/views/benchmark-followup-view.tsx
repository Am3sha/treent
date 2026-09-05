"use client";

import * as React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  Users,
  FileText,
  Handshake,
  Loader2,
} from "lucide-react";
import { useNav } from "@/lib/store";
import { Reveal, Eyebrow } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/lib/i18n";
import {
  BENCHMARK_ARABIC_FOLLOWUP,
  type FollowupInterest,
} from "@/lib/translations/benchmark-ar";

type Interest = FollowupInterest;

const benchmarkFollowupFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  interest: z.enum(["consultation", "report", "workshop", "partnership"]),
});

type BenchmarkFollowupFormValues = z.infer<typeof benchmarkFollowupFormSchema>;

const INTERESTS: {
  value: Interest;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "consultation",
    label: "A 1:1 consultation",
    description:
      "A 30-minute call with a Trennt partner to pressure-test your results and shape a 90-day plan.",
    icon: Users,
  },
  {
    value: "report",
    label: "A written report",
    description:
      "A tailored write-up of your benchmark, with deeper analysis and prioritised recommendations.",
    icon: FileText,
  },
  {
    value: "workshop",
    label: "A team workshop",
    description:
      "Run the benchmark across your leadership team and debrief together with a Trennt facilitator.",
    icon: Sparkles,
  },
  {
    value: "partnership",
    label: "A longer partnership",
    description:
      "Embed Trennt to help close the gap between your current and target maturity, end to end.",
    icon: Handshake,
  },
];

export function BenchmarkFollowupView() {
  const result = useNav((s) => s.result);
  const respondent = useNav((s) => s.respondent);
  const navigate = useNav((s) => s.navigate);
  const { toast } = useToast();
  const { lang, isRTL } = useTranslation();
  const ui = BENCHMARK_ARABIC_FOLLOWUP;

  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BenchmarkFollowupFormValues>({
    resolver: zodResolver(benchmarkFollowupFormSchema),
    defaultValues: {
      name: respondent?.name ?? "",
      email: respondent?.email ?? "",
      company: respondent?.company ?? "",
      phone: "",
      message: "",
      interest: "consultation",
    },
  });

  const onSubmit = async (data: BenchmarkFollowupFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        assessmentId: result?.id ?? null,
        name: data.name.trim(),
        email: data.email.trim(),
        company: data.company?.trim() || null,
        phone: data.phone?.trim() || null,
        message: data.message?.trim() || null,
        interest: data.interest,
      };
      const res = await fetch("/api/assessment/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || "Submission failed");
      }
      setSubmitted(true);
      toast({
        title: lang === "ar" ? ui.toastSuccessTitle : "Request received",
        description: lang === "ar" ? ui.toastSuccessDesc : "A Trennt partner will be in touch within two business days.",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({
        title: lang === "ar" ? ui.toastErrorTitle : "Could not submit",
        description: lang === "ar" ? ui.toastErrorDesc(msg) : msg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <Confirmation onHome={() => navigate("home")} lang={lang} isRTL={isRTL} />;
  }

  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* HERO ---------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className={cn(
          "relative mx-auto max-w-4xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24",
          isRTL && "text-right"
        )}>
          <Reveal>
            <Eyebrow className={cn(isRTL && "flex justify-start")}>
              {lang === "ar" ? ui.heroEyebrow : "Take the next step"}
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className={cn(
              "mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:leading-[1.05]",
              isRTL && "font-medium"
            )}>
              {lang === "ar" ? (
                <>
                  {ui.heroTitleStart}
                  <span className="text-primary">
                    {ui.heroTitleAction}
                  </span>
                  {ui.heroTitleEnd}
                </>
              ) : (
                <>
                  Turn your benchmark into{" "}
                  <span className="text-primary">action.</span>
                </>
              )}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
              {lang === "ar" ? ui.heroSubtitle : (
                <>
                  Your score is the start of the conversation, not the end. Tell us
                  what would be most useful — a 1:1 consultation, a written report,
                  a team workshop, or a longer partnership — and we'll be in touch.
                </>
              )}
            </p>
          </Reveal>
        </div>
      </section>

      {/* FORM + ASIDE ------------------------------------------------- */}
      <section className={cn(
        "mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8",
        isRTL && "text-right"
      )}>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* FORM ----------------------------------------------------- */}
            <Reveal>
              <Card className="py-6">
                <CardHeader className="px-6 sm:px-8">
                  <CardTitle className="text-xl">
                    {lang === "ar" ? ui.formTitle : "Tell us what you need"}
                  </CardTitle>
                  <CardDescription>
                    {result
                      ? lang === "ar"
                        ? ui.formDesc(result.tier, result.overall)
                        : `We'll reference your benchmark (tier: ${result.tier}, score ${result.overall}/100) when we reach out.`
                      : lang === "ar"
                        ? ui.formDescNoResult
                        : "Fill in the form below and we will reach out to you as soon as possible."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 sm:px-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Interest selector */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        {lang === "ar" ? ui.interestLabel : "What would be most useful?"}
                      </Label>
                      <Controller
                        name="interest"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="grid gap-2 sm:grid-cols-2"
                          >
                            {INTERESTS.map((opt) => {
                              const checked = field.value === opt.value;
                              const arOpt = lang === "ar" ? ui.interests[opt.value] : null;
                              const label = arOpt ? arOpt.label : opt.label;
                              const desc = arOpt ? arOpt.description : opt.description;
                              return (
                                <label
                                  key={opt.value}
                                  htmlFor={`interest-${opt.value}`}
                                  className={cn(
                                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all",
                                    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
                                    checked
                                      ? "border-primary bg-primary/5 shadow-sm"
                                      : "border-border hover:border-primary/40 hover:bg-accent/30",
                                    isRTL && "flex-row-reverse"
                                  )}
                                >
                                  <RadioGroupItem
                                    value={opt.value}
                                    id={`interest-${opt.value}`}
                                    className="mt-0.5"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                                      <opt.icon
                                        className={cn(
                                          "h-4 w-4",
                                          checked
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                        )}
                                      />
                                      <span className="text-sm font-medium">
                                        {label}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                      {desc}
                                    </p>
                                  </div>
                                </label>
                              );
                            })}
                          </RadioGroup>
                        )}
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label={lang === "ar" ? ui.labelName : "Full name"} required lang={lang} isRTL={isRTL}>
                        <Input
                          {...register("name")}
                          placeholder={lang === "ar" ? ui.placeholderName : "Alex Morgan"}
                          autoComplete="name"
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">
                            {lang === "ar" ? ui.errorName : errors.name.message}
                          </p>
                        )}
                      </Field>
                      <Field label={lang === "ar" ? ui.labelEmail : "Work email"} required lang={lang} isRTL={isRTL}>
                        <Input
                          type="email"
                          {...register("email")}
                          placeholder={lang === "ar" ? ui.placeholderEmail : "alex@yourcompany.com"}
                          autoComplete="email"
                          dir="ltr"
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">
                            {lang === "ar" ? ui.errorEmail : errors.email.message}
                          </p>
                        )}
                      </Field>
                      <Field label={lang === "ar" ? ui.labelCompany : "Company"} lang={lang} isRTL={isRTL}>
                        <Input
                          {...register("company")}
                          placeholder={lang === "ar" ? ui.placeholderCompany : "Trennt Industries"}
                          autoComplete="organization"
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                      </Field>
                      <Field label={lang === "ar" ? ui.labelPhone : "Phone (optional)"} lang={lang} isRTL={isRTL}>
                        <Input
                          {...register("phone")}
                          placeholder={lang === "ar" ? ui.placeholderPhone : "+966 50 123 4567"}
                          autoComplete="tel"
                          dir="ltr"
                        />
                      </Field>
                      <Field
                        label={lang === "ar" ? ui.labelMessage : "Anything specific you'd like to discuss?"}
                        className="sm:col-span-2"
                        lang={lang}
                        isRTL={isRTL}
                      >
                        <Textarea
                          {...register("message")}
                          placeholder={lang === "ar" ? ui.placeholderMessage : "We're trying to figure out where to start with our data foundation…"}
                          rows={4}
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                      </Field>
                    </div>

                    <div className={cn(
                      "flex flex-col gap-3 border-t border-border pt-5",
                      "sm:flex-row sm:items-center sm:justify-between",
                      isRTL && "sm:flex-row-reverse"
                    )}>
                      <p className="text-xs text-muted-foreground">
                        {lang === "ar" ? ui.formNote : (
                          <>
                            We'll never share your details. Response within 2
                            business days.
                          </>
                        )}
                      </p>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={!isValid || submitting}
                        className={cn(
                          "gap-2 sm:min-w-[180px]",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {lang === "ar" ? ui.buttonSending : "Sending…"}
                          </>
                        ) : (
                          <>
                            {lang === "ar" ? ui.buttonSend : "Send request"}
                            <ArrowRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </Reveal>

          {/* ASIDE --------------------------------------------------- */}
            <Reveal delay={0.1}>
              <div className="space-y-5">
                <Card className="py-6">
                  <CardHeader className="px-6">
                    <CardTitle className="text-base">
                      {lang === "ar" ? ui.expectTitle : "What to expect"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6">
                    <ExpectRow
                      icon={Clock}
                      title={lang === "ar" ? ui.expect1Title : "Response within 2 business days"}
                      body={lang === "ar" ? ui.expect1Body : "A member of our partnerships team will reach out by email to schedule a call."}
                      isRTL={isRTL}
                    />
                    <ExpectRow
                      icon={Users}
                      title={lang === "ar" ? ui.expect2Title : "A senior partner, not a sales rep"}
                      body={lang === "ar" ? ui.expect2Body : "You'll speak with a practitioner who has run transformation programmes — not someone reading a script."}
                      isRTL={isRTL}
                    />
                    <ExpectRow
                      icon={MessageSquare}
                      title={lang === "ar" ? ui.expect3Title : "No obligation"}
                      body={lang === "ar" ? ui.expect3Body : "The conversation is useful whether or not you choose to work with us. We'll share a perspective on your focus areas either way."}
                      isRTL={isRTL}
                    />
                  </CardContent>
                </Card>

                <Card className="border-dashed bg-secondary/20 py-6 shadow-none">
                  <CardContent className="px-6">
                    <p className="text-sm font-medium">
                      {lang === "ar" ? ui.contactTitle : "Prefer email instead?"}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {lang === "ar" ? ui.contactDesc : "Reach us directly — we read every message."}
                    </p>
                    <a
                      href="mailto:info@trennt.sa"
                      className={cn(
                        "mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      <Mail className="h-4 w-4" />
                      info@trennt.sa
                    </a>
                    <a
                      href="tel:+966501234567"
                      className={cn(
                        "mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      <Phone className="h-3.5 w-3.5" />
                      +966 50 123 4567
                    </a>
                  </CardContent>
                </Card>
              </div>
            </Reveal>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Confirmation state
// ---------------------------------------------------------------------------

function Confirmation({
  onHome,
  lang,
  isRTL,
}: {
  onHome: () => void;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  const ui = BENCHMARK_ARABIC_FOLLOWUP;
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8",
        isRTL && "text-right [&_div]:text-right"
      )}
    >
      <Reveal>
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <Eyebrow className={cn("mt-6", isRTL ? "flex justify-start" : "justify-center")}>
          {lang === "ar" ? ui.confirmEyebrow : "Request received"}
        </Eyebrow>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {lang === "ar"
            ? ui.confirmTitle
            : "Thanks — a Trennt partner will be in touch within two business days."}
        </h1>
        <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground">
          {lang === "ar"
            ? ui.confirmDesc
            : (
              <>
                We'll review your benchmark and come prepared with a perspective on
                where to start. In the meantime, you can return to the homepage or
                revisit your results at any time.
              </>
            )}
        </p>
        <div className={cn(
          "mt-8 flex flex-col gap-3",
          "sm:flex-row sm:items-center sm:justify-center",
          isRTL && "sm:flex-row-reverse"
        )}>
          <Button onClick={onHome} className={cn("gap-2 rounded-full", isRTL && "flex-row-reverse")}>
            {lang === "ar" ? ui.confirmHome : "Back to home"}
            <ArrowRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Field({
  label,
  required,
  children,
  className,
  lang,
  isRTL,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-xs font-medium text-foreground">
        {label}
        {required && (
          <span className={cn("text-primary", isRTL ? "mr-0.5" : "ml-0.5")}>*</span>
        )}
      </Label>
      {children}
    </div>
  );
}

function ExpectRow({
  icon: IconCmp,
  title,
  body,
  isRTL,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  isRTL: boolean;
}) {
  return (
    <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <IconCmp className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </div>
  );
}
