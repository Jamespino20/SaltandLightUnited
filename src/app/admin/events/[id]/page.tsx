"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Check, Spinner } from "@phosphor-icons/react";
import Link from "next/link";
import FileUpload from "@/components/ui/FileUpload";


export default function EventEditPage() {
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
    date: "",
    time: "",
    location: "",
    imageUrl: "",
    featured: false,
  });

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          const dt = new Date(d.date);
          setForm({
            title: d.title || "",
            description: d.description || "",
            date: dt.toISOString().split("T")[0],
            time: dt.toTimeString().slice(0, 5),
            location: d.location || "",
            imageUrl: d.imageUrl || "",
            featured: d.featured || false,
          });
        } else {
          setError("Event not found");
        }
      })
      .catch(() => setError("Failed to load event"))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const dateTime = form.date && form.time
      ? new Date(`${form.date}T${form.time}`).toISOString()
      : form.date
        ? new Date(form.date).toISOString()
        : undefined;

    const body = {
      title: form.title,
      description: form.description || undefined,
      date: dateTime,
      location: form.location || undefined,
      imageUrl: form.imageUrl || undefined,
      featured: form.featured,
    };

    try {
      const url = isNew ? "/api/events" : `/api/events/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to save");
      router.push("/admin/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slu-gray-100" />
          <div className="rounded-2xl border border-slu-gray-200 bg-white p-6 space-y-4">
            <div className="h-10 rounded-xl bg-slu-gray-100" />
            <div className="h-24 rounded-xl bg-slu-gray-100" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 rounded-xl bg-slu-gray-100" />
              <div className="h-10 rounded-xl bg-slu-gray-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/events"
          className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-gray-100 hover:text-slu-black"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slu-black">
          {isNew ? "New Event" : "Edit Event"}
        </h1>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm"
      >
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
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slu-gray-700">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slu-gray-700">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>

        <FileUpload
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
          folder="events"
          label="Event Image"
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, featured: !form.featured })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
              form.featured ? "bg-slu-blue" : "bg-slu-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                form.featured ? "translate-x-5.5" : "translate-x-0.5"
              } mt-0.5`}
            />
          </button>
          <span className="text-sm font-medium text-slu-gray-700">Featured event</span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
          >
            {saving ? <Spinner size={18} className="animate-spin" /> : <Check size={18} />}
            {saving ? "Saving..." : "Save Event"}
          </button>
          <Link
            href="/admin/events"
            className="rounded-xl border border-slu-gray-200 px-5 py-2.5 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
