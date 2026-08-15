"use client";

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { NotFoundView } from "@/components/views/not-found-view";
import { BackToTop } from "@/components/site/back-to-top";
import { CommandPalette } from "@/components/site/command-palette";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <NotFoundView />
      </main>
      <Footer />
      <BackToTop />
      <CommandPalette />
    </div>
  );
}
