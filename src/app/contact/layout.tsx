import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Contact Us | ${brand.name}`,
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
