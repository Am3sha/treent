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

type Interest = "consultation" | "report" | "workshop" | "partnership";

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
        title: "Request received",
        description: "A Trennt partner will be in touch within two business days.",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({
        title: "Could not submit",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <Confirmation onHome={() => navigate("home")} />;
  }

  return (
    <div className="relative">
      {/* HERO ---------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
          <Reveal>
            <Eyebrow>Take the next step</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:leading-[1.05]">
              Turn your benchmark into{" "}
              <span className="text-primary">action.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
              Your score is the start of the conversation, not the end. Tell us
              what would be most useful — a 1:1 consultation, a written report,
              a team workshop, or a longer partnership — and we'll be in touch.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FORM + ASIDE ------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* FORM ----------------------------------------------------- */}
            <Reveal>
              <Card className="py-6">
                <CardHeader className="px-6 sm:px-8">
                  <CardTitle className="text-xl">Tell us what you need</CardTitle>
                  <CardDescription>
                    {result
                      ? `We'll reference your benchmark (tier: ${result.tier}, score ${result.overall}/100) when we reach out.`
                      : "Fill in the form below and we will reach out to you as soon as possible."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 sm:px-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Interest selector */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        What would be most useful?
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
                              return (
                                <label
                                  key={opt.value}
                                  htmlFor={`interest-${opt.value}`}
                                  className={cn(
                                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all",
                                    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
                                    checked
                                      ? "border-primary bg-primary/5 shadow-sm"
                                      : "border-border hover:border-primary/40 hover:bg-accent/30"
                                  )}
                                >
                                  <RadioGroupItem
                                    value={opt.value}
                                    id={`interest-${opt.value}`}
                                    className="mt-0.5"
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <opt.icon
                                        className={cn(
                                          "h-4 w-4",
                                          checked
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                        )}
                                      />
                                      <span className="text-sm font-medium">
                                        {opt.label}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                      {opt.description}
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
                      <Field label="Full name" required>
                        <Input
                          {...register("name")}
                          placeholder="Alex Morgan"
                          autoComplete="name"
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">
                            {errors.name.message}
                          </p>
                        )}
                      </Field>
                      <Field label="Work email" required>
                        <Input
                          type="email"
                          {...register("email")}
                          placeholder="alex@yourcompany.com"
                          autoComplete="email"
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </Field>
                      <Field label="Company">
                        <Input
                          {...register("company")}
                          placeholder="Trennt Industries"
                          autoComplete="organization"
                        />
                      </Field>
                      <Field label="Phone (optional)">
                        <Input
                          {...register("phone")}
                          placeholder="+966 50 123 4567"
                          autoComplete="tel"
                        />
                      </Field>
                      <Field
                        label="Anything specific you'd like to discuss?"
                        className="sm:col-span-2"
                      >
                        <Textarea
                          {...register("message")}
                          placeholder="We're trying to figure out where to start with our data foundation…"
                          rows={4}
                        />
                      </Field>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        We'll never share your details. Response within 2
                        business days.
                      </p>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={!isValid || submitting}
                        className="gap-2 sm:min-w-[180px]"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send request
                            <ArrowRight className="h-4 w-4" />
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
                      What to expect
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6">
                    <ExpectRow
                      icon={Clock}
                      title="Response within 2 business days"
                      body="A member of our partnerships team will reach out by email to schedule a call."
                    />
                    <ExpectRow
                      icon={Users}
                      title="A senior partner, not a sales rep"
                      body="You'll speak with a practitioner who has run transformation programmes — not someone reading a script."
                    />
                    <ExpectRow
                      icon={MessageSquare}
                      title="No obligation"
                      body="The conversation is useful whether or not you choose to work with us. We'll share a perspective on your focus areas either way."
                    />
                  </CardContent>
                </Card>

                <Card className="border-dashed bg-secondary/20 py-6 shadow-none">
                  <CardContent className="px-6">
                    <p className="text-sm font-medium">Prefer email instead?</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      Reach us directly — we read every message.
                    </p>
                    <a
                      href="mailto:info@trennt.sa"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      info@trennt.sa
                    </a>
                    <a
                      href="tel:+442079460312"
                      className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
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

function Confirmation({ onHome }: { onHome: () => void }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <Reveal>
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <Eyebrow className="mt-6 justify-center">Request received</Eyebrow>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Thanks — a Trennt partner will be in touch within two business days.
        </h1>
        <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground">
          We'll review your benchmark and come prepared with a perspective on
          where to start. In the meantime, you can return to the homepage or
          revisit your results at any time.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button onClick={onHome} className="gap-2 rounded-full">
            Back to home
            <ArrowRight className="h-4 w-4" />
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
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-xs font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </Label>
      {children}
    </div>
  );
}

function ExpectRow({
  icon: IconCmp,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
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
