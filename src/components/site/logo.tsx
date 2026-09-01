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
        src={variant === "light" ? "/trennt-logo.webp" : "/logo.svg"}
        alt="TRENNT"
        width={250}
        height={60}
        priority
        className={cn(
          "h-20 sm:h-[80px] md:h-[86px] lg:h-[90px] w-auto object-contain transition-opacity hover:opacity-95",
          variant === "light" && "mix-blend-lighten"
        )}
      />
    </span>
  );
}
