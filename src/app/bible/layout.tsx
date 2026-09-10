import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Bible | ${brand.name}`,
};

export default function BibleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
