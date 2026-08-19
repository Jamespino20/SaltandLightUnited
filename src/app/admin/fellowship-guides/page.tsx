"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash, FilePdf, Spinner } from "@phosphor-icons/react";
import Link from "next/link";
import { usePermissions } from "@/lib/usePermissions";

type FellowshipGuide = {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  thumbnailUrl?: string | null;
  category?: string | null;
  createdAt: string;
};

export default function FellowshipGuidesAdminPage() {
  const [guides, setGuides] = useState<FellowshipGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const perms = usePermissions();

  async function loadGuides() {
    setLoading(true);
    try {
      const res = await fetch("/api/fellowship-guides");
      const data = await res.json();
      setGuides(data.success ? data.data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadGuides();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this fellowship guide?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/fellowship-guides/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setGuides((prev) => prev.filter((g) => g.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slu-black">Fellowship Guides</h1>
        {perms.canCreate("pubmats") && (
          <Link
            href="/admin/fellowship-guides/new"
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
          >
            <Plus size={18} /> Add Guide
          </Link>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-slu-gray-200 bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-slu-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-slu-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-slu-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : guides.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slu-gray-300 bg-white p-12 text-center">
          <FilePdf className="mx-auto mb-4 text-slu-gray-400" size={48} />
          <p className="font-semibold text-slu-black">No fellowship guides yet</p>
          <p className="mt-2 text-sm text-slu-gray-500">Upload PDF guides for your community.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="flex items-center gap-4 rounded-xl border border-slu-gray-200 bg-white p-4 transition-colors hover:bg-slu-gray-50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-50">
                <FilePdf size={24} className="text-rose-500" />
              </div>
              <div className="flex-1 truncate">
                <h3 className="font-semibold text-slu-black">{guide.title}</h3>
                {guide.description && (
                  <p className="mt-0.5 text-sm text-slu-gray-500 truncate">{guide.description}</p>
                )}
                {guide.category && (
                  <p className="mt-1 text-xs font-medium text-slu-blue">{guide.category}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {perms.canUpdate("pubmats") && (
                  <Link
                    href={`/admin/fellowship-guides/${guide.id}`}
                    className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-gray-100 hover:text-slu-black"
                  >
                    <Pencil size={16} />
                  </Link>
                )}
                {perms.canDelete("pubmats") && (
                  <button
                    type="button"
                    onClick={() => handleDelete(guide.id)}
                    disabled={deleting === guide.id}
                    className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                  >
                    {deleting === guide.id ? <Spinner size={16} className="animate-spin" /> : <Trash size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
