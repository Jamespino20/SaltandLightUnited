"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  Plus,
  Pencil,
  Trash,
  X,
  Spinner,
  ShieldCheck,
} from "@phosphor-icons/react";
import ConfirmModal from "@/components/ui/ConfirmModal";


interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

const ROLES = ["admin", "editor", "viewer"] as const;

export default function TeamManagementPage() {
  const { data: session } = useSession();
  const currentRole = session?.user?.role;
  const isAdmin = currentRole === "admin";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ email: "", name: "", role: "editor", password: "" });
  const [saving, setSaving] = useState(false);
  const [removingUser, setRemovingUser] = useState<User | null>(null);

  const fetchUsers = () => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setUsers(res.data);
        else setError(res.error || "Failed to load users");
      })
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ email: "", name: "", role: "editor", password: "" });
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ email: user.email, name: user.name || "", role: user.role, password: "" });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: User) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setRemovingUser(null);
    }
  };

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-rose-100 text-rose-700",
      editor: "bg-slu-blue/10 text-slu-blue",
      viewer: "bg-slu-gray-100 text-slu-gray-600",
    };
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[role] || colors.viewer}`}>
        {role === "admin" && <ShieldCheck size={12} />}
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-slu-gray-100" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slu-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={removingUser !== null}
        title="Remove User"
        message={`Are you sure you want to remove ${removingUser?.email}? This cannot be undone.`}
        variant="danger"
        confirmLabel="Remove"
        onConfirm={() => removingUser && handleDelete(removingUser)}
        onCancel={() => setRemovingUser(null)}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slu-black">Team Management</h1>
          <p className="mt-1 text-sm text-slu-gray-500">
            Manage admin users and their roles.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
          >
            <Plus size={16} />
            Add User
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
          <button onClick={() => setError("")} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <div className="rounded-xl border border-slu-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slu-gray-100 text-xs font-medium uppercase tracking-wide text-slu-gray-400">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slu-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slu-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slu-black">{user.name || "—"}</p>
                    <p className="text-xs text-slu-gray-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">{roleBadge(user.role)}</td>
                  <td className="px-4 py-3 text-slu-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          className="rounded-lg p-1.5 text-slu-gray-400 hover:bg-slu-gray-100 hover:text-slu-blue"
                        >
                          <Pencil size={14} />
                        </button>
                        {user.id !== session?.user?.id && (
                          <button
                            onClick={() => setRemovingUser(user)}
                            className="rounded-lg p-1.5 text-slu-gray-400 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <p className="py-8 text-center text-sm text-slu-gray-400">No users found</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slu-black">
                {editingUser ? "Edit User" : "Add User"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slu-gray-400 hover:text-slu-black"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slu-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!!editingUser}
                  className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20 disabled:bg-slu-gray-50"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slu-gray-700">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slu-gray-700">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
              {!editingUser && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slu-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                    placeholder="Min 8 chars, upper, lower, number, special"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
                >
                  {saving ? <Spinner size={16} className="animate-spin" /> : null}
                  {saving ? "Saving..." : editingUser ? "Update User" : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slu-gray-200 px-5 py-2.5 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
