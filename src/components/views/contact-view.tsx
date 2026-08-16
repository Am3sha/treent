"use client";

import * as React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useNav } from "@/lib/store";
import { COMPANY } from "@/lib/content";
import { Reveal, useReducedMotion, EASE_OUT } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Topic = "general" | "services" | "framework" | "other";

const TOPICS: { value: Topic; label: string; hint: string }[] = [
  { value: "general", label: "General enquiry", hint: "Anything else on your mind." },
  {
    value: "services",
    label: "Engagement enquiry",
    hint: "Discuss a specific internal audit service.",
  },
  {
    value: "framework",
    label: "Framework agreement",
    hint: "Discuss a framework agreement for ongoing services.",
  },
  { value: "other", label: "Other", hint: "Other questions or requests." },
];

const contactFormSchema = z.object({
  name: z.string().min(1, "Please tell us your name."),
  email: z.string().email("That doesn't look like a valid email."),
  company: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[\d\s\-()]{6,30}$/.test(val),
      "Phone can only include digits, +, spaces, dashes, and parentheses."
    ),
  topic: z.enum(["general", "services", "framework", "other"]),
  message: z.string().min(20, "A sentence or two more would help us route this correctly."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const FORM_FIELD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE_OUT,
      delay: 0.08 + i * 0.07,
    },
  }),
};

const ICON_ROW_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASE_OUT,
      delay: 0.1 + i * 0.1,
    },
  }),
};

const CHECKMARK_DRAW = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: EASE_OUT, delay: 0.2 },
  },
};

