"use client";

import Link from "next/link";
import { Plus, Pencil, Trash } from "@phosphor-icons/react";
import type { Devotional } from "@/types";

const mockDevotionals: Devotional[] = [
  {
    id: "1",
    title: "Walking in Faith",
    content: "Faith is not about seeing the path ahead...",
    author: "Pastor James",
    scriptureRef: "Hebrews 11:1",
    imageUrl: null,
    publishedAt: "2026-06-10T08:00:00Z",
    createdAt: "2026-06-09T10:00:00Z",
  },
  {
    id: "2",
    title: "The Power of Prayer",
    content: "Prayer is our direct line to God...",
    author: "Sister Ana",
    scriptureRef: "Philippians 4:6",
    imageUrl: null,
    publishedAt: "2026-06-03T08:00:00Z",
    createdAt: "2026-06-02T10:00:00Z",
  },
  {
    id: "3",
    title: "Love One Another",
    content: "A new command I give you: Love one another...",
    author: "Kuya Mark",
    scriptureRef: "John 13:34",
    imageUrl: null,
    publishedAt: "2026-05-27T08:00:00Z",
    createdAt: "2026-05-26T10:00:00Z",
  },
];

export default function DevotionalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slu-black">Devotionals</h1>
          <p className="text-sm text-slu-gray-500">
            Manage published devotionals.
          </p>
        </div>
        <Link
          href="/admin/devotionals/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
        >
          <Plus size={18} />
          New Devotional
        </Link>
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
                  Author
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Scripture
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Published
                </th>
                <th className="px-4 py-3 text-right font-semibold text-slu-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slu-gray-100">
              {mockDevotionals.map((dev) => (
                <tr key={dev.id} className="transition-colors hover:bg-slu-gray-50">
                  <td className="px-4 py-3 font-medium text-slu-black">
                    {dev.title}
                  </td>
                  <td className="px-4 py-3 text-slu-gray-600">
                    {dev.author ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slu-gray-600">
                    {dev.scriptureRef ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slu-gray-600">
                    {dev.publishedAt
                      ? new Date(dev.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Draft"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/devotionals/${dev.id}`}
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
