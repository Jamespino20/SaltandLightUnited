"use client";

import Link from "next/link";
import { Plus, Pencil, Trash } from "@phosphor-icons/react";
import type { Pubmat } from "@/types";

const mockPubmats: Pubmat[] = [
  {
    id: "1",
    title: "Youth Night Poster",
    description: "Promotional poster for June youth night.",
    imageUrl: "/pubmats/youth-night-june.jpg",
    category: "Event Poster",
    eventId: "1",
    createdAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Summer Retreat Banner",
    description: "Facebook cover photo for summer retreat.",
    imageUrl: "/pubmats/summer-retreat-banner.jpg",
    category: "Social Media",
    eventId: "2",
    createdAt: "2026-05-20T10:00:00Z",
  },
  {
    id: "3",
    title: "Weekly Verse Card",
    description: "Scripture card for sharing on social media.",
    imageUrl: "/pubmats/weekly-verse.jpg",
    category: "Scripture Card",
    eventId: null,
    createdAt: "2026-06-08T10:00:00Z",
  },
];

export default function PubmatsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slu-black">
            Publication Materials
          </h1>
          <p className="text-sm text-slu-gray-500">
            Manage posters, banners, and social media assets.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
        >
          <Plus size={18} />
          Upload Pubmat
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slu-gray-200 bg-slu-gray-100">
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Title
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Category
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Event
                </th>
                <th className="px-4 py-3 text-right font-semibold text-slu-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slu-gray-100">
              {mockPubmats.map((pub) => (
                <tr key={pub.id} className="transition-colors hover:bg-slu-gray-50">
                  <td className="px-4 py-3 font-medium text-slu-black">
                    {pub.title}
                  </td>
                  <td className="px-4 py-3 text-slu-gray-600">
                    {pub.category ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slu-gray-600">
                    {pub.eventId ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/pubmats/${pub.id}`}
                        className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-blue/10 hover:text-slu-blue"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
