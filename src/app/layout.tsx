import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TRENNT Consulting Group — Strategy, technology & data for the next standard",
  description:
    "TRENNT Consulting Group is an independent consulting firm helping world-leading organizations turn strategy into measurable outcomes — across digital transformation, data & AI, and operational excellence.",
  keywords: [
    "strategy consulting",
    "digital transformation",
    "data and AI",
    "operational excellence",
    "strategic maturity assessment",
    "benchmark",
  ],
  authors: [{ name: "TRENNT Consulting Group" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "TRENNT Consulting Group",
    description:
      "Strategy, technology & data for the next standard. Take our Strategic Benchmark Assessment to see where you stand.",
    siteName: "TRENNT Consulting Group",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
