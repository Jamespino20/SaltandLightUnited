"use client";

import { useEffect, useState } from "react";
import { Funnel, ArrowClockwise } from "@phosphor-icons/react";

interface AuditLogEntry {
  id: string;
  userId: string | null;
  action: string;
  targetTable: string | null;
  targetId: string | null;
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  user?: { name?: string | null; email?: string | null } | null;
  createdAt: string;
}

interface AuditApiResponse {
  success: boolean;
  data: AuditLogEntry[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 0 });

  const [filter, setFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (filter) params.set("search", filter);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    params.set("page", String(page));

    fetch(`/api/audit?${params.toString()}`)
      .then((r) => r.json())
      .then((json: AuditApiResponse) => {
        if (!cancelled) {
          setLogs(json.success ? json.data : []);
          setPagination(json.pagination);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLogs([]);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [filter, dateFrom, dateTo, page]);

  function resetFilters() {
    setFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slu-black">Audit Log</h1>
        <p className="text-sm text-slu-gray-500">
          Track all admin actions and changes.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slu-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-slu-gray-500">
          <Funnel size={18} />
          <span className="text-sm font-medium">Filters</span>
        </div>
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search action, user, or target..."
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slu-gray-500">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="rounded-xl border border-slu-gray-200 px-3 py-2 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slu-gray-500">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="rounded-xl border border-slu-gray-200 px-3 py-2 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-xl border border-slu-gray-200 px-3 py-2 text-sm text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
        >
          <ArrowClockwise size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slu-gray-200 bg-slu-gray-100">
                <th className="px-4 py-3 font-semibold text-slu-gray-700">Timestamp</th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">User</th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">Action</th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">Target</th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">IP</th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slu-gray-100">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-full animate-pulse rounded bg-slu-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading &&
                logs.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-slu-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-slu-gray-600">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium text-slu-black">
                      {log.user?.name || log.user?.email || "System"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slu-gray-100 px-2.5 py-0.5 text-xs font-medium text-slu-gray-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slu-gray-600">
                      {log.targetTable}
                      {log.targetId && (
                        <span className="ml-1 text-slu-gray-400">#{log.targetId}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slu-gray-500">
                      {log.ipAddress ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slu-gray-600">
                      {[log.city, log.country].filter(Boolean).join(", ") || "—"}
                    </td>
                  </tr>
                ))}

              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slu-gray-400">
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-between text-sm text-slu-gray-500">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-slu-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slu-gray-100"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border border-slu-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slu-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
