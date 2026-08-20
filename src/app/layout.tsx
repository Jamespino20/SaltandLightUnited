import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { brand } from "@/lib/brand";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const aileron = localFont({
  src: [
    { path: "./fonts/Aileron-Thin.otf", weight: "100" },
    { path: "./fonts/Aileron-UltraLight.otf", weight: "200" },
    { path: "./fonts/Aileron-Light.otf", weight: "300" },
    { path: "./fonts/Aileron-Regular.otf", weight: "400" },
    { path: "./fonts/Aileron-SemiBold.otf", weight: "600" },
    { path: "./fonts/Aileron-Bold.otf", weight: "700" },
    { path: "./fonts/Aileron-Heavy.otf", weight: "800" },
    { path: "./fonts/Aileron-Black.otf", weight: "900" },
  ],
  variable: "--font-aileron",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name} | Youth Fellowship`,
  description: `${brand.description}.`,
  keywords: [
    "youth fellowship",
    "Christian youth",
    "Salt and Light United",
    "SLU",
    "Baliwag City",
    "teens",
    "tweens",
  ],
  openGraph: {
    title: `SLU Fellowship`,
    description: brand.description,
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en" className={aileron.variable}>
      <body className="min-h-screen bg-slu-offwhite text-slu-black antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
