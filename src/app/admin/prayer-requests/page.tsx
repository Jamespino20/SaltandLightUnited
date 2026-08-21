"use client";

import { useEffect, useState } from "react";
import { HandsPraying, Check, Eye, Spinner } from "@phosphor-icons/react";

type PrayerRequest = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function PrayerRequestsAdminPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/prayer-requests");
      const data = await res.json();
      setRequests(data.success ? data.data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRequests();
  }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/prayer-requests/${id}`, { method: "PATCH" });
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, read: true } : r))
    );
  };

  const unreadCount = requests.filter((r) => !r.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slu-black">Prayer Requests</h1>
          <p className="text-sm text-slu-gray-500">
            {unreadCount > 0
              ? `${unreadCount} unread request${unreadCount > 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-slu-gray-200 bg-white p-4">
              <div className="h-4 w-3/4 rounded bg-slu-gray-200" />
              <div className="mt-2 h-3 w-1/3 rounded bg-slu-gray-200" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slu-gray-300 bg-white p-12 text-center">
          <HandsPraying className="mx-auto mb-4 text-slu-gray-400" size={48} />
          <p className="font-semibold text-slu-black">No prayer requests yet</p>
          <p className="mt-2 text-sm text-slu-gray-500">
            Prayer requests submitted through the website will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`rounded-xl border bg-white p-5 transition-colors ${
                req.read
                  ? "border-slu-gray-200"
                  : "border-slu-blue/30 bg-slu-blue/5"
              }`}
            >
              <p className="text-sm text-slu-black whitespace-pre-wrap">{req.message}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slu-gray-400">
                  {new Date(req.createdAt).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {!req.read && (
                  <button
                    type="button"
                    onClick={() => markRead(req.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slu-blue/10 px-3 py-1.5 text-xs font-medium text-slu-blue transition-colors hover:bg-slu-blue/20"
                  >
                    <Eye size={14} />
                    Mark as read
                  </button>
                )}
                {req.read && (
                  <span className="inline-flex items-center gap-1 text-xs text-slu-gray-400">
                    <Check size={14} />
                    Read
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
