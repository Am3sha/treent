import { Noto_Sans_Arabic } from "next/font/google";

export const notoSansArabic = Noto_Sans_Arabic({
  weight: ["400", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});
