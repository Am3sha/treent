import { Noto_Sans_Arabic } from "next/font/google";

export const notoSansArabic = Noto_Sans_Arabic({
  weight: ["400", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  // Hash routing means the server-HTML is shared by EN and AR, so next/font's
  // automatic <link rel=preload> forced every English visitor to download the
  // 163KB Arabic woff2. AR pages fetch it (font-display: swap) the moment
  // `[lang="ar"]` CSS applies via LanguageAttributes - no manual preload can
  // beat that timing. The PDF font (public/fonts/*.ttf) is unaffected.
  preload: false,
});
