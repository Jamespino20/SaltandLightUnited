"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Check, Spinner, FilePdf } from "@phosphor-icons/react";
import Link from "next/link";
import FileUpload from "@/components/ui/FileUpload";

export default function FellowshipGuideEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    thumbnailUrl: "",
    category: "",
  });

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/fellowship-guides/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          const g = res.data;
          setForm({
            title: g.title || "",
            description: g.description || "",
            fileUrl: g.fileUrl || "",
            thumbnailUrl: g.thumbnailUrl || "",
            category: g.category || "",
          });
        } else {
          setError("Fellowship guide not found");
        }
      })
      .catch(() => setError("Failed to load fellowship guide"))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      title: form.title,
      description: form.description || undefined,
      fileUrl: form.fileUrl,
      thumbnailUrl: form.thumbnailUrl || undefined,
      category: form.category || undefined,
    };

    try {
      const url = isNew ? "/api/fellowship-guides" : `/api/fellowship-guides/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to save");
      router.push("/admin/fellowship-guides");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slu-gray-100" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slu-gray-200 bg-white p-6 space-y-4">
              <div className="h-10 rounded-xl bg-slu-gray-100" />
              <div className="h-10 rounded-xl bg-slu-gray-100" />
            </div>
            <div className="h-[500px] rounded-2xl border border-slu-gray-200 bg-slu-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/fellowship-guides"
          className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-gray-100 hover:text-slu-black"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slu-black">
          {isNew ? "New Fellowship Guide" : "Edit Fellowship Guide"}
        </h1>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Landscape two-column layout */}
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Left: Metadata */}
        <div className="space-y-5 rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slu-gray-500">Details</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-slu-gray-700">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slu-gray-700">Short Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A brief summary for the resource listing..."
              className="w-full resize-none rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slu-gray-700">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Discipleship, Prayer, Leadership"
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </div>

          <FileUpload
            value={form.fileUrl}
            onChange={(url) => setForm({ ...form, fileUrl: url })}
            folder="fellowship-guides"
            accept="application/pdf"
            label="PDF Guide"
          />

          <FileUpload
            value={form.thumbnailUrl}
            onChange={(url) => setForm({ ...form, thumbnailUrl: url })}
            folder="fellowship-guides"
            accept="image/*"
            label="Thumbnail (optional)"
          />

          {/* Actions pinned to bottom */}
          <div className="flex items-center gap-3 border-t border-slu-gray-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
            >
              {saving ? <Spinner size={18} className="animate-spin" /> : <Check size={18} />}
              {saving ? "Saving..." : "Save"}
            </button>
            <Link
              href="/admin/fellowship-guides"
              className="rounded-xl border border-slu-gray-200 px-5 py-2.5 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Right: PDF Viewer */}
        <div className="rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slu-gray-500">PDF Preview</h2>
          {form.fileUrl ? (
            <div className="overflow-hidden rounded-xl border border-slu-gray-200" style={{ height: "500px" }}>
              <iframe
                src={form.fileUrl}
                className="h-full w-full border-0"
                title="PDF Preview"
              />
            </div>
          ) : (
            <div className="flex h-[500px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slu-gray-200 bg-slu-gray-50 text-slu-gray-400">
              <FilePdf size={48} className="mb-3 opacity-40" />
              <p className="text-sm">Upload a PDF to preview it here</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
