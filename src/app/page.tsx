"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import type { ViewKey } from "@/lib/types";

import { HomeView } from "@/components/views/home-view";
import { AboutView } from "@/components/views/about-view";
import { ServicesView } from "@/components/views/services-view";
import { ContactView } from "@/components/views/contact-view";
import { CareersView } from "@/components/views/careers-view";
import { BenchmarkLandingView } from "@/components/views/benchmark-landing-view";
import { BenchmarkQuizView } from "@/components/views/benchmark-quiz-view";
import { BenchmarkResultsView } from "@/components/views/benchmark-results-view";
import { BenchmarkFollowupView } from "@/components/views/benchmark-followup-view";
import { BenchmarkInsightsView } from "@/components/views/benchmark-insights-view";

const VIEWS: Record<ViewKey, React.ComponentType> = {
  home: HomeView,
  about: AboutView,
  services: ServicesView,
  contact: ContactView,
  careers: CareersView,
  "benchmark-landing": BenchmarkLandingView,
  "benchmark-quiz": BenchmarkQuizView,
  "benchmark-results": BenchmarkResultsView,
  "benchmark-followup": BenchmarkFollowupView,
  "benchmark-insights": BenchmarkInsightsView,
};

function useHashSync() {
  const setView = useNav((s) => s.setView);
  React.useEffect(() => {
    // Sync from hash on mount
    const apply = () => {
      const h = window.location.hash.replace(/^#\/?/, "") as ViewKey;
      const valid: ViewKey[] = [
        "home",
        "about",
        "services",
        "contact",
        "careers",
        "benchmark-landing",
        "benchmark-quiz",
        "benchmark-results",
        "benchmark-followup",
        "benchmark-insights",
      ];
      const v = valid.includes(h) ? h : "home";
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
    </div>
  );
}
