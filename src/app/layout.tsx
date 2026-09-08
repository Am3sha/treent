import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getSiteUrl, getSiteEmail } from "@/lib/site-config";
import { COMPANY } from "@/lib/content";

const SITE_URL = getSiteUrl();

const SITE_TITLE = "TRENNT — Internal Audit & Advisory Services";
const SITE_DESCRIPTION =
  "TRENNT is a specialist Internal Audit firm supporting Boards, Audit Committees, and senior management with objective insight across governance, risk, and internal control.";
const OG_IMAGE_URL = "/og/trennt-og-1200x630.png";
const LOGO_ICON_URL = "/icons/icon-512.png";
const OG_ALT = "TRENNT - Internal Audit. Delivered with Independence.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "internal audit",
    "internal audit outsourcing",
    "internal audit co-sourcing",
    "internal audit function establishment",
    "internal audit transformation",
    "quality assurance and improvement program",
    "governance",
    "risk management",
    "internal controls",
    "audit committee",
    "IIA standards",
  ],
  authors: [{ name: "Trennt" }],
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: LOGO_ICON_URL, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "TRENNT",
    locale: "en_US",
    alternateLocale: ["ar_SA"],
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: OG_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: OG_ALT,
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "TRENNT",
      description: SITE_DESCRIPTION,
      inLanguage: ["en", "ar"],
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "TRENNT",
      legalName: COMPANY.legalName,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}${LOGO_ICON_URL}`,
      description: SITE_DESCRIPTION,
      foundingDate: String(COMPANY.foundedYear),
      email: getSiteEmail(),
    },
  ],
};

import { notoSansArabic } from "@/lib/fonts-arabic";
import { LanguageAttributes } from "@/components/site/language-attributes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {/* 
          Hydration script removed to fix "script tag while rendering" warning.
          LanguageAttributes and useHashSync handle document attributes.

          EXCEPTION (approved CLS fix C4): a static, side-effect-free boot script
          placed as the FIRST body child, before any streamed content exists.
          For Arabic deep links (location.hash #/ar/...) it sets html lang and
          html[data-ar-boot] once, so the FIRST painted frame is already
          Arabic-font + RTL. Previously body.dir was flipped in a post-hydration
          effect AFTER LTR content had painted, which horizontally shifted the
          whole viewport (a large counted layout shift, worse while a
          startTransition held the streamed content on screen).
          No React state, no re-render, no inline logic beyond attribute set.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(/^#\\/ar([\\/?#]|$)/i.test(location.hash)){var e=document.documentElement;e.lang="ar";e.setAttribute("data-ar-boot","1")}}catch(_){}',
          }}
        />
        <LanguageAttributes />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
