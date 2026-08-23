"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "header" | "mobile" | "floating";
}

export function LanguageSwitcher({ className, variant = "header" }: LanguageSwitcherProps) {
  const { lang, setLang } = useTranslation();

  const toggle = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  const nextLangLabel = lang === "en" ? "AR" : "EN";

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex w-full items-center justify-between py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium transition-all duration-200 hover:bg-white/10 active:scale-[0.98]",
          className
        )}
      >
        <span className="text-sm font-medium">اللغة / Language</span>
        <span className={cn(
          "flex h-8 px-3.5 items-center justify-center rounded-full bg-[#ADDFB3] text-[12px] font-bold text-[#013D3E]",
          lang === "en" && "font-arabic"
        )}>
          {lang === "en" ? "العربية" : "English"}
        </span>
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      title={lang === "en" ? "التغيير للغة العربية" : "Switch to English"}
      aria-label="Toggle language"
      className={cn(
        "group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-sm transition-colors duration-200 hover:border-[#ADDFB3] hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ADDFB3]",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={lang}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "text-[12px] font-extrabold tracking-wide transition-colors group-hover:text-[#ADDFB3]",
            lang === "en" && "font-arabic"
          )}
        >
          {nextLangLabel}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
