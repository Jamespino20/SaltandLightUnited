"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash } from "@phosphor-icons/react";

import type { Pubmat } from "@/types";

export default function PubmatsPage() {
  const [pubmats, setPubmats] = useState<Pubmat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pubmats")
      .then((res) => res.json())
      .then((data) => setPubmats(data.data || []))
      .catch((err) => console.error("Failed to fetch pubmats:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pubmat?")) return;

    try {
      const res = await fetch(`/api/pubmats/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPubmats((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete pubmat:", err);
    }
  };

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
        <Link
          href="/admin/pubmats/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
        >
          <Plus size={18} />
          Upload Pubmat
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
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="h-4 w-32 rounded bg-slu-gray-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-24 rounded bg-slu-gray-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-20 rounded bg-slu-gray-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-8 rounded-lg bg-slu-gray-200" />
                          <div className="h-8 w-8 rounded-lg bg-slu-gray-200" />
                        </div>
                      </td>
                    </tr>
                  ))
                : pubmats.length === 0
                  ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-slu-gray-400">
                        No pubmats found. Upload one to get started.
                      </td>
                    </tr>
                  )
                  : pubmats.map((pub) => (
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
                            onClick={() => handleDelete(pub.id!)}
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
