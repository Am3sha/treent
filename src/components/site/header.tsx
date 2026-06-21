"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNav } from "@/lib/store";
import type { ViewKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV: { label: string; view: ViewKey }[] = [
  { label: "Home", view: "home" },
  { label: "About", view: "about" },
  { label: "Services", view: "services" },
  { label: "Careers", view: "careers" },
  { label: "Contact", view: "contact" },
];

export function Header() {
  const view = useNav((s) => s.view);
  const navigate = useNav((s) => s.navigate);
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (v: ViewKey) => {
    navigate(v);
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65"
          : "border-b border-transparent bg-background/0"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => go("home")}
          className="flex items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Meridian Advisory — home"
        >
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = view === item.view;
            return (
              <button
                key={item.view}
                onClick={() => go(item.view)}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-primary/70" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => go("benchmark-landing")}
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            Benchmark
          </Button>
          <Button
            size="sm"
            onClick={() => go("benchmark-landing")}
            className="hidden gap-1.5 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 sm:inline-flex"
          >
            Take the assessment
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => go(item.view)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-3 text-left text-base font-medium transition-colors",
                      view === item.view
                        ? "bg-primary/8 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.label}
                    {view === item.view && <X className="h-4 w-4 rotate-45" />}
                  </button>
                ))}
                <div className="my-3 h-px bg-border" />
                <button
                  onClick={() => go("benchmark-landing")}
                  className="flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-left text-base font-medium text-primary-foreground"
                >
                  Digital Maturity Benchmark
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
