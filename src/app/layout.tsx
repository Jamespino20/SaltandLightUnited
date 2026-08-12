import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { brand } from "@/lib/brand";
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
    title: `${brand.name} | Youth Fellowship`,
    description: brand.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={aileron.variable}>
      <body className="min-h-screen bg-slu-offwhite text-slu-black antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
