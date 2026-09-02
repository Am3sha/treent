"use client";

import * as React from "react";
import { ShieldCheck, FileText, Cookie, Mail, ArrowUpRight } from "lucide-react";
import { useNav } from "@/lib/store";
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
  const { t, isRTL } = useTranslation();
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
              {t('legal.hero.description')}
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
              <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border/60 pb-3 mb-6">
                {t('legal.privacy.title')}
              </h2>
              {((t('legal.privacy.sections', { returnObjects: true }) as any[]) || []).map((sec: any, idx: number) => (
                <LegalSection key={idx} title={sec.title}>
                  {sec.content && (
                    <div className="space-y-2 whitespace-pre-line">
                      {sec.content}
                      {sec.contactEmail && (
                        <div>
                          <a
                            href={`mailto:${sec.contactEmail}`}
                            className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
                          >
                            {sec.contactEmail}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  {sec.intro && <p>{sec.intro}</p>}
                  {sec.items && (
                    <LegalList items={sec.items} />
                  )}
                  {sec.footer && <p className="mt-2">{sec.footer}</p>}
                </LegalSection>
              ))}
            </LegalCard>
          </TabsContent>

          {/* Terms of Service */}
          <TabsContent value="terms" className="mt-8">
            <LegalCard>
              <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border/60 pb-3 mb-6">
                {t('legal.terms.title')}
              </h2>
              {((t('legal.terms.sections', { returnObjects: true }) as any[]) || []).map((sec: any, idx: number) => (
                <LegalSection key={idx} title={sec.title}>
                  {sec.content && (
                    <div className="space-y-2 whitespace-pre-line">
                      {sec.content}
                    </div>
                  )}
                  {sec.intro && <p>{sec.intro}</p>}
                  {sec.items && (
                    <LegalList items={sec.items} />
                  )}
                </LegalSection>
              ))}
            </LegalCard>
          </TabsContent>

          {/* Cookie Policy */}
          <TabsContent value="cookies" className="mt-8">
            <LegalCard>
              <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border/60 pb-3 mb-6">
                {t('legal.cookies.title')}
              </h2>
              {((t('legal.cookies.sections', { returnObjects: true }) as any[]) || []).map((sec: any, idx: number) => (
                <LegalSection key={idx} title={sec.title}>
                  {sec.content && (
                    <div className="space-y-2 whitespace-pre-line">
                      {sec.content}
                    </div>
                  )}
                  {sec.intro && <p>{sec.intro}</p>}
                  {sec.items && (
                    <ul className="space-y-3 my-3">
                      {sec.items.map((item: any, i: number) => (
                        <li key={i} className="rounded-lg border border-border/50 bg-secondary/20 p-3 text-xs sm:text-sm">
                          <span className="font-semibold text-foreground">{item.name}: </span>
                          <span>{item.desc}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {sec.footer && <p className="mt-2">{sec.footer}</p>}
                </LegalSection>
              ))}
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
                    {t('legal.contact.title')}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('legal.contact.desc')}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">
                    {t('legal.contact.company')} · <a href={`mailto:${t('legal.contact.email')}`} className="text-primary underline underline-offset-2">{t('legal.contact.email')}</a> · {t('legal.contact.website')}
                  </p>
                </div>
              </div>
              <div className={cn("flex flex-wrap gap-3", isRTL && "flex-row-reverse")}>
                <Button
                  onClick={() => navigate("contact")}
                  size="sm"
                  className={cn("gap-1.5 rounded-full", isRTL && "flex-row-reverse")}
                >
                  {t('nav.contact')}
                  <ArrowUpRight className={cn("h-3.5 w-3.5", isRTL && "rotate-[-90deg]")} />
                </Button>
                <a href={`mailto:${t('legal.contact.email')}`}>
                  <Button size="sm" variant="outline" className="rounded-full">
                    {t('legal.contact.email')}
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
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
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
