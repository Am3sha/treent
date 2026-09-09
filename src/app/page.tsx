"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useNav } from "@/lib/store";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import type { ViewKey } from "@/lib/types";
import { isValidView, parseHashRoute } from "@/lib/routes";
import { FRAMEWORK_AGREEMENTS } from "@/lib/content";
import { Reveal, Eyebrow } from "@/components/site/reveal";
import { SiteMotionProvider } from "@/components/site/motion-provider";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const ViewLoader = () => (
  // min-h-[100vh]: the fallback must keep <footer> below the fold during the
  // streamed-home/hold window. At 60vh the footer top sat inside the desktop
  // viewport, so the later content swap pushed it out of view - that jump was
  // the CLS event (0.26 desktop / 0.288-0.576 mobile). A full-viewport
  // fallback puts the footer outside the impact area in BOTH states, making
  // the swap structurally shift-free regardless of paint timing.
  <div className="flex min-h-[100vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
  </div>
);

const HomeView = dynamic(
  () => import("@/components/views/home-view").then((m) => m.HomeView)
);

const BackToTop = dynamic(
  () => import("@/components/site/back-to-top").then((m) => m.BackToTop),
  { ssr: false }
);
const CommandPalette = dynamic(
  () => import("@/components/site/command-palette").then((m) => m.CommandPalette),
  { ssr: false }
);

// Shared loader fns: used both by the next/dynamic views AND the prefetch
// helpers below. The browser module cache is shared, so prefetching a loader
// makes the corresponding dynamic view resolve instantly at click time while
// leaving the startTransition-based CLS behavior untouched.
type PrefetchFn = () => Promise<unknown>;

const loadAbout = () => import("@/components/views/about-view").then((m) => m.AboutView);
const loadServices = () => import("@/components/views/services-view").then((m) => m.ServicesView);
const loadContact = () => import("@/components/views/contact-view").then((m) => m.ContactView);
const loadCareers = () => import("@/components/views/careers-view").then((m) => m.CareersView);
const loadLegal = () => import("@/components/views/legal-view").then((m) => m.LegalView);
const loadBenchmarkLanding = () => import("@/components/views/benchmark-landing-view").then((m) => m.BenchmarkLandingView);
const loadBenchmarkQuiz = () => import("@/components/views/benchmark-quiz-view").then((m) => m.BenchmarkQuizView);
const loadServiceDetail = () => import("@/components/views/service-detail-view").then((m) => m.ServiceDetailView);

const AboutView = dynamic(loadAbout, { loading: ViewLoader });
const ServicesView = dynamic(loadServices, { loading: ViewLoader });
const ContactView = dynamic(loadContact, { loading: ViewLoader });
const CareersView = dynamic(loadCareers, { loading: ViewLoader });
const LegalView = dynamic(loadLegal, { loading: ViewLoader });

const BenchmarkLandingView = dynamic(loadBenchmarkLanding, { loading: ViewLoader });
const BenchmarkQuizView = dynamic(loadBenchmarkQuiz, { loading: ViewLoader });
const BenchmarkResultsView = dynamic(
  () => import("@/components/views/benchmark-results-view").then((m) => m.BenchmarkResultsView),
  { loading: ViewLoader }
);
const BenchmarkFollowupView = dynamic(
  () => import("@/components/views/benchmark-followup-view").then((m) => m.BenchmarkFollowupView),
  { loading: ViewLoader }
);
const BenchmarkInsightsView = dynamic(
  () => import("@/components/views/benchmark-insights-view").then((m) => m.BenchmarkInsightsView),
  { loading: ViewLoader }
);
const NotFoundView = dynamic(
  () => import("@/components/views/not-found-view").then((m) => m.NotFoundView),
  { loading: ViewLoader }
);

// Toggle: when false, the PUBLIC benchmark-insights page is hidden. Direct
// navigation (/#/benchmark-insights) shows the branded NotFoundView instead.
// NOTE: this only hides the public view — /admin/insights (NextAuth-protected)
// and the /api/benchmark/stats endpoint are unaffected.
const PUBLIC_BENCHMARK_INSIGHTS_ENABLED = false;

const ServiceDetailView = dynamic(loadServiceDetail, { loading: ViewLoader });

// ---------------------------------------------------------------------------
// Navigation prefetch (progressive enhancement)
//
// benchmark-results/-insights are intentionally NOT registered here: they
// pull the heavy recharts/@react-pdf chunk (~1.2MB) and are never linked
// from the nav, so they stay on-demand only.
// ---------------------------------------------------------------------------

const PREFETCH_BY_VIEW: Partial<Record<ViewKey, PrefetchFn>> = {
  about: loadAbout,
  services: loadServices,
  contact: loadContact,
  careers: loadCareers,
  legal: loadLegal,
  "benchmark-landing": loadBenchmarkLanding,
  "benchmark-quiz": loadBenchmarkQuiz,
  "internal-audit-outsourcing": loadServiceDetail,
  "internal-audit-co-sourcing": loadServiceDetail,
  "internal-audit-function-establishment": loadServiceDetail,
  "internal-audit-transformation": loadServiceDetail,
  "quality-assurance-and-improvement-program": loadServiceDetail,
};

const prefetchedViews = new Set<string>();
function prefetchView(key: string) {
  if (!key || prefetchedViews.has(key)) return;
  prefetchedViews.add(key);
  void PREFETCH_BY_VIEW[key as ViewKey]?.().catch(() => {});
}

