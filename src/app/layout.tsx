import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/Providers";
// import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Trennt | Internal Audit Specialists",
  description:
    "Trennt is an internal audit firm based in Saudi Arabia, dedicated exclusively to internal audit delivery. We support Boards, Audit Committees, and senior management by providing objective insight into the effectiveness of risk management, internal controls, and governance processes.",
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
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Trennt ",
    description:
      "Trennt is an internal audit firm based in Saudi Arabia, dedicated exclusively to internal audit delivery.",
    siteName: "Trennt",
    type: "website",
  },
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
        */}
        <LanguageAttributes />
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
