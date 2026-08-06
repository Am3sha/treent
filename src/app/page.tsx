"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { CommandPalette } from "@/components/site/command-palette";
import type { ViewKey } from "@/lib/types";
import { SERVICES, FRAMEWORK_AGREEMENTS } from "@/lib/content";
import { Icon } from "@/components/site/icon";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

import { HomeView } from "@/components/views/home-view";
import { AboutView } from "@/components/views/about-view";
import { ServicesView } from "@/components/views/services-view";
import { ContactView } from "@/components/views/contact-view";
import { CareersView } from "@/components/views/careers-view";
import { LegalView } from "@/components/views/legal-view";

import { BenchmarkLandingView } from "@/components/views/benchmark-landing-view";
import { BenchmarkQuizView } from "@/components/views/benchmark-quiz-view";
import { BenchmarkResultsView } from "@/components/views/benchmark-results-view";
import { BenchmarkFollowupView } from "@/components/views/benchmark-followup-view";
import { BenchmarkInsightsView } from "@/components/views/benchmark-insights-view";
import { NotFoundView } from "@/components/views/not-found-view";

function ServiceDetailView({ slug }: { slug: string }) {
  const navigate = useNav((s) => s.navigate);
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return <NotFoundView />;

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-fade" aria-hidden />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
          <Reveal>
            <Eyebrow>Services</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/8 text-primary">
                <Icon name={service.icon} className="h-6 w-6" />
              </span>
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.02]">
                {service.title}
              </h1>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
              {service.description}
            </p>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="What you get"
              title="Key outcomes"
              description=""
              className="max-w-md"
            />
            <ul className="mt-8 space-y-4">
              {service.outcomes.map((outcome, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <li className="flex items-start gap-3 text-base leading-relaxed text-foreground">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    {outcome}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow="Deliverables"
              title="What we provide"
              description=""
              className="max-w-md"
            />
            <ul className="mt-8 space-y-4">
              {service.deliverables.map((deliverable, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <li className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" aria-hidden />
                    {deliverable}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
        <Reveal delay={0.2}>
          <div className="mt-16 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => navigate("contact")}
              className="h-11 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Discuss this service
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("services")}
              className="h-11 gap-2 rounded-full border-border/70 hover:bg-accent hover:text-accent-foreground"
            >
              View all services
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function FrameworkAgreementsView() {
  const navigate = useNav((s) => s.navigate);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-fade" aria-hidden />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
          <Reveal>
            <Eyebrow>Services</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.02]">
              {FRAMEWORK_AGREEMENTS.title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
              {FRAMEWORK_AGREEMENTS.description}
            </p>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="What's included"
            title="Framework agreement components"
            description=""
          />
          <ul className="mt-8 space-y-4">
            {FRAMEWORK_AGREEMENTS.includes.map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <li className="flex items-start gap-3 text-base leading-relaxed text-foreground">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.2}>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              {FRAMEWORK_AGREEMENTS.additional}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate("contact")}
                className="h-11 gap-2 rounded-full bg-primary px-6 text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                Inquire about a framework agreement
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("services")}
                className="h-11 gap-2 rounded-full border-border/70 hover:bg-accent hover:text-accent-foreground"
              >
                View all services
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

const VIEWS: Record<ViewKey, React.ComponentType> = {
  home: HomeView,
  about: AboutView,
  services: ServicesView,
  "internal-audit-outsourcing": () => (
    <ServiceDetailView slug="internal-audit-outsourcing" />
  ),
  "internal-audit-co-sourcing": () => (
    <ServiceDetailView slug="internal-audit-co-sourcing" />
  ),
  "internal-audit-function-establishment": () => (
    <ServiceDetailView slug="internal-audit-function-establishment" />
  ),
  "internal-audit-transformation": () => (
    <ServiceDetailView slug="internal-audit-transformation" />
  ),
  "quality-assurance-and-improvement-program": () => (
    <ServiceDetailView slug="quality-assurance-and-improvement-program" />
  ),
  "framework-agreements": FrameworkAgreementsView,
  contact: ContactView,
  careers: CareersView,
  legal: LegalView,
  "benchmark-landing": BenchmarkLandingView,
  "benchmark-quiz": BenchmarkQuizView,
  "benchmark-results": BenchmarkResultsView,
  "benchmark-followup": BenchmarkFollowupView,
  "benchmark-insights": BenchmarkInsightsView,
  "not-found": NotFoundView,
};

function useHashSync() {
  const setView = useNav((s) => s.setView);
  React.useEffect(() => {
    // Sync from hash on mount
    const apply = () => {
      const raw = window.location.hash.replace(/^#\/?/, "");
      // Only consider the first path segment for view routing (e.g. "resources"
      // from "resources/the-maturity-trap"). Sub-paths are handled by the view.
      const firstSegment = raw.split("/")[0] as ViewKey;
      const valid: ViewKey[] = [
        "home",
        "about",
        "services",
        "internal-audit-outsourcing",
        "internal-audit-co-sourcing",
        "internal-audit-function-establishment",
        "internal-audit-transformation",
        "quality-assurance-and-improvement-program",
        "framework-agreements",
        "contact",
        "careers",
        "legal",
        "benchmark-landing",
        "benchmark-quiz",
        "benchmark-results",
        "benchmark-followup",
        "benchmark-insights",
      ];
      // If hash is non-empty but doesn't match a valid view, show 404
      const v = valid.includes(firstSegment)
        ? firstSegment
        : raw.length > 0
          ? "not-found"
          : "home";
      if (useNav.getState().view !== v) {
        useNav.setState({ view: v });
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [setView]);
}

export default function Home() {
  const view = useNav((s) => s.view);
  useHashSync();

  const ViewComponent = VIEWS[view] ?? HomeView;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <React.Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            </div>
          }
        >
          <ViewComponent />
        </React.Suspense>
      </main>
      <Footer />
      <BackToTop />
      <CommandPalette />
    </div>
  );
}
