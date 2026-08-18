"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash } from "@phosphor-icons/react";
import type { Devotional } from "@/types";

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slu-gray-200 bg-slu-gray-100">
              {["Title", "Author", "Scripture", "Published", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className={`px-4 py-3 font-semibold text-slu-gray-700 ${h === "Actions" ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slu-gray-100">
            {[...Array(3)].map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-slu-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-slu-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-slu-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-slu-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-slu-gray-200" />
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-slu-gray-200" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DevotionalsPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevotionals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/devotionals");
      if (!res.ok) throw new Error("Failed to load devotionals");
      const data = await res.json();
      setDevotionals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevotionals();
  }, [fetchDevotionals]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this devotional?")) return;
    try {
      const res = await fetch(`/api/devotionals/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete devotional");
      setDevotionals((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete devotional");
    }
  };

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

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={fetchDevotionals}
            className="mt-3 text-sm font-semibold text-slu-blue hover:underline"
          >
            Retry
          </button>
        </div>
      ) : devotionals.length === 0 ? (
        <div className="rounded-2xl border border-slu-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-slu-gray-500">No devotionals yet.</p>
          <Link
            href="/admin/devotionals/new"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-slu-blue hover:underline"
          >
            <Plus size={14} />
            Write your first devotional
          </Link>
        </div>
      ) : (
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
                {devotionals.map((dev) => (
                  <tr
                    key={dev.id}
                    className="transition-colors hover:bg-slu-gray-50"
                  >
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
                          onClick={() => handleDelete(dev.id)}
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
      )}
    </div>
  );
}
