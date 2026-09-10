import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `About Us | ${brand.name}`,
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
