"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Spinner, Warning } from "@phosphor-icons/react";
import Link from "next/link";
import { MainSiteChrome } from "@/components/layout/MainSiteChrome";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import FileUpload from "@/components/ui/FileUpload";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function SubmitTestimonyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    authorName: "",
    authorAge: "",
    contactEmail: "",
    contactPhone: "",
    content: "",
    imageUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const doSubmit = async () => {
    setShowConfirm(false);
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/testimonies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: form.authorName,
          authorAge: form.authorAge ? parseInt(form.authorAge) : undefined,
          contactEmail: form.contactEmail || undefined,
          contactPhone: form.contactPhone || undefined,
          content: form.content,
          imageUrl: form.imageUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to submit");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <MainSiteChrome>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Check size={32} className="text-emerald-600" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-slu-black">Testimony Submitted!</h1>
          <p className="mb-8 text-slu-gray-600">
            Thank you for sharing your testimony. It will be reviewed by our team before being published.
          </p>
          <Link
            href="/testimonies"
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
          >
            <ArrowLeft size={16} /> Back to Testimonies
          </Link>
        </div>
      </MainSiteChrome>
    );
  }

  return (
    <MainSiteChrome>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/testimonies"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slu-gray-500 transition-colors hover:text-slu-black"
        >
          <ArrowLeft size={16} /> Back to Testimonies
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-slu-black sm:text-4xl">Share Your Testimony</h1>
        <p className="mb-8 text-slu-gray-600">
          We&apos;d love to hear how God has worked in your life. Your story can encourage others in their faith journey.
        </p>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <Warning size={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slu-gray-500">About You</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slu-gray-700">Your Name *</label>
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
                  value={form.authorAge}
                  onChange={(e) => setForm({ ...form, authorAge: e.target.value })}
                  className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slu-gray-700">Email <span className="text-slu-gray-400">(optional)</span></label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  placeholder="For follow-up only"
                  className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slu-gray-700">Phone <span className="text-slu-gray-400">(optional)</span></label>
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  placeholder="For follow-up only"
                  className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                />
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slu-gray-500">Photo <span className="text-slu-gray-400 normal-case">(optional)</span></h2>
            <FileUpload
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              folder="testimonies"
              label="Your Photo"
            />
          </div>

          {/* Content */}
          <div className="rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slu-gray-500">Your Testimony *</h2>
            <RichTextEditor
              value={form.content}
              onChange={(content) => setForm({ ...form, content })}
              placeholder="Share how God has worked in your life..."
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving || !form.authorName || !form.content}
              className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
            >
              {saving ? <Spinner size={18} className="animate-spin" /> : <Check size={18} />}
              {saving ? "Submitting..." : "Submit Testimony"}
            </button>
            <Link
              href="/testimonies"
              className="rounded-xl border border-slu-gray-200 px-6 py-3 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
            >
              Cancel
            </Link>
          </div>
        </form>

        <ConfirmModal
          open={showConfirm}
          title="Submit Testimony"
          message="Your testimony will be reviewed by our team before being published. Submit now?"
          variant="info"
          confirmLabel="Submit"
          onConfirm={doSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </MainSiteChrome>
  );
}
