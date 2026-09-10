import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Maintenance | ${brand.name}`,
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
