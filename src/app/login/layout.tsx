import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Admin Login | ${brand.name}`,
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
