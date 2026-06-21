"use client";

import * as React from "react";
import { ShieldCheck, FileText, Cookie, Mail, ArrowUpRight } from "lucide-react";
import { useNav } from "@/lib/store";
import { COMPANY } from "@/lib/content";
import { Reveal, Eyebrow } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function LegalView() {
  const navigate = useNav((s) => s.navigate);
  const lastUpdated = "21 June 2026";

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-secondary/30">
        <div className="absolute inset-0 bg-radial-fade opacity-70" />
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <Reveal>
            <Eyebrow>Legal · Policies</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Privacy, terms &amp; cookies.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              We keep these short, plain, and up to date. If anything here is
              unclear, please{" "}
              <button
                onClick={() => navigate("contact")}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                ask us
              </button>{" "}
              — we&apos;d rather answer a question than leave you guessing.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-xs text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Tabbed content */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-lg border border-border/60 bg-secondary/30 p-1">
            <TabsTrigger
              value="privacy"
              className="gap-1.5 rounded-md text-xs sm:text-sm"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Privacy Policy</span>
              <span className="sm:hidden">Privacy</span>
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              className="gap-1.5 rounded-md text-xs sm:text-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Terms of Service</span>
              <span className="sm:hidden">Terms</span>
            </TabsTrigger>
            <TabsTrigger
              value="cookies"
              className="gap-1.5 rounded-md text-xs sm:text-sm"
            >
              <Cookie className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cookie Policy</span>
              <span className="sm:hidden">Cookies</span>
            </TabsTrigger>
          </TabsList>

          {/* Privacy Policy */}
          <TabsContent value="privacy" className="mt-8">
            <LegalCard>
              <LegalSection title="Who we are">
                <p>
                  {COMPANY.legalName} (&quot;Trennt&quot;, &quot;we&quot;,
                  &quot;us&quot;) is a limited liability partnership registered
                  in England &amp; Wales. Our registered office is{" "}
                  {COMPANY.address}. You can reach us at{" "}
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {COMPANY.email}
                  </a>{" "}
                  or {COMPANY.phone}.
                </p>
              </LegalSection>

              <LegalSection title="What we collect">
                <p>We collect only what we need to provide our services:</p>
                <LegalList
                  items={[
                    "Contact details you give us via our contact form (name, email, company, phone, message).",
                    "Career application details (name, email, phone, role, portfolio links, message).",
                    "Newsletter email address, if you subscribe.",
                    "Benchmark assessment responses (your answers, the profile you provide, and the computed scores).",
                    "Standard technical data (IP address, browser type, pages visited) via privacy-preserving analytics.",
                  ]}
                />
              </LegalSection>

              <LegalSection title="Why we collect it">
                <p>We process your data for these purposes:</p>
                <LegalList
                  items={[
                    "To respond to your enquiry, application, or follow-up request.",
                    "To compute and return your benchmark results and percentile.",
                    "To aggregate benchmark data into anonymised statistics shown on our Insights dashboard. Individual responses are never published — only aggregates of 5+ organisations.",
                    "To send you the Trennt Quarterly if you subscribe (you can unsubscribe at any time).",
                    "To improve our website, services, and content.",
                  ]}
                />
              </LegalSection>

              <LegalSection title="Legal basis (GDPR)">
                <p>
                  We rely on your <strong>consent</strong> for marketing
                  communications and benchmark data capture, on{" "}
                  <strong>legitimate interests</strong> for responding to your
                  enquiries, and on <strong>contract</strong> for data needed to
                  deliver engagements. You can withdraw consent at any time.
                </p>
              </LegalSection>

              <LegalSection title="How long we keep it">
                <LegalList
                  items={[
                    "Contact inquiries: 24 months, then deleted.",
                    "Career applications: 12 months, then deleted (unless you join us).",
                    "Newsletter subscriptions: until you unsubscribe.",
                    "Benchmark data: retained for aggregation, with personal identifiers removed after 36 months.",
                  ]}
                />
              </LegalSection>

              <LegalSection title="Who we share it with">
                <p>
                  We do not sell your data. We share it only with subprocessors
                  who help us operate (e.g. cloud hosting, email delivery,
                  analytics) under written data processing agreements, and where
                  required by law. A current list of subprocessors is available
                  on request.
                </p>
              </LegalSection>

              <LegalSection title="Your rights">
                <p>
                  Under GDPR and UK GDPR, you have the right to access, correct,
                  delete, restrict, or port your data, and to object to
                  processing. To exercise any of these rights, email us at{" "}
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {COMPANY.email}
                  </a>
                  . You can also complain to the UK Information
                  Commissioner&apos;s Office (ICO) at ico.org.uk.
                </p>
              </LegalSection>

              <LegalSection title="International transfers">
                <p>
                  Some subprocessors operate outside the UK/EEA. Where this
                  happens, we use Standard Contractual Clauses or rely on
                  adequacy decisions to ensure your data is protected to
                  UK/EEA standards.
                </p>
              </LegalSection>
            </LegalCard>
          </TabsContent>

          {/* Terms of Service */}
          <TabsContent value="terms" className="mt-8">
            <LegalCard>
              <LegalSection title="About these terms">
                <p>
                  These terms govern your use of the {COMPANY.name} website at
                  trennt.com. By using the site, you agree to them. If
                  you don&apos;t agree, please don&apos;t use the site.
                </p>
              </LegalSection>

              <LegalSection title="The benchmark tool">
                <p>
                  Our Strategic Benchmark Assessment is provided free of charge for
                  informational and self-assessment purposes. It is not
                  professional advice, and we make no warranty as to its
                  accuracy or suitability for your situation. Your results are
                  indicative, not definitive, and should not be the sole basis
                  for strategic decisions.
                </p>
              </LegalSection>

              <LegalSection title="Your content">
                <p>
                  You retain ownership of the information you submit via our
                  forms and benchmark. By submitting it, you grant us a
                  non-exclusive licence to use it to deliver the service you
                  requested (e.g. computing your benchmark, responding to your
                  enquiry) and to aggregate it into anonymised statistics. You
                  confirm that the information you provide is accurate and that
                  you have the right to share it.
                </p>
              </LegalSection>

              <LegalSection title="Our content">
                <p>
                  All content on this site — including articles, case studies,
                  methodologies, and the benchmark question set — is owned by{" "}
                  {COMPANY.legalName} and protected by copyright. You may share
                  links freely. You may not reproduce, republish, or
                  commercially exploit our content without written permission.
                </p>
              </LegalSection>

              <LegalSection title="Acceptable use">
                <p>You agree not to:</p>
                <LegalList
                  items={[
                    "Use the site in a way that breaches any law or regulation.",
                    "Attempt to gain unauthorised access to our systems or data.",
                    "Submit data that is unlawful, defamatory, or infringes others' rights.",
                    "Scrape, mirror, or overload the site with automated requests.",
                  ]}
                />
              </LegalSection>

              <LegalSection title="Liability">
                <p>
                  The site and benchmark are provided &quot;as is&quot; without
                  warranties of any kind. To the maximum extent permitted by
                  law, {COMPANY.legalName} shall not be liable for any
                  indirect, incidental, or consequential damages arising from
                  your use of the site. Nothing in these terms limits liability
                  that cannot be limited under applicable law.
                </p>
              </LegalSection>

              <LegalSection title="Changes">
                <p>
                  We may update these terms from time to time. The
                  &quot;last updated&quot; date above reflects the most recent
                  revision. Continued use after changes constitutes acceptance.
                </p>
              </LegalSection>

              <LegalSection title="Governing law">
                <p>
                  These terms are governed by the laws of England &amp; Wales.
                  Any disputes will be subject to the exclusive jurisdiction of
                  the courts of England &amp; Wales.
                </p>
              </LegalSection>
            </LegalCard>
          </TabsContent>

          {/* Cookie Policy */}
          <TabsContent value="cookies" className="mt-8">
            <LegalCard>
              <LegalSection title="What cookies are">
                <p>
                  Cookies are small text files stored on your device when you
                  visit a website. They help the site function, remember your
                  preferences, and understand how the site is used.
                </p>
              </LegalSection>

              <LegalSection title="The cookies we use">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/70 text-left">
                        <th className="py-2 pr-4 font-semibold">Cookie</th>
                        <th className="py-2 pr-4 font-semibold">Purpose</th>
                        <th className="py-2 pr-4 font-semibold">Duration</th>
                        <th className="py-2 font-semibold">Type</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4 font-mono text-xs text-foreground">
                          next-auth.session-token
                        </td>
                        <td className="py-2 pr-4">Keeps you signed in (if applicable)</td>
                        <td className="py-2 pr-4">Session</td>
                        <td className="py-2">Essential</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4 font-mono text-xs text-foreground">
                          theme
                        </td>
                        <td className="py-2 pr-4">Remembers your light/dark preference</td>
                        <td className="py-2 pr-4">1 year</td>
                        <td className="py-2">Essential</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4 font-mono text-xs text-foreground">
                          trennt_anon
                        </td>
                        <td className="py-2 pr-4">Privacy-preserving analytics (no PII)</td>
                        <td className="py-2 pr-4">24 hours</td>
                        <td className="py-2">Analytics</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono text-xs text-foreground">
                          newsletter_seen
                        </td>
                        <td className="py-2 pr-4">Remembers if you closed the newsletter prompt</td>
                        <td className="py-2 pr-4">30 days</td>
                        <td className="py-2">Functional</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </LegalSection>

              <LegalSection title="Managing cookies">
                <p>
                  You can control and delete cookies through your browser
                  settings. Disabling essential cookies will affect site
                  functionality (e.g. theme persistence). Analytics cookies can
                  be disabled without affecting functionality.
                </p>
              </LegalSection>

              <LegalSection title="Third-party services">
                <p>
                  We do not use advertising cookies or third-party advertising
                  networks. Our analytics are privacy-preserving and do not set
                  personally identifiable cookies. If we ever add a third-party
                  service that sets cookies, we&apos;ll update this policy and
                  seek your consent where required.
                </p>
              </LegalSection>
            </LegalCard>
          </TabsContent>
        </Tabs>

        {/* Contact CTA */}
        <Reveal>
          <Card className="mt-12 rounded-xl border-border/70 p-6 sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold">
                    Questions about these policies?
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We&apos;re happy to clarify anything. Email us directly or
                    use the contact form.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate("contact")}
                  size="sm"
                  className="gap-1.5 rounded-full"
                >
                  Contact us
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
                <a href={`mailto:${COMPANY.email}`}>
                  <Button size="sm" variant="outline" className="rounded-full">
                    {COMPANY.email}
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </Reveal>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function LegalCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="rounded-xl border-border/70 p-6 sm:p-8 md:p-10">
      <div className="space-y-8">{children}</div>
    </Card>
  );
}

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