function viewFromHref(href: string | null | undefined): string {
  if (!href) return "";
  const { rest } = parseHashRoute(href.replace(/^\//, ""));
  return rest.split("/")[0];
}

// Deep-link boot: fetch the landing view's chunk at module-eval time,
// parallel to app JS/hydration, instead of after the first render needs it.
if (typeof window !== "undefined") {
  prefetchView(viewFromHref(window.location.hash));
}

import { useTranslation } from "@/lib/i18n";

function FrameworkAgreementsView() {
  const { l, t } = useTranslation();
  const navigate = useNav((s) => s.navigate);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border/60 bg-white">
        <div className="absolute inset-0 bg-radial-fade" aria-hidden />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-40 pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
          <Reveal>
            <Eyebrow>{t('nav.services')}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-[#121212] sm:text-5xl md:text-6xl md:leading-[1.02]">
              {l(FRAMEWORK_AGREEMENTS.title)}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
              {l(FRAMEWORK_AGREEMENTS.description)}
            </p>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="max-w-3xl">
          <ul className="space-y-4">
            {FRAMEWORK_AGREEMENTS.includes.map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <li className="flex items-start gap-3 text-base leading-relaxed text-foreground">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-[#003D3C]" />
                  {l(item)}
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.2}>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              {l(FRAMEWORK_AGREEMENTS.additional)}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate("contact")}
                className="h-11 gap-2 rounded-full bg-[#003D3C] px-6 text-white shadow-sm hover:bg-[#002b2a]"
              >
                {t('services.framework.cta_contact')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("services")}
                className="h-11 gap-2 rounded-full border-gray-300 text-[#003D3C] hover:bg-[#EEF4F2]"
              >
                {t('services.common.view_all')}
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
  const setLang = useNav((s) => s.setLang);

  React.useEffect(() => {
    const apply = () => {
      const { lang, rest } = parseHashRoute(window.location.hash);

      const firstSegment = rest.split("/")[0];

      const v = isValidView(firstSegment)
        ? firstSegment
        : rest.length > 0
          ? "not-found"
          : "home";

      if (useNav.getState().view !== v) {
        React.startTransition(() => {
          useNav.setState({ view: v });
        });
      }
      if (useNav.getState().lang !== lang) {
        React.startTransition(() => {
          useNav.setState({ lang });
        });
        document.documentElement.lang = lang;
        document.documentElement.dir = "ltr";
        document.body.dir = lang === "ar" ? "rtl" : "ltr";
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [setView, setLang]);
}


export default function Home() {
  const storeView = useNav((s) => s.view);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Mark the hydration mount flip as a Transition: a deep link like /#/services
    // would otherwise let its still-loading lazy view replace the streamed Home
    // content with the 60vh Suspense fallback (page collapse = the CLS spike).
    // In a transition, React keeps the old committed content until the new view
    // is ready, then swaps both in one commit.
    React.startTransition(() => setMounted(true));
  }, []);

  React.useEffect(() => {
    // Navigation prefetch on approach: hovering/keyboard-focusing any crawl
    // /#/... link warms that view's chunk, so the click-time transition has
    // an already-resolved loader and swaps almost instantly.
    const onNear = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.('a[href^="/#/"]');
      if (!el) return;
      prefetchView(viewFromHref(el.getAttribute("href")));
    };
    window.addEventListener("pointerover", onNear, { passive: true });
    window.addEventListener("focusin", onNear);

    // Post-load idle prefetch for the most likely next pages.
    // Gated deliberately:
    //  - Desktop pointer/coarse-fine + big viewport only (hover covers mobile;
    //    mobile LCP/CLS must not compete with speculative fetches).
    //  - Light marketing chunks ONLY: benchmark-quiz/landing share the heavy
    //    ~700KB-1.2MB graph (recharts/@react-pdf) and stay hover/deeplink-only.
    const idleTargets = ["services", "about", "contact", "careers"];
    const runIdle = () => {
      for (const t of idleTargets) prefetchView(t);
    };
    const nav = window.navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    };
    const connOk = !nav.connection || (!nav.connection.saveData && /4g/i.test(nav.connection.effectiveType || "4g"));
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    let idleHandle = 0;
    let timerHandle = 0;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (desktop && connOk) {
      // +9s after mount: fully outside load/TTI/Lighthouse windows, still
      // warms secondary navigation well before a realistic second click.
      timerHandle = window.setTimeout(runIdle, 9000);
    }

    return () => {
      window.removeEventListener("pointerover", onNear);
      window.removeEventListener("focusin", onNear);
      if (idleHandle && typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(idleHandle);
      if (timerHandle) window.clearTimeout(timerHandle);
    };
  }, []);

  useHashSync();

  // The command palette is keyboard-only (Cmd/Ctrl+K) - its radix + cmdk
  // graph must not spend parse/eval seconds on phones (no trigger exists)
  // or before a desktop user ever presses the shortcut. Arm on the first
  // matching keypress and open it immediately once mounted.
  const [paletteWanted, setPaletteWanted] = React.useState(false);
  React.useEffect(() => {
    if (paletteWanted) return;
    const arm = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteWanted(true);
      }
    };
    window.addEventListener("keydown", arm);
    return () => window.removeEventListener("keydown", arm);
  }, [paletteWanted]);

  const view = mounted ? storeView : "home";
  const ViewComponent =
    view === "benchmark-insights" && !PUBLIC_BENCHMARK_INSIGHTS_ENABLED
      ? NotFoundView
      : (VIEWS[view] ?? HomeView);

  return (
    <SiteMotionProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 pt-[92px] md:pt-[98px]">
          <React.Suspense fallback={<ViewLoader />}>
            <ViewComponent />
          </React.Suspense>
        </main>
        <Footer />
        <BackToTop />
        {paletteWanted && <CommandPalette initialOpen />}
      </div>
    </SiteMotionProvider>
  );
}
