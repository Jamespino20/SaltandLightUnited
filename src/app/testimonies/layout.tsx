import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Testimonies | ${brand.name}`,
};

export default function TestimoniesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
