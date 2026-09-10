import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { brand } from "@/lib/brand";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const devotional = await prisma.devotional.findUnique({
    where: { id },
    select: { title: true },
  });

  if (!devotional) {
    return { title: `Devotional Not Found | ${brand.name}` };
  }

  return {
    title: `${devotional.title} | Devotionals | ${brand.name}`,
  };
}

export default function DevotionalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
