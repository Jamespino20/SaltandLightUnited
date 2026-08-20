"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ShieldCheck,
  Plus,
  Pencil,
  Trash,
  X,
  Spinner,
  Check,
  FloppyDisk,
} from "@phosphor-icons/react";
import ConfirmModal from "@/components/ui/ConfirmModal";


interface RoleConfig {
  id: string;
  name: string;
  displayName: string;
  permissions: string[];
  isDefault: boolean;
  isSystem: boolean;
  createdAt: string;
}

const PERMISSION_GROUPS: Record<string, { permission: string; label: string }[]> = {
  Events: [
    { permission: "events:create", label: "Create" },
    { permission: "events:read", label: "View" },
    { permission: "events:update", label: "Edit" },
    { permission: "events:delete", label: "Delete" },
  ],
  Devotionals: [
    { permission: "devotionals:create", label: "Create" },
    { permission: "devotionals:read", label: "View" },
    { permission: "devotionals:update", label: "Edit" },
    { permission: "devotionals:delete", label: "Delete" },
  ],
  Testimonies: [
    { permission: "testimonies:create", label: "Create" },
    { permission: "testimonies:read", label: "View" },
    { permission: "testimonies:update", label: "Edit" },
    { permission: "testimonies:delete", label: "Delete" },
    { permission: "testimonies:approve", label: "Approve" },
  ],
  Groups: [
    { permission: "groups:create", label: "Create" },
    { permission: "groups:read", label: "View" },
    { permission: "groups:update", label: "Edit" },
    { permission: "groups:delete", label: "Delete" },
  ],
  Pubmats: [
    { permission: "pubmats:create", label: "Create" },
    { permission: "pubmats:read", label: "View" },
    { permission: "pubmats:update", label: "Edit" },
    { permission: "pubmats:delete", label: "Delete" },
  ],
  Users: [
    { permission: "users:read", label: "View" },
    { permission: "users:create", label: "Create" },
    { permission: "users:update", label: "Edit" },
    { permission: "users:delete", label: "Delete" },
  ],
  Roles: [
    { permission: "roles:read", label: "View" },
    { permission: "roles:create", label: "Create" },
    { permission: "roles:update", label: "Edit" },
    { permission: "roles:delete", label: "Delete" },
  ],
  Audit: [
    { permission: "audit:read", label: "View Logs" },
  ],
  Database: [
    { permission: "database:read", label: "View" },
  ],
  Settings: [
    { permission: "settings:read", label: "View" },
    { permission: "settings:update", label: "Edit" },
  ],
  Translations: [
    { permission: "translations:read", label: "View" },
    { permission: "translations:update", label: "Edit" },
  ],
};

