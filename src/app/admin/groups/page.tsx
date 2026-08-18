"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash } from "@phosphor-icons/react";

import type { Group } from "@/types";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/groups")
      .then((res) => res.json())
      .then((data) => setGroups(data.data || []))
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this group?")) return;
    await fetch(`/api/groups/${id}`, { method: "DELETE" });
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slu-black">Groups</h1>
          <p className="text-sm text-slu-gray-500">
            Manage small groups and ministries.
          </p>
        </div>
        <Link
          href="/admin/groups/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
        >
          <Plus size={18} />
          New Group
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slu-gray-200 bg-slu-gray-100">
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Leader
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Schedule
                </th>
                <th className="px-4 py-3 text-right font-semibold text-slu-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slu-gray-100">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="h-4 w-32 rounded bg-slu-gray-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-24 rounded bg-slu-gray-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-40 rounded bg-slu-gray-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-8 rounded-lg bg-slu-gray-200" />
                          <div className="h-8 w-8 rounded-lg bg-slu-gray-200" />
                        </div>
                      </td>
                    </tr>
                  ))
                : groups.map((group) => (
                    <tr
                      key={group.id}
                      className="transition-colors hover:bg-slu-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-slu-black">
                        {group.name}
                      </td>
                      <td className="px-4 py-3 text-slu-gray-600">
                        {group.leader ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slu-gray-600">
                        {group.meetingSchedule ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/groups/${group.id}`}
                            className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-blue/10 hover:text-slu-blue"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(group.id)}
                            className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && groups.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-slu-gray-500">
            No groups found. Create your first group to get started.
          </div>
        )}
      </div>
    </div>
  );
}
