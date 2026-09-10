import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { brand } from "@/lib/brand";

type Props = { params: Promise<{ resource_material: string; resource_id: string }> };

const TYPE_LABELS: Record<string, string> = {
  devotionals: "Devotional",
  testimonies: "Testimony",
  pubmats: "Pubmat",
  guides: "Fellowship Guide",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resource_material, resource_id } = await params;
  const typeLabel = TYPE_LABELS[resource_material] || resource_material;

  try {
    if (resource_material === "devotionals") {
      const item = await prisma.devotional.findUnique({
        where: { id: resource_id },
        select: { title: true },
      });
      if (item) return { title: `${item.title} | ${typeLabel}s | ${brand.name}` };
    } else if (resource_material === "testimonies") {
      const item = await prisma.testimony.findUnique({
        where: { id: resource_id },
        select: { authorName: true },
      });
      if (item) return { title: `Testimony by ${item.authorName} | ${brand.name}` };
    } else if (resource_material === "pubmats") {
      const item = await prisma.pubmat.findUnique({
        where: { id: resource_id },
        select: { title: true },
      });
      if (item) return { title: `${item.title} | ${typeLabel}s | ${brand.name}` };
    } else if (resource_material === "guides") {
      const item = await prisma.fellowshipGuide.findUnique({
        where: { id: resource_id },
        select: { title: true },
      });
      if (item) return { title: `${item.title} | ${typeLabel} | ${brand.name}` };
    }
  } catch {
    // Fallback to generic title
  }

  return { title: `${typeLabel} | ${brand.name}` };
}

export default function ResourceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