export default function RolesPage() {
  const { data: session } = useSession();
  const permissions = session?.user?.permissions as string[] | undefined;
  const canUpdateRoles = session?.user?.role === "admin" || permissions?.includes("roles:update");
  const canCreateRoles = session?.user?.role === "admin" || permissions?.includes("roles:create");
  const canDeleteRoles = session?.user?.role === "admin" || permissions?.includes("roles:delete");

  const [roles, setRoles] = useState<RoleConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingRole, setEditingRole] = useState<RoleConfig | null>(null);
  const [formPerms, setFormPerms] = useState<string[]>([]);
  const [formName, setFormName] = useState("");
  const [formDisplayName, setFormDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingRole, setDeletingRole] = useState<RoleConfig | null>(null);

  const fetchRoles = () => {
    fetch("/api/roles")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setRoles(res.data);
        else setError(res.error || "Failed to load roles");
      })
      .catch(() => setError("Failed to load roles"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openEdit = (role: RoleConfig) => {
    setEditingRole(role);
    setFormPerms([...role.permissions]);
    setFormName(role.name);
    setFormDisplayName(role.displayName);
    setShowCreateModal(true);
  };

  const openCreate = () => {
    setEditingRole(null);
    setFormPerms([]);
    setFormName("");
    setFormDisplayName("");
    setShowCreateModal(true);
  };

  const togglePerm = (perm: string) => {
    setFormPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleGroup = (groupPerms: string[]) => {
    const allSelected = groupPerms.every((p) => formPerms.includes(p));
    if (allSelected) {
      setFormPerms((prev) => prev.filter((p) => !groupPerms.includes(p)));
    } else {
      setFormPerms((prev) => [...new Set([...prev, ...groupPerms])]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      if (editingRole) {
        const res = await fetch(`/api/roles/${editingRole.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName: formDisplayName,
            permissions: formPerms,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch("/api/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            displayName: formDisplayName,
            permissions: formPerms,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      setShowCreateModal(false);
      fetchRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role: RoleConfig) => {
    if (role.isSystem) {
      setError("Cannot delete system roles");
      return;
    }
    try {
      const res = await fetch(`/api/roles/${role.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      fetchRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete role");
    } finally {
      setDeletingRole(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-slu-gray-100" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slu-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={deletingRole !== null}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${deletingRole?.displayName}"? This cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
        onConfirm={() => deletingRole && handleDelete(deletingRole)}
        onCancel={() => setDeletingRole(null)}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slu-black">Role Management</h1>
          <p className="mt-1 text-sm text-slu-gray-500">
            Create and configure roles with granular permissions.
          </p>
        </div>
        {canCreateRoles && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
          >
            <Plus size={16} />
            New Role
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
          <button onClick={() => setError("")} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className="rounded-xl border border-slu-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slu-blue/10">
                  <ShieldCheck size={18} className="text-slu-blue" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slu-black">
                      {role.displayName}
                    </h3>
                    {role.isSystem && (
                      <span className="rounded-full bg-slu-gray-100 px-2 py-0.5 text-[10px] font-medium text-slu-gray-500">
                        System
                      </span>
                    )}
                    {role.isDefault && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slu-gray-400">
                    {role.name} &middot; {role.permissions.length} permissions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {canUpdateRoles && (
                  <>
                    <button
                      onClick={() => openEdit(role)}
                      className="rounded-lg p-1.5 text-slu-gray-400 hover:bg-slu-gray-100 hover:text-slu-blue"
                    >
                      <Pencil size={14} />
                    </button>
                    {canDeleteRoles && !role.isSystem && (
                      <button
                        onClick={() => setDeletingRole(role)}
                        className="rounded-lg p-1.5 text-slu-gray-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
                const groupPerms = perms.map((p) => p.permission);
                const activeCount = groupPerms.filter((p) =>
                  role.permissions.includes(p)
                ).length;
                if (activeCount === 0) return null;
                return (
                  <span
                    key={group}
                    className="inline-flex items-center gap-1 rounded-full bg-slu-blue/5 px-2.5 py-1 text-[11px] font-medium text-slu-blue"
                  >
                    {group}
                    <span className="text-slu-blue/60">
                      {activeCount}/{perms.length}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}

        {roles.length === 0 && (
          <p className="py-8 text-center text-sm text-slu-gray-400">
            No roles configured
          </p>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slu-black">
                {editingRole ? `Edit ${editingRole.displayName}` : "Create Role"}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-slu-gray-400 hover:text-slu-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {!editingRole && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slu-gray-700">
                    Role Name (identifier)
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. content_manager"
                    className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slu-gray-700">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formDisplayName}
                  onChange={(e) => setFormDisplayName(e.target.value)}
                  placeholder="e.g. Content Manager"
                  className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slu-gray-700">
                    Permissions
                  </label>
                  <span className="text-xs text-slu-gray-400">
                    {formPerms.length} selected
                  </span>
                </div>

                <div className="space-y-4 rounded-xl border border-slu-gray-200 p-4">
                  {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
                    const groupPerms = perms.map((p) => p.permission);
                    const activeCount = groupPerms.filter((p) =>
                      formPerms.includes(p)
                    ).length;
                    const allSelected = activeCount === groupPerms.length;
                    const someSelected = activeCount > 0 && !allSelected;

                    return (
                      <div key={group}>
                        <div className="mb-1.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleGroup(groupPerms)}
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                              allSelected
                                ? "border-slu-blue bg-slu-blue text-white"
                                : someSelected
                                ? "border-slu-blue bg-slu-blue/20 text-slu-blue"
                                : "border-slu-gray-300 bg-white"
                            }`}
                          >
                            {(allSelected || someSelected) && (
                              <Check
                                size={10}
                                className={allSelected ? "text-white" : "text-slu-blue"}
                              />
                            )}
                          </button>
                          <span className="text-xs font-semibold uppercase tracking-wide text-slu-gray-500">
                            {group}
                          </span>
                          <span className="text-[10px] text-slu-gray-400">
                            {activeCount}/{perms.length}
                          </span>
                        </div>
                        <div className="ml-6 flex flex-wrap gap-1.5">
                          {perms.map((perm) => {
                            const isActive = formPerms.includes(perm.permission);
                            return (
                              <button
                                key={perm.permission}
                                type="button"
                                onClick={() => togglePerm(perm.permission)}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                                  isActive
                                    ? "bg-slu-blue text-white"
                                    : "bg-slu-gray-100 text-slu-gray-500 hover:bg-slu-gray-200"
                                }`}
                              >
                                {isActive && <Check size={10} />}
                                {perm.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving || (!editingRole && !formName)}
                  className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
                >
                  {saving ? (
                    <Spinner size={16} className="animate-spin" />
                  ) : (
                    <FloppyDisk size={16} />
                  )}
                  {saving
                    ? "Saving..."
                    : editingRole
                    ? "Update Role"
                    : "Create Role"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slu-gray-200 px-5 py-2.5 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
