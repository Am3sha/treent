"use client";

import * as React from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  y = 16,
  duration = 0.55,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
  y?: number;
  duration?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0.001, y: reduced ? 0 : y }, // Almost transparent but not 0 to avoid layout issues
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Tag
      ref={ref}
      className={className}
      initial={reduced ? "visible" : "hidden"}
      animate={inView ? "visible" : (reduced ? "visible" : "hidden")}
      variants={variants}
      transition={{
        duration: reduced ? 0 : duration,
        ease: EASE_OUT,
        delay: reduced ? 0 : delay,
      }}
      // Ensure content is visible if JS fails or slow
      style={{ opacity: inView ? 1 : (reduced ? 1 : 0.001) }}
    >
      {children}
    </Tag>
  );
}

export function RevealStagger({
  children,
  className,
  stagger = 0.1,
  delay = 0,
  y = 12,
  childDuration = 0.5,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  y?: number;
  childDuration?: number;
  as?: "div" | "section" | "ul" | "div";
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delay,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0.001, y: reduced ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : childDuration,
        ease: EASE_OUT,
      },
    },
  };

  return (
    <Tag
      ref={ref}
      className={className}
      initial={reduced ? "visible" : "hidden"}
      animate={inView ? "visible" : (reduced ? "visible" : "hidden")}
      variants={container}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div variants={item} key={(child as any).key ?? undefined}>
            {child}
          </motion.div>
        );
      })}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  y = 12,
  duration = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : duration, ease: EASE_OUT },
    },
  };
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-primary/80",
        className
      )}
    >
      <span className="h-px w-6 bg-primary/40" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg text-balance">
          {description}
        </p>
      )}
    </div>
  );
}

export { EASE_OUT, useReducedMotion };
