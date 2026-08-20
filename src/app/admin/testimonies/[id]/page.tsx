"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Check, Spinner } from "@phosphor-icons/react";
import Link from "next/link";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function TestimonyEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [form, setForm] = useState({
    authorName: "",
    authorAge: 0,
    description: "",
    content: "",
    approved: false,
  });

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/testimonies/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setForm({
            authorName: d.authorName || "",
            authorAge: d.authorAge || 0,
            description: d.description || "",
            content: d.content || "",
            approved: d.approved || false,
          });
        } else {
          setError("Testimony not found");
        }
      })
      .catch(() => setError("Failed to load testimony"))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveConfirm(true);
  };

  const doSubmit = async () => {
    setShowSaveConfirm(false);
    setSaving(true);
    setError("");

    const body = {
      authorName: form.authorName,
      authorAge: form.authorAge || undefined,
      description: form.description || undefined,
      content: form.content,
      approved: form.approved,
    };

    try {
      const url = isNew ? "/api/testimonies" : `/api/testimonies/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to save");
      router.push("/admin/testimonies");
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
          href="/admin/testimonies"
          className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-gray-100 hover:text-slu-black"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slu-black">
          {isNew ? "New Testimony" : "Edit Testimony"}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slu-gray-700">Author Name</label>
              <input
                type="text"
                required
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slu-gray-700">Age</label>
              <input
                type="number"
                value={form.authorAge || ""}
                onChange={(e) => setForm({ ...form, authorAge: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slu-gray-700">
              Short Description <span className="text-slu-gray-400">(shown in cards)</span>
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A brief summary for the resource listing..."
              className="w-full resize-none rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </div>

          {/* Approval toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, approved: !form.approved })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                form.approved ? "bg-emerald-600" : "bg-slu-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  form.approved ? "translate-x-5.5" : "translate-x-0.5"
                } mt-0.5`}
              />
            </button>
            <span className="text-sm font-medium text-slu-gray-700">Approved</span>
          </div>

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
              href="/admin/testimonies"
              className="rounded-xl border border-slu-gray-200 px-5 py-2.5 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Right: Rich Text Editor */}
        <div className="rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slu-gray-500">Content</h2>
          <RichTextEditor
            value={form.content}
            onChange={(content) => setForm({ ...form, content })}
            placeholder="Share your testimony..."
          />
        </div>
      </form>

      <ConfirmModal
        open={showSaveConfirm}
        title={form.approved ? "Approve Testimony" : "Save Testimony"}
        message={form.approved ? "This testimony will be approved and visible to all visitors. Continue?" : "Save this testimony as pending review?"}
        variant="info"
        confirmLabel={form.approved ? "Approve & Save" : "Save"}
        onConfirm={doSubmit}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </div>
  );
}
