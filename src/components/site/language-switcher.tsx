"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  const toggle = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  return (
    <div className={cn(
      "fixed bottom-6 z-50 md:bottom-8",
      lang === "ar" ? "right-6 md:right-8" : "left-6 md:left-8"
    )}>
      <div className="flex items-center rounded-full bg-[#013D3E] p-1 shadow-lg border border-white/10">
        <button
          onClick={() => setLang("en")}
          className={cn(
            "rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-200",
            lang === "en"
              ? "bg-[#ADDFB3] text-[#013D3E]"
              : "text-white/70 hover:text-white"
          )}
        >
          EN
        </button>
        <div className="mx-1 h-3 w-[1px] bg-white/20" />
        <button
          onClick={() => setLang("ar")}
          className={cn(
            "rounded-full px-3 py-1.5 text-[11px] font-bold font-arabic transition-all duration-200",
            lang === "ar"
              ? "bg-[#ADDFB3] text-[#013D3E]"
              : "text-white/70 hover:text-white"
          )}
        >
          AR
        </button>
      </div>
    </div>
  );
}
