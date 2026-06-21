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
import { useNav } from "@/lib/store";
import { COMPANY } from "@/lib/content";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
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

type Topic = "general" | "services" | "partnership" | "press";

interface FormState {
  name: string;
  email: string;
  company: string;
  phone: string;
  topic: Topic;
  message: string;
}

const TOPICS: { value: Topic; label: string; hint: string }[] = [
  { value: "general", label: "General enquiry", hint: "Anything else on your mind." },
  {
    value: "services",
    label: "Engagement enquiry",
    hint: "Discuss a specific service or programme.",
  },
  {
    value: "partnership",
    label: "Partnership",
    hint: "Vendors, alliances, research collaboration.",
  },
  { value: "press", label: "Press & media", hint: "Comment, briefings, interviews." },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactView() {
  const navigate = useNav((s) => s.navigate);
  const { toast } = useToast();
  const [form, setForm] = React.useState<FormState>({
    name: "",
    email: "",
    company: "",
    phone: "",
    topic: "general",
    message: "",
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!form.email.trim()) next.email = "An email is required so we can reply.";
    else if (!EMAIL_RE.test(form.email)) next.email = "That doesn't look like a valid email.";
    if (!form.message.trim()) next.message = "Please add a short message.";
    else if (form.message.trim().length < 20)
      next.message = "A sentence or two more would help us route this correctly.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || undefined,
          phone: form.phone.trim() || undefined,
          topic: form.topic,
          message: form.message.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Request failed");
      }
      const data = (await res.json()) as { ok: true; id: string };
      setDone(true);
      toast({
        title: "Message received",
        description: `Thanks, ${form.name.split(" ")[0]}. We'll be in touch within one business day. Reference ${data.id}.`,
      });
      setForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        topic: "general",
        message: "",
      });
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
  }

  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="contact-hero-heading"
        className="relative overflow-hidden border-b border-border/60"
      >
        <div className="absolute inset-0 bg-radial-fade" aria-hidden />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 md:pb-20 md:pt-24 lg:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Contact</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1
                id="contact-hero-heading"
                className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.02]"
              >
                Get in touch.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
                Whether you have a defined brief or a half-formed hypothesis,
                we&apos;re happy to spend an hour on it. No decks, no
                obligation.
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
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-12">
          {/* FORM */}
          <div className="lg:col-span-7">
            <h2 id="contact-form-heading" className="sr-only">
              Contact form
            </h2>
            <Reveal>
              <Card className="rounded-2xl border-border/70 bg-card p-6 sm:p-8 md:p-10">
                {done ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                      <CheckCircle2 className="h-7 w-7" />
                    </span>
                    <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                      Message received
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                      Thanks for reaching out. A member of the Meridian team
                      will be in touch within one business day. If your enquiry
                      is urgent, please call us directly.
                    </p>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                      <Button
                        variant="outline"
                        onClick={() => setDone(false)}
                        className="rounded-full"
                      >
                        Send another message
                      </Button>
                      <Button
                        onClick={() => navigate("benchmark-landing")}
                        className="gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Take the benchmark
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-6" noValidate>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Full name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          placeholder="Jane Patel"
                          autoComplete="name"
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Work email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="jane@company.com"
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={form.company}
                          onChange={(e) => update("company", e.target.value)}
                          placeholder="Northwind Logistics"
                          autoComplete="organization"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          placeholder="+44 20 7946 0312"
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic">
                        What&apos;s this about?{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={form.topic}
                        onValueChange={(v) => update("topic", v as Topic)}
                      >
                        <SelectTrigger
                          id="topic"
                          className="h-9 w-full"
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
                      <p className="text-xs text-muted-foreground">
                        {TOPICS.find((t) => t.value === form.topic)?.hint}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        How can we help?{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        placeholder="A sentence or two on what you're trying to change, and the question you'd like to start with."
                        className="min-h-32 resize-y"
                        aria-invalid={!!errors.message}
                      />
                      {errors.message ? (
                        <p className="text-xs text-destructive">
                          {errors.message}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {form.message.length} characters
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        We respond within one business day. Your details are
                        never shared.
                      </p>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={submitting}
                        className="h-11 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-sm hover:bg-primary/90"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send message
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            </Reveal>
          </div>

          {/* ASIDE */}
          <aside className="lg:col-span-5 lg:pl-4">
            <div className="space-y-6">
              <Reveal>
                <Card className="rounded-2xl border-border/70 bg-card p-6 sm:p-8">
                  <h3 className="text-base font-semibold tracking-tight">
                    Direct contact
                  </h3>
                  <ul className="mt-5 space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                        <Mail className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Email
                        </div>
                        <a
                          href={`mailto:${COMPANY.email}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {COMPANY.email}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                        <Phone className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Phone
                        </div>
                        <a
                          href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {COMPANY.phone}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Headquarters
                        </div>
                        <div className="font-medium text-foreground">
                          {COMPANY.address}
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                        <Clock className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Response time
                        </div>
                        <div className="font-medium text-foreground">
                          Within one business day, Mon–Fri
                        </div>
                      </div>
                    </li>
                  </ul>
                </Card>
              </Reveal>

              <Reveal delay={0.05}>
                <Card className="rounded-2xl border-border/70 bg-card p-6 sm:p-8">
                  <h3 className="text-base font-semibold tracking-tight">
                    Our offices
                  </h3>
                  <ul className="mt-5 space-y-3 text-sm">
                    {COMPANY.offices.map((o) => (
                      <li
                        key={o.city}
                        className="flex items-center justify-between border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
                      >
                        <span className="font-medium text-foreground">
                          {o.city}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {o.country}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>

              <Reveal delay={0.1}>
                <Card className="rounded-2xl border-border/70 bg-secondary/40 p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <h3 className="text-base font-semibold tracking-tight">
                      Prefer to talk first?
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Connect with us on social, or skip the form and email a
                    partner directly — we read everything that comes in.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-full"
                    >
                      <a
                        href={COMPANY.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                        LinkedIn
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-full"
                    >
                      <a
                        href={COMPANY.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-3.5 w-3.5" />
                        Twitter / X
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-full"
                    >
                      <a
                        href={COMPANY.social.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Youtube className="h-3.5 w-3.5" />
                        YouTube
                      </a>
                    </Button>
                  </div>
                </Card>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
