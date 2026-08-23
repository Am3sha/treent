"use client";

import * as React from "react";
import { ShieldCheck, FileText, Cookie, Mail, ArrowUpRight } from "lucide-react";
import { useNav } from "@/lib/store";
import { COMPANY } from "@/lib/content";
import { useTranslation } from "@/lib/i18n";
import { Reveal, Eyebrow } from "@/components/site/reveal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function LegalView() {
  const { t, l, lang, isRTL } = useTranslation();
  const navigate = useNav((s) => s.navigate);
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-secondary/30">
        <div className="absolute inset-0 bg-radial-fade opacity-70" />
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" />
        <div className={cn("relative mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-20 lg:px-8", isRTL && "text-right")}>
          <Reveal>
            <Eyebrow>{t('legal.hero.eyebrow')}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              {t('legal.hero.heading')}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={cn("mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg", isRTL && "mr-0 ml-auto")}>
              {t('legal.hero.description_start')}{" "}
              <button
                onClick={() => navigate("contact")}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {t('legal.hero.cta')}
              </button>{" "}
              {t('legal.hero.description_end')}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-xs text-muted-foreground">
              {t('legal.hero.last_updated')}: {t('legal.hero.last_updated_date')}
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
              <span className="hidden sm:inline">{t('legal.tabs.privacy')}</span>
              <span className="sm:hidden">{t('legal.tabs.privacy_short')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              className="gap-1.5 rounded-md text-xs sm:text-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('legal.tabs.terms')}</span>
              <span className="sm:hidden">{t('legal.tabs.terms_short')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="cookies"
              className="gap-1.5 rounded-md text-xs sm:text-sm"
            >
              <Cookie className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('legal.tabs.cookies')}</span>
              <span className="sm:hidden">{t('legal.tabs.cookies_short')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Privacy Policy */}
          <TabsContent value="privacy" className="mt-8">
            <LegalCard>
              <LegalSection title={t('legal.privacy.who.title')}>
                <p>
                  {l(COMPANY.legalName as any)} {t('legal.privacy.who.desc_1')}{" "}
                  {l(COMPANY.address as any)}. {t('legal.privacy.who.desc_2')}{" "}
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {COMPANY.email}
                  </a>{" "}
                  {t('legal.privacy.who.desc_3')} {COMPANY.phone}.
                </p>
              </LegalSection>

              <LegalSection title={t('legal.privacy.collect.title')}>
                <p>{t('legal.privacy.collect.intro')}</p>
                <LegalList
                  items={t('legal.privacy.collect.items', { returnObjects: true }) as string[]}
                />
              </LegalSection>

              <LegalSection title={t('legal.privacy.why.title')}>
                <p>{t('legal.privacy.why.intro')}</p>
                <LegalList
                  items={t('legal.privacy.why.items', { returnObjects: true }) as string[]}
                />
              </LegalSection>

              <LegalSection title={t('legal.privacy.basis.title')}>
                <p>
                  {t('legal.privacy.basis.p1')} <strong>{t('legal.privacy.basis.consent')}</strong> {t('legal.privacy.basis.p2')}{" "}
                  <strong>{t('legal.privacy.basis.legitimate')}</strong> {t('legal.privacy.basis.p3')}{" "}
                  <strong>{t('legal.privacy.basis.contract')}</strong> {t('legal.privacy.basis.p4')}
                </p>
              </LegalSection>

              <LegalSection title={t('legal.privacy.retention.title')}>
                <LegalList
                  items={t('legal.privacy.retention.items', { returnObjects: true }) as string[]}
                />
              </LegalSection>

              <LegalSection title={t('legal.privacy.sharing.title')}>
                <p>{t('legal.privacy.sharing.desc')}</p>
              </LegalSection>

              <LegalSection title={t('legal.privacy.rights.title')}>
                <p>
                  {t('legal.privacy.rights.desc_1')}{" "}
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {COMPANY.email}
                  </a>
                  . {t('legal.privacy.rights.desc_2')}
                </p>
              </LegalSection>

              <LegalSection title={t('legal.privacy.transfers.title')}>
                <p>{t('legal.privacy.transfers.desc')}</p>
              </LegalSection>
            </LegalCard>
          </TabsContent>

          {/* Terms of Service */}
          <TabsContent value="terms" className="mt-8">
            <LegalCard>
              <LegalSection title={t('legal.terms.about.title')}>
                <p>
                  {t('legal.terms.about.description').replace('Trennt', l(COMPANY.name as any))}
                </p>
              </LegalSection>

              <LegalSection title={t('legal.terms.benchmark.title')}>
                <p>{t('legal.terms.benchmark.description')}</p>
              </LegalSection>

              <LegalSection title={t('legal.terms.content_user.title')}>
                <p>{t('legal.terms.content_user.description')}</p>
              </LegalSection>

              <LegalSection title={t('legal.terms.content_our.title')}>
                <p>
                  {t('legal.terms.content_our.description').replace('Trennt Partners', l(COMPANY.legalName as any))}
                </p>
              </LegalSection>

              <LegalSection title={t('legal.terms.use.title')}>
                <p>{t('legal.terms.use.description')}</p>
                <LegalList items={t('legal.terms.use.items', { returnObjects: true }) as string[]} />
              </LegalSection>

              <LegalSection title={t('legal.terms.liability.title')}>
                <p>
                  {t('legal.terms.liability.description').replace('Trennt Partners', l(COMPANY.legalName as any))}
                </p>
              </LegalSection>

              <LegalSection title={t('legal.terms.changes.title')}>
                <p>{t('legal.terms.changes.description')}</p>
              </LegalSection>

              <LegalSection title={t('legal.terms.law.title')}>
                <p>{t('legal.terms.law.description')}</p>
              </LegalSection>
            </LegalCard>
          </TabsContent>

          {/* Cookie Policy */}
          <TabsContent value="cookies" className="mt-8">
            <LegalCard>
              <LegalSection title={t('legal.cookies.what.title')}>
                <p>{t('legal.cookies.what.description')}</p>
              </LegalSection>

              <LegalSection title={t('legal.cookies.use.title')}>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className={cn("border-b border-border/70", isRTL ? "text-right" : "text-left")}>
                        <th className={cn("py-2 font-semibold", isRTL ? "pl-4" : "pr-4")}>{t('legal.cookies.use.columns.name')}</th>
                        <th className={cn("py-2 font-semibold", isRTL ? "pl-4" : "pr-4")}>{t('legal.cookies.use.columns.purpose')}</th>
                        <th className={cn("py-2 font-semibold", isRTL ? "pl-4" : "pr-4")}>{t('legal.cookies.use.columns.duration')}</th>
                        <th className="py-2 font-semibold">{t('legal.cookies.use.columns.type')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      {(t('legal.cookies.use.items', { returnObjects: true }) as any[]).map((item, i, arr) => (
                        <tr key={item.name} className={cn(i !== arr.length - 1 && "border-b border-border/50")}>
                          <td className={cn("py-2 font-mono text-xs text-foreground", isRTL ? "pl-4" : "pr-4")}>
                            {item.name}
                          </td>
                          <td className={cn("py-2", isRTL ? "pl-4" : "pr-4")}>{item.purpose}</td>
                          <td className={cn("py-2", isRTL ? "pl-4" : "pr-4")}>{item.duration}</td>
                          <td className="py-2">{item.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </LegalSection>

              <LegalSection title={t('legal.cookies.manage.title')}>
                <p>{t('legal.cookies.manage.description')}</p>
              </LegalSection>

              <LegalSection title={t('legal.cookies.third_party.title')}>
                <p>{t('legal.cookies.third_party.description')}</p>
              </LegalSection>
            </LegalCard>
          </TabsContent>
        </Tabs>

        {/* Contact CTA */}
        <Reveal>
          <Card className="mt-12 rounded-xl border-border/70 p-6 sm:p-8">
            <div className={cn("flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between", isRTL && "sm:flex-row-reverse")}>
              <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse text-right")}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold">
                    {t('legal.footer.title')}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('legal.footer.description')}
                  </p>
                </div>
              </div>
              <div className={cn("flex flex-wrap gap-3", isRTL && "flex-row-reverse")}>
                <Button
                  onClick={() => navigate("contact")}
                  size="sm"
                  className={cn("gap-1.5 rounded-full", isRTL && "flex-row-reverse")}
                >
                  {t('legal.footer.cta')}
                  <ArrowUpRight className={cn("h-3.5 w-3.5", isRTL && "rotate-[-90deg]")} />
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
  const { isRTL } = useTranslation();
  return (
    <section className={cn(isRTL && "text-right")}>
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
  const { isRTL } = useTranslation();
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
          <span className={cn(isRTL && "text-right")}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
