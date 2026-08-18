"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash, CheckCircle, XCircle } from "@phosphor-icons/react";

import type { Testimony } from "@/types";

export default function TestimoniesPage() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/testimonies?all=true");
      if (!res.ok) throw new Error("Failed to fetch testimonies");
      const data = await res.json();
      setTestimonies(data.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const handleApprove = async (id: string) => {
    await fetch(`/api/testimonies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true }),
    });
    fetchTestimonies();
  };

  const handleReject = async (id: string) => {
    await fetch(`/api/testimonies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: false }),
    });
    fetchTestimonies();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimony?")) return;
    await fetch(`/api/testimonies/${id}`, { method: "DELETE" });
    fetchTestimonies();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slu-black">Testimonies</h1>
          <p className="text-sm text-slu-gray-500">
            Review and manage member testimonies.
          </p>
        </div>
        <Link
          href="/admin/testimonies/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
        >
          <Plus size={18} />
          New Testimony
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="divide-y divide-slu-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <div className="h-4 w-32 animate-pulse rounded bg-slu-gray-200" />
                <div className="h-4 w-8 animate-pulse rounded bg-slu-gray-200" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-slu-gray-200" />
                <div className="ml-auto flex gap-2">
                  <div className="h-7 w-7 animate-pulse rounded-lg bg-slu-gray-200" />
                  <div className="h-7 w-7 animate-pulse rounded-lg bg-slu-gray-200" />
                  <div className="h-7 w-7 animate-pulse rounded-lg bg-slu-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : testimonies.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-slu-gray-500">
            No testimonies yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slu-gray-200 bg-slu-gray-100">
                  <th className="px-4 py-3 font-semibold text-slu-gray-700">
                    Author
                  </th>
                  <th className="px-4 py-3 font-semibold text-slu-gray-700">
                    Age
                  </th>
                  <th className="px-4 py-3 font-semibold text-slu-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slu-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slu-gray-100">
                {testimonies.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-slu-gray-50">
                    <td className="px-4 py-3 font-medium text-slu-black">
                      {t.authorName}
                    </td>
                    <td className="px-4 py-3 text-slu-gray-600">
                      {t.authorAge ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {t.approved ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <CheckCircle size={14} />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                          <XCircle size={14} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {!t.approved && (
                          <button
                            type="button"
                            onClick={() => handleApprove(t.id)}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                          >
                            Approve
                          </button>
                        )}
                        {t.approved && (
                          <button
                            type="button"
                            onClick={() => handleReject(t.id)}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50"
                          >
                            Reject
                          </button>
                        )}
                        <Link
                          href={`/admin/testimonies/${t.id}`}
                          className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-blue/10 hover:text-slu-blue"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id)}
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
        )}
      </div>
    </div>
  );
}
