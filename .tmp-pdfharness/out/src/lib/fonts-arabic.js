"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notoSansArabic = void 0;
const google_1 = require("next/font/google");
exports.notoSansArabic = (0, google_1.Noto_Sans_Arabic)({
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
