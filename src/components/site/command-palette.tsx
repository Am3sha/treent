"use client";

import * as React from "react";
import {
  Search,
  ArrowUpRight,
  Compass,
  Workflow,
  BrainCircuit,
  Gauge,
  ShieldCheck,
  Leaf,
  FileText,
  Building2,
  Users,
  Home,
  Mail,
  Briefcase,
  Sparkles,
  ClipboardList,
  Scale,
  type LucideIcon,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useNav } from "@/lib/store";
import {
  SERVICES,
  COMPANY,
} from "@/lib/content";
import type { ViewKey } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

// Helper to set the URL hash (used for sub-path navigation to articles/case studies)
function navigateToHash(path: string) {
  if (typeof window !== "undefined") {
    window.location.assign(`#${path}`);
  }
}

interface SearchEntry {
  id: string;
  label: string;
  hint: string;
  group: string;
  icon: LucideIcon;
  action: () => void;
  keywords?: string;
}

export function CommandPalette() {
  const { l } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const navigate = useNav((s) => s.navigate);

  // Cmd/Ctrl+K to open
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (view: ViewKey) => {
    navigate(view);
    setOpen(false);
  };



  const goService = (view: ViewKey) => {
    navigate(view);
    setOpen(false);
  };

  // Build the search index (rebuilt per render — cheap, and references `go` closures)
  const entries: SearchEntry[] = (() => {
    const navIcons: Record<string, LucideIcon> = {
      home: Home,
      about: Building2,
      services: Compass,
      careers: Users,
      contact: Mail,
      legal: Scale,
      "benchmark-landing": Sparkles,
    };
      const navLabels: Record<string, string> = {
      home: "Home",
      about: "About",
      services: "Services",
      careers: "Careers",
      contact: "Contact",
      legal: "Privacy & Terms",
      "benchmark-landing": "Internal Audit Maturity Benchmark",
    };
    const navHints: Record<string, string> = {
      home: "The Trennt homepage",
      about: "Who we are and what we stand for",
      services: "Our services",
      careers: "Open roles and culture",
      contact: "Get in touch",
      legal: "Privacy, terms & cookies",
      "benchmark-landing": "Take the assessment",
    };
    const navEntries: SearchEntry[] = Object.entries(navLabels).map(
      ([key, label]) => ({
        id: `nav-${key}`,
        label,
        hint: navHints[key] ?? "",
        group: "Navigate",
        icon: navIcons[key] ?? ArrowUpRight,
        action: () => go(key as ViewKey),
        keywords: navHints[key],
      })
    );

    const serviceIcons: Record<string, LucideIcon> = {
      Compass,
      Workflow,
      "BrainCircuit": BrainCircuit,
      Gauge,
      "ShieldCheck": ShieldCheck,
      Leaf,
    };
    const serviceEntries: SearchEntry[] = SERVICES.map((s) => ({
      id: `service-${s.slug}`,
      label: l(s.title),
      hint: l(s.tagline),
      group: "Services",
      icon: serviceIcons[s.icon] ?? Compass,
      action: () => goService(s.slug as ViewKey),
      keywords: `${l(s.tagline)} ${l(s.description)}`,
    }));

    return [...navEntries, ...serviceEntries];
  })();

  // Group entries
  const groups: [string, SearchEntry[]][] = (() => {
    const map = new Map<string, SearchEntry[]>();
    for (const e of entries) {
      if (!map.has(e.group)) map.set(e.group, []);
      map.get(e.group)!.push(e);
    }
    return Array.from(map.entries());
  })();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages and services…" />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map(([groupName, items]) => (
          <React.Fragment key={groupName}>
            <CommandGroup
              heading={groupName}
              className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
            >
              {items.map((entry) => (
                <CommandItem
                  key={entry.id}
                  value={`${entry.label} ${entry.hint} ${entry.keywords ?? ""}`}
                  onSelect={() => entry.action()}
                  className="gap-3 py-2.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <entry.icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">
                      {entry.label}
                    </span>
                    {entry.hint && (
                      <span className="truncate text-xs text-muted-foreground">
                        {entry.hint}
                      </span>
                    )}
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </React.Fragment>
        ))}
      </CommandList>
      <div className="flex items-center justify-between border-t border-border/60 px-3 py-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Search className="h-3 w-3" />
          {l(COMPANY.name as any)}
        </span>
        <span className="flex items-center gap-2">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            ↵
          </kbd>
          to select
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            esc
          </kbd>
          to close
        </span>
      </div>
    </CommandDialog>
  );
}
