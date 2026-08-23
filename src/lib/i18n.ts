import { useNav } from "./store";
import { en } from "./translations/en";
import { ar } from "./translations/ar";

export type Language = "en" | "ar";

const translations = {
  en,
  ar,
};

export function useTranslation() {
  const lang = useNav((s) => (s as any).lang || "en");
  const setLang = useNav((s) => (s as any).setLang);

  const t = (key: string, options?: { returnObjects?: boolean; [key: string]: any }) => {
    const keys = key.split(".");
    let value: any = translations[lang as Language];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key; // Fallback to key itself
      }
    }

    if (options?.returnObjects) {
      return value;
    }

    if (typeof value === "string") {
      // Basic interpolation: replace {{var}} with options.var
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
