"use client";

import * as React from "react";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./logo";
import { useReducedMotion } from "@/components/site/reveal";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useNav } from "@/lib/store";
import { SERVICES } from "@/lib/content";
import type { ViewKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const emptySubscribe = () => () => { };

interface NavItem {
  label: string;
  view?: ViewKey;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", view: "home" },
  { label: "About Us", view: "about" },
  { label: "Services", view: "services" },
  { label: "Insights", view: "benchmark-insights" },
  { label: "Careers", view: "careers" },
  { label: "Contact", view: "contact" },
];

const CORE_SERVICE_SLUGS = new Set([
  "internal-audit-outsourcing",
  "internal-audit-co-sourcing",
]);

const SERVICE_VIEW_KEYS = new Set<ViewKey>([
  "services",
  ...SERVICES.map((s) => s.slug as ViewKey),
]);

function isServicesNavActive(view: ViewKey) {
  return SERVICE_VIEW_KEYS.has(view);
}

function getServiceGroups() {
  const core = SERVICES.filter((s) => CORE_SERVICE_SLUGS.has(s.slug));
  const development = SERVICES.filter((s) => !CORE_SERVICE_SLUGS.has(s.slug));
  return { core, development };
}

interface ServicesDropdownPanelProps {
  onNavigate: (view: ViewKey) => void;
  className?: string;
}

function ServicesDropdownPanel({
  onNavigate,
  className,
}: ServicesDropdownPanelProps) {
  const { core, development } = getServiceGroups();

  const renderGroup = (label: string, items: typeof SERVICES) => (
    <div>
      <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#003D3C]/55">
        {label}
      </p>
      <ul className="space-y-0.5" role="none">
        {items.map((service) => (
          <li key={service.slug} role="none">
            <button
              type="button"
              role="menuitem"
              onClick={() => onNavigate(service.slug as ViewKey)}
              className="group relative flex w-full items-center rounded-[6px] px-3 py-2.5 text-left text-[13px] font-medium leading-snug text-[#003D3C] transition-colors duration-150 hover:bg-[#ADDFB3]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ADDFB3]/50"
            >
              <span className="absolute left-0 h-0 w-[3px] rounded-full bg-[#ADDFB3] opacity-0 transition-all duration-150 group-hover:h-[60%] group-hover:opacity-100 group-focus-visible:h-[60%] group-focus-visible:opacity-100" />
              <span className="relative">{service.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[7px] border border-[#003D3C]/8 bg-[#FAFBFA] py-2 shadow-[0_12px_40px_-12px_rgba(0,61,60,0.22)]",
        className
      )}
      role="menu"
      aria-label="Services"
    >
      {renderGroup("Core", core)}
      <div className="my-2 border-t border-[#003D3C]/10" role="separator" />
      {renderGroup("Development", development)}
      <div className="my-2 border-t border-[#003D3C]/10" role="separator" />
      <button
        type="button"
        role="menuitem"
        onClick={() => onNavigate("services")}
        className="mx-2 flex w-[calc(100%-1rem)] items-center justify-between rounded-[6px] px-3 py-2.5 text-left text-[13px] font-semibold text-[#003D3C] transition-colors duration-150 hover:bg-[#ADDFB3]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ADDFB3]/50"
      >
        View all services
        <ArrowUpRight className="h-3.5 w-3.5 text-[#003D3C]/70" />
      </button>
    </div>
  );
}

interface DesktopServicesNavProps {
  active: boolean;
  onNavigate: (view: ViewKey) => void;
  reduced: boolean;
}

function DesktopServicesNav({ active, onNavigate, reduced }: DesktopServicesNavProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open, close]);

  const dropdownVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : -6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.18, ease: EASE_OUT },
    },
    exit: {
      opacity: 0,
      y: reduced ? 0 : -4,
      transition: { duration: reduced ? 0 : 0.15, ease: EASE_OUT },
    },
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => onNavigate("services")}
        className={cn(
          "relative inline-flex items-center gap-1 text-[14px] font-medium tracking-wide py-1 group",
          "transition-colors duration-200 ease-out",
          active
            ? "text-[#ADDFB3] font-semibold"
            : "text-white/95 hover:text-[#ADDFB3]"
        )}
      >
        Services
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200 ease-out",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-300 ease-out",
            active
              ? "w-full bg-[#ADDFB3]"
              : "w-0 bg-[#ADDFB3] group-hover:w-full"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-1/2 top-full z-[110] w-[min(100vw-2rem,22rem)] -translate-x-1/2 pt-2"
          >
            <ServicesDropdownPanel
              onNavigate={(view) => {
                onNavigate(view);
                close();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MobileServicesNavProps {
  active: boolean;
  onNavigate: (view: ViewKey) => void;
  reduced: boolean;
  variants: {
    hidden: { opacity: number; x: number };
    visible: {
      opacity: number;
      x: number;
      transition: { duration: number; ease: readonly [number, number, number, number] };
    };
  };
}

function MobileServicesNav({
  active,
  onNavigate,
  reduced,
  variants,
}: MobileServicesNavProps) {
  const [expanded, setExpanded] = React.useState(false);

  const subItemVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: reduced ? 0 : 0.22,
        ease: EASE_OUT,
        staggerChildren: reduced ? 0 : 0.04,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: reduced ? 0 : 0.18, ease: EASE_OUT },
    },
  };

  const subLinkVariants = {
    hidden: { opacity: 0, x: 8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reduced ? 0 : 0.2, ease: EASE_OUT },
    },
  };

  const { core, development } = getServiceGroups();
  const serviceLinks = [...core, ...development];

  return (
    <div>
      <motion.button
        type="button"
        variants={variants}
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between py-4 px-3 rounded-lg text-left text-[18px] font-semibold transition-all duration-200",
          active
            ? "text-[#ADDFB3] bg-white/5"
            : "text-white hover:text-[#ADDFB3] hover:bg-white/5"
        )}
      >
        <span className="flex items-center gap-2">
          Services
          {active && <span className="h-2 w-2 rounded-full bg-[#ADDFB3]" />}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200 ease-out",
            expanded && "rotate-180"
          )}
          aria-hidden="true"
        />
      </motion.button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            variants={subItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pb-2 pl-4">
              {serviceLinks.map((service) => (
                <motion.button
                  key={service.slug}
                  type="button"
                  variants={subLinkVariants}
                  onClick={() => onNavigate(service.slug as ViewKey)}
                  className="flex w-full items-center rounded-lg py-3 px-3 text-left text-[15px] font-medium text-white/90 transition-colors duration-200 hover:bg-white/5 hover:text-[#ADDFB3]"
                >
                  {service.title}
                </motion.button>
              ))}
              <motion.button
                type="button"
                variants={subLinkVariants}
                onClick={() => onNavigate("services")}
                className="mt-1 flex w-full items-center justify-between rounded-lg py-3 px-3 text-left text-[15px] font-semibold text-[#ADDFB3] transition-colors duration-200 hover:bg-[#ADDFB3]/10"
              >
                View all services
                <ArrowUpRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const storeView = useNav((s) => s.view);
  const navigate = useNav((s) => s.navigate);
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const scrollThreshold = 50;
  const mobileMenuVisible = mobileOpen && isMobile;

  const view = mounted ? storeView : "home";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > scrollThreshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (mobileMenuVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuVisible]);

  const go = (v?: ViewKey) => {
    if (!v) {
      setMobileOpen(false);
      return;
    }
    navigate(v);
    setMobileOpen(false);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reduced ? 0 : 0.3, ease: EASE_OUT } },
    exit: { opacity: 0, transition: { duration: reduced ? 0 : 0.2, ease: EASE_OUT } },
  };

  const panelVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        duration: reduced ? 0 : 0.35,
        ease: EASE_OUT,
        staggerChildren: reduced ? 0 : 0.06,
        delayChildren: reduced ? 0 : 0.08,
      },
    },
    exit: {
      x: "100%",
      transition: { duration: reduced ? 0 : 0.3, ease: EASE_OUT },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reduced ? 0 : 0.4, ease: EASE_OUT },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.45, ease: EASE_OUT, delay: reduced ? 0 : 0.45 },
    },
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] w-full transition-all duration-300 border-b",
        scrolled
          ? "bg-[#003D3C]/98 backdrop-blur-md border-[#002f2e]/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)]"
          : "bg-[#003D3C] border-[#002f2e]/40"
      )}
    >
      <div className="section-shell flex h-[88px] items-center justify-between">
        <button
          onClick={() => go("home")}
          className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[#ADDFB3]/40 rounded-sm py-1 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
          aria-label="TRENNT — Home"
        >
          <Logo variant="light" />
        </button>

        <nav
          className="hidden items-center gap-7 lg:gap-8 xl:gap-10 md:flex"
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => {
            if (item.label === "Services") {
              return (
                <DesktopServicesNav
                  key={item.label}
                  active={isServicesNavActive(view)}
                  onNavigate={go}
                  reduced={reduced}
                />
              );
            }

            const active = item.view ? view === item.view : false;
            return (
              <button
                key={item.label}
                onClick={() => go(item.view)}
                className={cn(
                  "relative text-[14px] font-medium tracking-wide py-1 group",
                  "transition-colors duration-200 ease-out",
                  active
                    ? "text-[#ADDFB3] font-semibold"
                    : "text-white/95 hover:text-[#ADDFB3]"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-300 ease-out",
                    active
                      ? "w-full bg-[#ADDFB3]"
                      : "w-0 bg-[#ADDFB3] group-hover:w-full"
                  )}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-5 sm:gap-6">
          <button
            onClick={() => go("benchmark-quiz")}
            className={cn(
              "hidden md:inline-flex text-[14px] font-semibold tracking-wide transition-colors duration-200 py-1 border-b border-transparent hover:border-[#ADDFB3]",
              view === "benchmark-quiz"
                ? "text-[#ADDFB3] border-[#ADDFB3]"
                : "text-white/95 hover:text-[#ADDFB3]"
            )}
          >
            Start Assessment
          </button>

          <Button
            onClick={() => go("contact")}
            className="hidden sm:inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#ADDFB3] px-6 text-[14px] font-semibold text-[#003D3C] shadow-none transition-all duration-200 ease-out hover:bg-[#c2e8c4] hover:shadow-[0_6px_20px_-8px_rgba(173,223,179,0.6)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
            <ArrowUpRight className="h-4 w-4 text-[#003D3C] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>

          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/20 text-white transition-all duration-200 hover:bg-white/10 hover:border-white/30 active:scale-[0.97] md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuVisible && (
          <motion.div
            className="fixed inset-0 z-[200] bg-[#003D3C] md:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              variants={backdropVariants}
              className="absolute inset-0 bg-[#003D3C]"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              variants={panelVariants}
              className="relative ml-auto flex h-full w-[86%] max-w-[420px] flex-col bg-[#003D3C] text-white shadow-2xl border-l border-white/10"
            >
              <div className="section-shell flex h-[88px] items-center justify-between border-b border-white/10">
                <button
                  onClick={() => go("home")}
                  aria-label="TRENNT — Home"
                  className="transition-transform duration-200 hover:scale-[1.02]"
                >
                  <Logo variant="light" />
                </button>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/20 text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.97]"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" strokeWidth={1.75} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8">
                <nav className="space-y-1" aria-label="Mobile navigation">
                  {NAV_ITEMS.map((item) => {
                    if (item.label === "Services") {
                      return (
                        <MobileServicesNav
                          key={item.label}
                          active={isServicesNavActive(view)}
                          onNavigate={go}
                          reduced={reduced}
                          variants={navItemVariants}
                        />
                      );
                    }

                    const active = item.view ? view === item.view : false;
                    return (
                      <motion.button
                        key={item.label}
                        variants={navItemVariants}
                        onClick={() => go(item.view)}
                        className={cn(
                          "flex w-full items-center justify-between py-4 px-3 rounded-lg text-left text-[18px] font-semibold transition-all duration-200",
                          active
                            ? "text-[#ADDFB3] bg-white/5"
                            : "text-white hover:text-[#ADDFB3] hover:bg-white/5"
                        )}
                      >
                        <span>{item.label}</span>
                        {active && (
                          <span className="h-2 w-2 rounded-full bg-[#ADDFB3]" />
                        )}
                      </motion.button>
                    );
                  })}

                  <motion.button
                    variants={navItemVariants}
                    onClick={() => go("benchmark-quiz")}
                    className={cn(
                      "flex w-full items-center justify-between py-4 px-3 rounded-lg text-left text-[18px] font-semibold transition-all duration-200 border-t border-white/10 mt-2 pt-4",
                      view === "benchmark-quiz"
                        ? "text-[#ADDFB3] bg-[#ADDFB3]/10"
                        : "text-white hover:text-[#ADDFB3] hover:bg-white/5"
                    )}
                  >
                    <span>Start Assessment</span>
                    {view === "benchmark-quiz" && (
                      <span className="h-2 w-2 rounded-full bg-[#ADDFB3]" />
                    )}
                  </motion.button>
                </nav>

                <motion.div variants={ctaVariants} className="mt-8 pt-4">
                  <Button
                    onClick={() => go("contact")}
                    className="h-14 w-full items-center justify-center gap-2 rounded-[10px] bg-[#ADDFB3] text-[16px] font-semibold text-[#003D3C] transition-all duration-200 hover:bg-[#c2e8c4] hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Get Started
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
