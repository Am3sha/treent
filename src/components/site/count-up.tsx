"use client";

import * as React from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/components/site/reveal";

export function CountUp({
  value,
  duration = 1500,
  className,
  delay = 0,
}: {
  value: string;
  duration?: number;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const valueRef = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px -40px 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = React.useState("0");

  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  const prefix = match ? match[1] : "";
  const num = match ? parseFloat(match[2]) : 0;
  const suffix = match ? match[3] : value;
  const isDecimal = match ? match[2].includes(".") : false;
  const decimals = isDecimal && match ? match[2].split(".")[1].length : 0;

  React.useEffect(() => {
    if (!inView) {
      return;
    }
    if (reduced) {
      const finalVal = isDecimal ? num.toFixed(decimals) : Math.round(num).toString();
      queueMicrotask(() => {
        if (valueRef.current) {
          valueRef.current.textContent = finalVal;
        }
        setDisplay(finalVal);
      });
      return;
    }
    let raf: number;
    let timeoutId: ReturnType<typeof setTimeout>;

    const formatValue = (v: number) =>
      isDecimal ? v.toFixed(decimals) : Math.round(v).toString();

    const startAnim = () => {
      const start = performance.now();
      const finalVal = formatValue(num);
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = num * eased;
        const text = formatValue(current);
        if (valueRef.current) {
          valueRef.current.textContent = text;
        }
        if (progress < 1) {
          raf = requestAnimationFrame(animate);
        } else {
          if (valueRef.current) {
            valueRef.current.textContent = finalVal;
          }
          setDisplay(finalVal);
        }
      };
      raf = requestAnimationFrame(animate);
    };

    if (delay > 0) {
      timeoutId = setTimeout(startAnim, delay);
    } else {
      startAnim();
    }

    return () => {
      cancelAnimationFrame(raf);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [inView, num, isDecimal, duration, delay, reduced, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span ref={valueRef}>{display}</span>
      {suffix}
    </span>
  );
}

