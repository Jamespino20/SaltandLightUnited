"use client";

import Link from "next/link";
import { Plus, Pencil, Trash } from "@phosphor-icons/react";
import type { Group } from "@/types";

const mockGroups: Group[] = [
  {
    id: "1",
    name: "Worship Team",
    description: "Leading praise and worship during services.",
    meetingSchedule: "Every Saturday, 3:00 PM",
    leader: "Ana Reyes",
    imageUrl: null,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Prayer Warriors",
    description: "Dedicated intercession group for the youth.",
    meetingSchedule: "Every Wednesday, 6:00 PM",
    leader: "Mark Torres",
    imageUrl: null,
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "3",
    name: "Outreach Committee",
    description: "Planning and executing community outreach events.",
    meetingSchedule: "Every 2nd Sunday, 1:00 PM",
    leader: "Joy Martinez",
    imageUrl: null,
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "4",
    name: "Creative Arts",
    description: "Drama, visual arts, and creative expressions of faith.",
    meetingSchedule: "Every Friday, 4:00 PM",
    leader: "Kuya Ben",
    imageUrl: null,
    createdAt: "2026-02-10T10:00:00Z",
  },
];

export default function GroupsPage() {
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
              {mockGroups.map((group) => (
                <tr key={group.id} className="transition-colors hover:bg-slu-gray-50">
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
      </div>
    </div>
  );
}
