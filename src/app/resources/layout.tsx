import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Resources | ${brand.name}`,
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
