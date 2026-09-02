import { Noto_Sans_Arabic } from "next/font/google";

export const notoSansArabic = Noto_Sans_Arabic({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});
