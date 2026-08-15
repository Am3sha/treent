"use client";

import * as React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Twitter,
  Youtube,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNav } from "@/lib/store";
import { COMPANY } from "@/lib/content";
import { Reveal, RevealStagger } from "@/components/site/reveal";
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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

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
  phone: z.string().optional(),
  topic: z.enum(["general", "services", "framework", "other"]),
  message: z.string().min(20, "A sentence or two more would help us route this correctly."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactView() {
  const navigate = useNav((s) => s.navigate);
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

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
            <Reveal y={14} duration={0.55} delay={0.05}>
              <h1
                id="contact-hero-heading"
                className="mt-4 text-[38px] sm:text-[52px] md:text-[60px] font-bold leading-[1.08] tracking-tight text-white"
              >
                Get in touch.
              </h1>
            </Reveal>
            <Reveal y={14} duration={0.55} delay={0.1}>
              <p className="mt-5 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-white/80">
                Whether you need internal audit outsourcing, co-sourcing, or support for your existing function, we&apos;re happy to discuss how we can help.
              </p>
            </Reveal>
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
            <Reveal y={14} duration={0.55}>
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
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF4F2] text-[#003D3C]">
                        <CheckCircle2 className="h-7 w-7 stroke-[2]" />
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                      noValidate
                    >
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-[13px] font-semibold text-[#121212]">
                            Full name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            {...register("name")}
                            placeholder="Jane Patel"
                            autoComplete="name"
                            aria-invalid={!!errors.name}
                            className="h-11 rounded-[8px] border-gray-200 text-[14px] transition-all duration-200 focus:border-[#003D3C] focus:ring-1 focus:ring-[#003D3C]"
                          />
                          {errors.name && (
                            <p className="text-xs font-medium text-destructive">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
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
                            className="h-11 rounded-[8px] border-gray-200 text-[14px] transition-all duration-200 focus:border-[#003D3C] focus:ring-1 focus:ring-[#003D3C]"
                          />
                          {errors.email && (
                            <p className="text-xs font-medium text-destructive">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-[13px] font-semibold text-[#121212]">Company</Label>
                          <Input
                            id="company"
                            {...register("company")}
                            placeholder="Northwind Logistics"
                            autoComplete="organization"
                            className="h-11 rounded-[8px] border-gray-200 text-[14px] transition-all duration-200 focus:border-[#003D3C] focus:ring-1 focus:ring-[#003D3C]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-[13px] font-semibold text-[#121212]">Phone</Label>
                          <Input
                            id="phone"
                            {...register("phone")}
                            placeholder="+966 50 000 0000"
                            autoComplete="tel"
                            className="h-11 rounded-[8px] border-gray-200 text-[14px] transition-all duration-200 focus:border-[#003D3C] focus:ring-1 focus:ring-[#003D3C]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
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
                                className="h-11 w-full rounded-[8px] border-gray-200 text-[14px] transition-all duration-200 focus:border-[#003D3C] focus:ring-1 focus:ring-[#003D3C]"
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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-[13px] font-semibold text-[#121212]">
                          How can we help?{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          {...register("message")}
                          placeholder="A sentence or two on what you're trying to change, and the question you'd like to start with."
                          className="min-h-36 resize-y rounded-[8px] border-gray-200 text-[14px] transition-all duration-200 focus:border-[#003D3C] focus:ring-1 focus:ring-[#003D3C]"
                          aria-invalid={!!errors.message}
                        />
                        {errors.message ? (
                          <p className="text-xs font-medium text-destructive">
                            {errors.message.message}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">
                            {control._formValues.message?.length || 0} characters
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
                        <p className="text-xs text-gray-500 max-w-xs">
                          We respond within one business day. Your details are
                          never shared.
                        </p>
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="h-11 gap-2 rounded-[10px] bg-[#ADDFB3] px-7 text-[14px] font-semibold text-[#003D3C] shadow-none transition-all duration-200 hover:bg-[#c2e8c4] hover:scale-[1.02] active:scale-[0.98]"
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
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </Card>
            </Reveal>
          </div>

          {/* ASIDE */}
          <aside className="lg:col-span-5 lg:pl-4">
            <RevealStagger stagger={0.08} delay={0.1} y={14} childDuration={0.5} className="space-y-6">
              <Card className="rounded-[16px] border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-[17px] font-bold text-[#121212]">
                  Direct contact
                </h3>
                <ul className="mt-6 space-y-4 text-[14px]">
                  <li className="flex items-start gap-3.5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF4F2] text-[#003D3C]">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                        Email
                      </div>
                      <a
                        href={`mailto:${COMPANY.email}`}
                        className="font-medium text-[#121212] transition-colors hover:text-[#003D3C]"
                      >
                        {COMPANY.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF4F2] text-[#003D3C]">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                        Phone
                      </div>
                      <a
                        href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                        className="font-medium text-[#121212] transition-colors hover:text-[#003D3C]"
                      >
                        {COMPANY.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF4F2] text-[#003D3C]">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                        Headquarters
                      </div>
                      <div className="font-medium text-[#121212]">
                        {COMPANY.address}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF4F2] text-[#003D3C]">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                        Response time
                      </div>
                      <div className="font-medium text-[#121212]">
                        Within one business day, Mon–Fri
                      </div>
                    </div>
                  </li>
                </ul>
              </Card>

              <Card className="rounded-[16px] border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-[17px] font-bold text-[#121212]">
                  Our offices
                </h3>
                <ul className="mt-5 space-y-3.5 text-[14px]">
                  {COMPANY.offices.map((o) => (
                    <li
                      key={o.city}
                      className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <span className="font-semibold text-[#121212]">
                        {o.city}
                      </span>
                      <span className="text-xs text-gray-500">
                        {o.country}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="rounded-[16px] border border-gray-200 bg-[#F8F9FA] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#003D3C]" />
                  <h3 className="text-[17px] font-bold text-[#121212]">
                    Prefer to talk first?
                  </h3>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
                  Connect with us on social, or skip the form and email a
                  partner directly — we read everything that comes in.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-[8px] border-gray-200 text-[#003D3C] hover:bg-gray-100"
                  >
                    <a
                      href={COMPANY.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-3.5 w-3.5 text-[#003D3C]" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-[8px] border-gray-200 text-[#003D3C] hover:bg-gray-100"
                  >
                    <a
                      href={COMPANY.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-3.5 w-3.5 text-[#003D3C]" />
                      Twitter / X
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-[8px] border-gray-200 text-[#003D3C] hover:bg-gray-100"
                  >
                    <a
                      href={COMPANY.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Youtube className="h-3.5 w-3.5 text-[#003D3C]" />
                      YouTube
                    </a>
                  </Button>
                </div>
              </Card>
            </RevealStagger>
          </aside>
        </div>
      </section>
    </div>
  );
}
