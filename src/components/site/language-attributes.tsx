"use client";

import { useEffect } from "react";
import { useNav } from "@/lib/store";

export function LanguageAttributes() {
  const lang = useNav((s) => s.lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return null;
}
