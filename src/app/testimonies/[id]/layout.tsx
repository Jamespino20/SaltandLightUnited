import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { brand } from "@/lib/brand";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const testimony = await prisma.testimony.findUnique({
    where: { id },
    select: { authorName: true },
  });

  if (!testimony) {
    return { title: `Testimony Not Found | ${brand.name}` };
  }

  return {
    title: `Testimony by ${testimony.authorName} | ${brand.name}`,
  };
}

export default function TestimonyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
