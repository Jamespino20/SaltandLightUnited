"use client";

import Link from "next/link";
import { Plus, Pencil, Trash } from "@phosphor-icons/react";
import type { Event } from "@/types";

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Youth Night — June 2026",
    description: "Monthly youth gathering with worship and games.",
    date: "2026-06-20T18:00:00Z",
    location: "Baliwag City",
    imageUrl: null,
    featured: true,
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Summer Retreat 2026",
    description: "Annual summer retreat for all youth members.",
    date: "2026-07-15T08:00:00Z",
    location: "Campuestohan Highland Resort",
    imageUrl: null,
    featured: true,
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "3",
    title: "Worship Night",
    description: "An evening of praise and worship.",
    date: "2026-06-28T19:00:00Z",
    location: "Church Hall",
    imageUrl: null,
    featured: false,
    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-06-10T10:00:00Z",
  },
  {
    id: "4",
    title: "Bible Study Kickoff",
    description: "Kickoff for the new Bible study series.",
    date: "2026-08-01T17:00:00Z",
    location: "Baliwag City",
    imageUrl: null,
    featured: false,
    createdAt: "2026-06-12T10:00:00Z",
    updatedAt: "2026-06-12T10:00:00Z",
  },
];

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slu-black">Events</h1>
          <p className="text-sm text-slu-gray-500">
            Manage upcoming and past events.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
        >
          <Plus size={18} />
          New Event
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slu-gray-200 bg-slu-gray-100">
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Title
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Location
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Featured
                </th>
                <th className="px-4 py-3 text-right font-semibold text-slu-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slu-gray-100">
              {mockEvents.map((event) => (
                <tr key={event.id} className="transition-colors hover:bg-slu-gray-50">
                  <td className="px-4 py-3 font-medium text-slu-black">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-slu-gray-600">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-slu-gray-600">
                    {event.location ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {event.featured ? (
                      <span className="inline-flex rounded-full bg-slu-blue/10 px-2 py-0.5 text-xs font-medium text-slu-blue">
                        Featured
                      </span>
                    ) : (
                      <span className="text-slu-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/events/${event.id}`}
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
