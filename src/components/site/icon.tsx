"use client";

import * as React from "react";
import * as Icons from "lucide-react";

// Render a lucide icon by string name. Falls back to a dot if missing.
export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>)[
    name
  ];
  if (!Cmp) {
    return (
      <span
        className={cnDot(className)}
        aria-hidden
      />
    );
  }
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}

function cnDot(className?: string) {
  return className ? className : "inline-block h-4 w-4 rounded-full bg-current";
}
