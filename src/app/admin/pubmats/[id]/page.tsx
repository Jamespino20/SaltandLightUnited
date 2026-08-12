"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "@phosphor-icons/react";
import Link from "next/link";

const mockPubmat = {
  id: "1",
  title: "Youth Night Poster",
  description: "Promotional poster for June youth night.",
  category: "Event Poster",
  eventId: "1",
};

export default function PubmatEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: mockPubmat.title,
    description: mockPubmat.description,
    category: mockPubmat.category,
    eventId: mockPubmat.eventId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Saved! (Mock — real save coming later)");
    router.push("/admin/pubmats");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/pubmats"
          className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-gray-100 hover:text-slu-black"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slu-black">Edit Pubmat</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slu-gray-700">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            >
              <option value="Event Poster">Event Poster</option>
              <option value="Social Media">Social Media</option>
              <option value="Scripture Card">Scripture Card</option>
              <option value="Banner">Banner</option>
              <option value="Flyer">Flyer</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slu-gray-700">
              Linked Event ID
            </label>
            <input
              type="text"
              value={form.eventId}
              onChange={(e) =>
                setForm({ ...form, eventId: e.target.value })
              }
              placeholder="Optional"
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </div>
        </div>

        {/* Image preview placeholder */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">
            Image
          </label>
          <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-slu-gray-300 bg-slu-gray-50">
            <span className="text-sm text-slu-gray-400">
              Drag & drop or click to upload
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
          >
            <Check size={18} />
            Save Pubmat
          </button>
          <Link
            href="/admin/pubmats"
            className="rounded-xl border border-slu-gray-200 px-5 py-2.5 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
