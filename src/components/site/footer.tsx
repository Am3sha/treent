"use client";

import * as React from "react";
import { Linkedin, Twitter, Youtube, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { useNav } from "@/lib/store";
import { COMPANY } from "@/lib/content";
import type { ViewKey } from "@/lib/types";

const FOOTER_NAV: { heading: string; links: { label: string; view: ViewKey }[] }[] = [
  {
    heading: "Company",
    links: [
      { label: "About", view: "about" },
      { label: "Services", view: "services" },
      { label: "Our Work", view: "work" },
      { label: "Resources", view: "resources" },
      { label: "Careers", view: "careers" },
      { label: "Contact", view: "contact" },
    ],
  },
  {
    heading: "Benchmark",
    links: [
      { label: "Overview", view: "benchmark-landing" },
      { label: "Take the assessment", view: "benchmark-quiz" },
      { label: "Insights dashboard", view: "benchmark-insights" },
      { label: "Methodology", view: "benchmark-landing" },
    ],
  },
];

export function Footer() {
  const navigate = useNav((s) => s.navigate);
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "ok" | "err">("idle");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("err");
    }
  };

  return (
    <footer className="mt-auto border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {COMPANY.description}
            </p>
            <form onSubmit={subscribe} className="mt-6 max-w-sm">
              <label
                htmlFor="newsletter"
                className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
              >
                The Meridian quarterly
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {status === "loading" ? "…" : "Subscribe"}
                </button>
              </div>
              {status === "ok" && (
                <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
                  Thanks — you&apos;re on the list.
                </p>
              )}
              {status === "err" && (
                <p className="mt-2 text-xs text-destructive">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4">
            {FOOTER_NAV.map((col) => (
              <div key={col.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <button
                        onClick={() => navigate(l.view)}
                        className="text-sm text-foreground/80 transition-colors hover:text-primary"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-foreground/80 hover:text-primary"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-foreground/80">{COMPANY.address}</span>
              </li>
            </ul>
            <div className="mt-5 flex gap-2">
              <a
                href={COMPANY.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={COMPANY.social.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={COMPANY.social.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {COMPANY.offices.length} offices worldwide
            </span>
            <button
              onClick={() => navigate("legal")}
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              Privacy &amp; terms
              <ArrowUpRight className="h-3 w-3" />
            </button>
            <span>Registered in England &amp; Wales</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
