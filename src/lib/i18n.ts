import * as React from "react";
import { useNav } from "./store";
import { en } from "./translations/en";

export type Language = "en" | "ar";

const translations: Record<Language, any> = {
  en,
  ar: null as any,
};

const arListeners = new Set<() => void>();
let arLoaded = false;

const arLoadPromise: Promise<void> = (async () => {
  try {
    const mod = await import("./translations/ar");
    translations.ar = mod.ar;
  } catch (e) {
    console.warn("[i18n] Failed to load Arabic translations, falling back to keys:", e);
    translations.ar = {};
  } finally {
    arLoaded = true;
    arListeners.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
    arListeners.clear();
  }
})();

const emptySubscribe = () => () => {};

function subscribeAr(cb: () => void): () => void {
  if (arLoaded) return () => {};
  arListeners.add(cb);
  return () => arListeners.delete(cb);
}

export function useTranslation() {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  React.useSyncExternalStore(
    subscribeAr,
    () => arLoaded,
    () => false
  );

  const storeLang = useNav((s) => (s as any).lang || "en");
  const lang: Language = mounted ? storeLang : "en";
  const setLang = useNav((s) => (s as any).setLang);

  const getDict = (l: Language) => {
    const d = translations[l];
    if (d !== null && d !== undefined) return d;
    return translations.en;
  };

  const t = (key: string, options?: { returnObjects?: boolean;[key: string]: any }) => {
    const keys = key.split(".");
    let value: any = getDict(lang);

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (options?.returnObjects) {
      return value;
    }

    if (typeof value === "string") {
      if (options) {
        Object.keys(options).forEach((k) => {
          value = value.replace(new RegExp(`{{${k}}}`, "g"), options[k]);
        });
      }
      return value;
    }

    return key;
  };

  const l = (localized: any) => {
    if (!localized) return "";
    if (typeof localized === "string") return localized;
    return localized[lang] || localized["en"] || "";
  };

  return { t, l, lang, setLang, isRTL: lang === "ar" };
}
