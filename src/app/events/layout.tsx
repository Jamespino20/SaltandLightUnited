import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Events | ${brand.name}`,
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
