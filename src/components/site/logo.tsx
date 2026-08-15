"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={variant === "light" ? "/trennt-logo.png" : "/logo.svg"}
        alt="TRENNT"
        width={200}
        height={40}
        priority
        className={cn(
          "h-16 md:h-[66px] lg:h-[72px] w-auto object-contain transition-opacity hover:opacity-95",
          variant === "light" && "mix-blend-lighten"
        )}
      />
    </span>
  );
}
