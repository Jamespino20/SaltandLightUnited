"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash } from "@phosphor-icons/react";
import { csrfFetch } from "@/lib/csrf-client";
import type { Event } from "@/types";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    await csrfFetch(`/api/events/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

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
        {loading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-4 w-1/4 rounded bg-slu-gray-200" />
                <div className="h-4 w-1/6 rounded bg-slu-gray-200" />
                <div className="h-4 w-1/5 rounded bg-slu-gray-200" />
                <div className="h-4 w-1/6 rounded bg-slu-gray-200" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-slu-gray-500">No events yet.</p>
            <Link
              href="/admin/events/new"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-slu-blue hover:underline"
            >
              <Plus size={14} />
              Create your first event
            </Link>
          </div>
        ) : (
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
                {events.map((event) => (
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
                          onClick={() => handleDelete(event.id)}
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
        )}
      </div>
    </div>
  );
}
