import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Community Groups | ${brand.name}`,
};

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
