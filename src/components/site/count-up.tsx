"use client";

import * as React from "react";
import { useInView } from "framer-motion";

/**
 * Animated number counter that plays when scrolled into view.
 * Parses a numeric value out of a display string (e.g. "$4.2B" → 4.2, "$" prefix, "B" suffix)
 * and animates from 0 to the target over ~1.5s.
 */
export function CountUp({
  value,
  duration = 1500,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px -40px 0px" });
  const [display, setDisplay] = React.useState("0");

  // Parse the display string into prefix, number, suffix (cheap, no memo needed).
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  const prefix = match ? match[1] : "";
  const num = match ? parseFloat(match[2]) : 0;
  const suffix = match ? match[3] : value;
  const isDecimal = match ? match[2].includes(".") : false;

  React.useEffect(() => {
    if (!inView) {
      return;
    }
    let raf: number;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;
      setDisplay(
        isDecimal ? current.toFixed(1) : Math.round(current).toString()
      );
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setDisplay(
          isDecimal ? num.toFixed(1) : Math.round(num).toString()
        );
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, num, isDecimal, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
