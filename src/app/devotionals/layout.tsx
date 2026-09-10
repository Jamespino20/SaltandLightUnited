import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Devotionals | ${brand.name}`,
};

export default function DevotionalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
