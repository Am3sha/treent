"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT, useReducedMotion } from "@/components/site/reveal";

export function BackToTop() {
  const [visible, setVisible] = React.useState(false);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85, y: 8 }}
          animate={reduced ? {} : { opacity: 1, scale: 1, y: 0 }}
          exit={reduced ? {} : { opacity: 0, scale: 0.85, y: 8 }}
          transition={{ duration: reduced ? 0 : 0.28, ease: EASE_OUT }}
          whileHover={reduced ? {} : { scale: 1.06, y: -2 }}
          whileTap={reduced ? {} : { scale: 0.95 }}
          className={cn(
            "fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background/90 text-foreground shadow-md backdrop-blur-md transition-colors duration-300 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"
          )}
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
