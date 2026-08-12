"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "@phosphor-icons/react";
import Link from "next/link";

const mockTestimony = {
  id: "1",
  authorName: "Maria Santos",
  authorAge: 16,
  content: "God healed my mother during the prayer night at youth fellowship. We had been praying for months, and that night something shifted. My mother felt peace for the first time in years.",
  approved: true,
};

export default function TestimonyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    authorName: mockTestimony.authorName,
    authorAge: mockTestimony.authorAge,
    content: mockTestimony.content,
    approved: mockTestimony.approved,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Saved! (Mock — real save coming later)");
    router.push("/admin/testimonies");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/testimonies"
          className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-gray-100 hover:text-slu-black"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slu-black">Edit Testimony</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slu-gray-700">
              Author Name
            </label>
            <input
              type="text"
              value={form.authorName}
              onChange={(e) =>
                setForm({ ...form, authorName: e.target.value })
              }
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slu-gray-700">
              Age
            </label>
            <input
              type="number"
              value={form.authorAge}
              onChange={(e) =>
                setForm({ ...form, authorAge: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">
            Content
          </label>
          <textarea
            rows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>

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
          <span className="text-sm font-medium text-slu-gray-700">
            Approved
          </span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
          >
            <Check size={18} />
            Save Testimony
          </button>
          <Link
            href="/admin/testimonies"
            className="rounded-xl border border-slu-gray-200 px-5 py-2.5 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
