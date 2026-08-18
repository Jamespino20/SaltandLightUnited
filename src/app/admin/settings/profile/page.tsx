"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Check, Spinner } from "@phosphor-icons/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleNameSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMsg("");

    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setMsg("Name updated successfully");
      await update();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/settings"
          className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-gray-100 hover:text-slu-black"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slu-black">Profile</h1>
      </div>

      {msg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {msg}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleNameSave}
        className="space-y-5 rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slu-black">Account Info</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full rounded-xl border border-slu-gray-200 bg-slu-gray-50 px-4 py-2.5 text-sm text-slu-gray-500"
          />
          <p className="mt-1 text-xs text-slu-gray-400">Email cannot be changed</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slu-gray-700">Role</label>
          <input
            type="text"
            value={user?.role || ""}
            disabled
            className="w-full rounded-xl border border-slu-gray-200 bg-slu-gray-50 px-4 py-2.5 text-sm text-slu-gray-500 capitalize"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
          >
            {saving ? <Spinner size={16} className="animate-spin" /> : <Check size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
