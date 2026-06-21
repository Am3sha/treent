"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <svg
          viewBox="0 0 40 40"
          className="h-9 w-9"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="trennt-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.38 0.06 162)" />
              <stop offset="100%" stopColor="oklch(0.45 0.09 180)" />
            </linearGradient>
          </defs>
          <rect
            x="1"
            y="1"
            width="38"
            height="38"
            rx="11"
            stroke="oklch(0.38 0.06 162 / 0.35)"
            strokeWidth="1"
            fill="oklch(0.38 0.06 162 / 0.06)"
          />
          {/* trennt arc */}
          <path
            d="M6 24 Q20 4 34 24"
            stroke="url(#trennt-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* horizon line */}
          <path
            d="M6 26 H34"
            stroke="oklch(0.72 0.13 75)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* node */}
          <circle cx="20" cy="9.5" r="2.6" fill="oklch(0.72 0.13 75)" />
        </svg>
      </span>
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-semibold tracking-tight text-[15px] text-foreground">
            TRENNT
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Consulting Group
          </span>
        </span>
      )}
    </span>
  );
}
