import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Submit Devotional | ${brand.name}`,
};

export default function SubmitDevotionalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
