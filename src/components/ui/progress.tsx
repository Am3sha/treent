"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  dir,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const pct = value || 0;
  const isRtl = dir === "rtl";
  const transformStyle = isRtl
    ? `translateX(${100 - pct}%)`
    : `translateX(-${100 - pct}%)`;

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      dir={dir}
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: transformStyle }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
