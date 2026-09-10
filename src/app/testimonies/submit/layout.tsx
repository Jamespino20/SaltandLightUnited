import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Share Your Testimony | ${brand.name}`,
};

export default function SubmitTestimonyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
