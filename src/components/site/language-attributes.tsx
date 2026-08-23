"use client";

import { useEffect } from "react";
import { useNav } from "@/lib/store";

export function LanguageAttributes() {
  const lang = useNav((s) => s.lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    // Keep html dir as "ltr" so browser scrollbar stays on the right side in both Arabic and English
    document.documentElement.dir = "ltr";
    // Apply rtl/ltr to body so all content, text, and Tailwind rtl: variants function properly
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return null;
}