export function ContactView() {
  const navigate = useNav((s) => s.navigate);
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const reduced = useReducedMotion();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      topic: "general",
      message: "",
    },
  });

  const watchedMessage = useWatch({ control, name: "message" });
  const charCount = watchedMessage?.length || 0;

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          company: data.company?.trim() || undefined,
          phone: data.phone?.trim() || undefined,
          topic: data.topic,
          message: data.message.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Request failed");
      }
      const result = (await res.json()) as { ok: true; data: { id: string } };
      setDone(true);
      toast({
        title: "Message received",
        description: `Thanks, ${data.name.split(" ")[0]}. We'll be in touch within one business day. Reference ${result.data.id}.`,
      });
      reset();
    } catch (err) {
      toast({
        title: "Couldn't send your message",
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const iconBounce: { scale: number; y: number; transition: { type: "spring"; stiffness: number; damping: number } } | Record<string, never> = reduced
    ? {}
    : {
        scale: 1.15,
        y: -2,
        transition: { type: "spring" as const, stiffness: 400, damping: 17 },
      };

  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="contact-hero-heading"
        className="relative overflow-hidden bg-[#003D3C] text-white py-16 lg:py-24 border-b border-white/10"
      >
        <div className="section-shell relative z-10">
          <div className="max-w-3xl">
            <Reveal y={14} duration={0.55}>
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#ADDFB3]">
                <span className="h-2 w-2 rounded-full bg-[#ADDFB3]" />
                Contact
              </div>
            </Reveal>

            <motion.h1
              id="contact-hero-heading"
              className="mt-4 text-[38px] sm:text-[52px] md:text-[60px] font-bold leading-[1.08] tracking-tight text-white"
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT, delay: 0.06 }}
            >
              {"Get in touch."}
            </motion.h1>

            <motion.p
              className="mt-5 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-white/80"
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT, delay: 0.18 }}
            >
              Whether you need internal audit outsourcing, co-sourcing, or support for your existing function, we&apos;re happy to discuss how we can help.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* BODY: form + aside                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="contact-form-heading"
        className="section-shell py-16 sm:py-20 lg:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* FORM */}
          <div className="lg:col-span-7">
            <h2 id="contact-form-heading" className="sr-only">
              Contact form
            </h2>

            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT, delay: 0.25 }}
            >
              <Card className="rounded-[16px] border border-gray-200 bg-white p-6 sm:p-8 md:p-10 shadow-sm">
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                      className="flex flex-col items-center py-12 text-center"
                    >
                      <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF4F2] text-[#003D3C] overflow-hidden">
                        <motion.svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-7 w-7"
                          initial="hidden"
                          animate="visible"
                          variants={{
                            visible: {
                              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                            },
                          }}
                        >
                          <motion.circle
                            cx="12"
                            cy="12"
                            r="9"
                            variants={CHECKMARK_DRAW}
                          />
                          <motion.path
                            d="M8 12.5l2.5 2.5L16 9.5"
                            variants={CHECKMARK_DRAW}
                          />
                        </motion.svg>
                      </span>
                      <h3 className="mt-6 text-[22px] font-bold text-[#121212]">
                        Message received
                      </h3>
                      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-gray-500">
                        Thanks for reaching out. A member of the Trennt team
                        will be in touch within one business day. If your enquiry
                        is urgent, please call us directly.
                      </p>
                      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button
                          variant="outline"
                          onClick={() => setDone(false)}
                          className="h-11 rounded-[10px] border-gray-200 text-[#003D3C] text-[14px] font-semibold hover:bg-gray-50"
                        >
                          Send another message
                        </Button>
                        <Button
                          onClick={() => navigate("home")}
                          className="h-11 gap-2 rounded-[10px] bg-[#ADDFB3] px-6 text-[14px] font-semibold text-[#003D3C] hover:bg-[#c2e8c4]"
                        >
                          Back to home
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial="hidden"
                      animate="visible"
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                      noValidate
                    >
                      <div className="grid gap-5 sm:grid-cols-2">
                        <motion.div custom={0} variants={FORM_FIELD_VARIANTS} className="space-y-2">
                          <Label htmlFor="name" className="text-[13px] font-semibold text-[#121212]">
                            Full name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            {...register("name")}
                            placeholder="Jane Patel"
                            autoComplete="name"
                            aria-invalid={!!errors.name}
                            className="h-11 rounded-[8px] border-gray-200 text-[14px] transition-all duration-300 ease-out focus:border-[#003D3C] focus:ring-2 focus:ring-[#003D3C]/20 focus:shadow-[0_0_0_3px_rgba(0,61,60,0.08)]"
                          />
                          {errors.name && (
                            <p className="text-xs font-medium text-destructive">
                              {errors.name.message}
                            </p>
                          )}
                        </motion.div>
                        <motion.div custom={1} variants={FORM_FIELD_VARIANTS} className="space-y-2">
                          <Label htmlFor="email" className="text-[13px] font-semibold text-[#121212]">
                            Work email <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="jane@company.com"
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            className="h-11 rounded-[8px] border-gray-200 text-[14px] transition-all duration-300 ease-out focus:border-[#003D3C] focus:ring-2 focus:ring-[#003D3C]/20 focus:shadow-[0_0_0_3px_rgba(0,61,60,0.08)]"
                          />
                          {errors.email && (
                            <p className="text-xs font-medium text-destructive">
                              {errors.email.message}
                            </p>
                          )}
                        </motion.div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <motion.div custom={2} variants={FORM_FIELD_VARIANTS} className="space-y-2">
                          <Label htmlFor="company" className="text-[13px] font-semibold text-[#121212]">Company</Label>
                          <Input
                            id="company"
                            {...register("company")}
                            placeholder="Northwind Logistics"
                            autoComplete="organization"
                            className="h-11 rounded-[8px] border-gray-200 text-[14px] transition-all duration-300 ease-out focus:border-[#003D3C] focus:ring-2 focus:ring-[#003D3C]/20 focus:shadow-[0_0_0_3px_rgba(0,61,60,0.08)]"
                          />
                        </motion.div>
                        <motion.div custom={3} variants={FORM_FIELD_VARIANTS} className="space-y-2">
                          <Label htmlFor="phone" className="text-[13px] font-semibold text-[#121212]">Phone</Label>
                          <Input
                            id="phone"
                            {...register("phone")}
                            placeholder="+966 50 123 4567"
                            autoComplete="tel"
                            inputMode="tel"
                            pattern="[+\d\s\-()]*"
                            className="h-11 rounded-[8px] border-gray-200 text-[14px] transition-all duration-300 ease-out focus:border-[#003D3C] focus:ring-2 focus:ring-[#003D3C]/20 focus:shadow-[0_0_0_3px_rgba(0,61,60,0.08)]"
                          />
                          {errors.phone && (
                            <p className="text-xs font-medium text-destructive">
                              {errors.phone.message}
                            </p>
                          )}
                        </motion.div>
                      </div>

                      <motion.div custom={4} variants={FORM_FIELD_VARIANTS} className="space-y-2">
                        <Label htmlFor="topic" className="text-[13px] font-semibold text-[#121212]">
                          What&apos;s this about?{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="topic"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger
                                id="topic"
                                className="h-11 w-full rounded-[8px] border-gray-200 text-[14px] transition-all duration-300 ease-out focus:border-[#003D3C] focus:ring-2 focus:ring-[#003D3C]/20 focus:shadow-[0_0_0_3px_rgba(0,61,60,0.08)]"
                                aria-label="Topic"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TOPICS.map((t) => (
                                  <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <p className="text-xs text-gray-500">
                          {TOPICS.find((t) => t.value === control._formValues.topic)?.hint}
                        </p>
                      </motion.div>

                      <motion.div custom={5} variants={FORM_FIELD_VARIANTS} className="space-y-2">
                        <Label htmlFor="message" className="text-[13px] font-semibold text-[#121212]">
                          How can we help?{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          {...register("message")}
                          placeholder="A sentence or two on what you're trying to change, and the question you'd like to start with."
                          className="min-h-36 resize-y rounded-[8px] border-gray-200 text-[14px] transition-all duration-300 ease-out focus:border-[#003D3C] focus:ring-2 focus:ring-[#003D3C]/20 focus:shadow-[0_0_0_3px_rgba(0,61,60,0.08)]"
                          aria-invalid={!!errors.message}
                        />
                        {errors.message ? (
                          <p className="text-xs font-medium text-destructive">
                            {errors.message.message}
                          </p>
                        ) : (
                          <motion.p
                            key={charCount}
                            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={reduced ? { duration: 0 } : { duration: 0.25, ease: EASE_OUT }}
                            className="text-xs text-gray-400 tabular-nums"
                          >
                            {charCount} characters
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        custom={6}
                        variants={FORM_FIELD_VARIANTS}
                        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2"
                      >
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 max-w-xs">
                            We respond within one business day. Your details are
                            never shared.
                          </p>
                          <p className="text-[11px] text-gray-400 max-w-xs">
                            Exclusively internal audit. Serving Boards and Audit Committees across Saudi Arabia.
                          </p>
                        </div>
                        <motion.div
                          whileHover={reduced || submitting ? {} : { scale: 1.02, y: -1 }}
                          whileTap={reduced || submitting ? {} : { scale: 0.98 }}
                          transition={{ duration: 0.2, ease: EASE_OUT }}
                        >
                          <Button
                            type="submit"
                            disabled={submitting}
                            className="h-11 gap-2 rounded-[10px] bg-[#ADDFB3] px-7 text-[14px] font-semibold text-[#003D3C] shadow-none transition-all duration-300 ease-out hover:bg-[#c2e8c4] hover:shadow-[0_6px_20px_-8px_rgba(173,223,179,0.9)] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending…
                              </>
                            ) : (
                              <>
                                Send message
                                <ArrowRight className="h-4 w-4 text-[#003D3C]" />
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>

          {/* ASIDE */}
          <aside className="lg:col-span-5 lg:pl-4">
            <Reveal y={12} duration={0.55} delay={0.12}>
              <Card className="rounded-[16px] border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-[17px] font-bold text-[#121212]">
                  Direct contact
                </h3>
                <ul className="mt-6 space-y-5 text-[14px]">
                  {[
                    {
                      icon: Mail,
                      label: "Email",
                      value: COMPANY.email,
                      href: `mailto:${COMPANY.email}`,
                    },
                    {
                      icon: Phone,
                      label: "Phone",
                      value: COMPANY.phone,
                      href: `tel:${COMPANY.phone.replace(/\s/g, "")}`,
                    },
                    {
                      icon: MapPin,
                      label: "Headquarters",
                      value: COMPANY.address,
                      isMultiline: true,
                    },
                    {
                      icon: Clock,
                      label: "Response time",
                      value: "Within one business day, Mon–Fri",
                    },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    const content = (
                      <>
                        <motion.span
                          whileHover={iconBounce}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF4F2] text-[#003D3C]"
                        >
                          <Icon className="h-4 w-4" />
                        </motion.span>
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                            {item.label}
                          </div>
                          <div className={item.isMultiline ? "font-medium text-[#121212] leading-relaxed break-words whitespace-pre-line" : "font-medium text-[#121212]"}>
                            {item.value}
                          </div>
                        </div>
                      </>
                    );

                    return (
                      <motion.li
                        key={item.label}
                        custom={i}
                        variants={ICON_ROW_VARIANTS}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-40px 0px -40px 0px" }}
                        whileHover={reduced ? {} : { x: 3 }}
                        transition={{ duration: 0.2, ease: EASE_OUT }}
                        className="flex items-start gap-3.5"
                      >
                        {item.href ? (
                          <a
                            href={item.href}
                            className="flex items-start gap-3.5 group w-full"
                          >
                            <motion.span
                              whileHover={iconBounce}
                              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF4F2] text-[#003D3C]"
                            >
                              <Icon className="h-4 w-4" />
                            </motion.span>
                            <div>
                              <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                                {item.label}
                              </div>
                              <div className="font-medium text-[#121212] transition-colors duration-200 group-hover:text-[#003D3C]">
                                {item.value}
                              </div>
                            </div>
                          </a>
                        ) : (
                          content
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              </Card>
            </Reveal>

            <Reveal y={12} duration={0.55} delay={0.24}>
              <div className="mt-6 flex items-start gap-3 rounded-[12px] border border-[#EEF4F2] bg-[#FAFCFA] p-5">
                <MessageSquare className="mt-0.5 h-4 w-4 text-[#003D3C] shrink-0" />
                <div>
                  <h4 className="text-[13px] font-bold text-[#121212]">
                    Prefer to reach us directly?
                  </h4>
                  <p className="mt-1 text-[12px] leading-relaxed text-gray-500">
                    Skip the form and email or call us using the details above —
                    a partner reads every enquiry personally.
                  </p>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </div>
  );
}
