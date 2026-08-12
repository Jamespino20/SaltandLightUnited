"use client";

import { useState } from "react";
import { Funnel, ArrowClockwise } from "@phosphor-icons/react";
import type { AuditLog } from "@/types";

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    userId: "u1",
    userName: "Admin User",
    action: "event.create",
    targetTable: "Event",
    targetId: "ev-1",
    ipAddress: "192.168.1.100",
    country: "PH",
    city: "Baliwag",
    userAgent: "Chrome/126.0",
    metadata: null,
    createdAt: "2026-06-12T14:30:00Z",
  },
  {
    id: "2",
    userId: "u1",
    userName: "Admin User",
    action: "testimony.approve",
    targetTable: "Testimony",
    targetId: "t-3",
    ipAddress: "192.168.1.100",
    country: "PH",
    city: "Baliwag",
    userAgent: "Chrome/126.0",
    metadata: null,
    createdAt: "2026-06-12T10:15:00Z",
  },
  {
    id: "3",
    userId: "u2",
    userName: "Staff Ana",
    action: "devotional.publish",
    targetTable: "Devotional",
    targetId: "d-2",
    ipAddress: "10.0.0.55",
    country: "PH",
    city: "Manila",
    userAgent: "Firefox/128.0",
    metadata: null,
    createdAt: "2026-06-11T16:45:00Z",
  },
  {
    id: "4",
    userId: "u1",
    userName: "Admin User",
    action: "event.update",
    targetTable: "Event",
    targetId: "ev-2",
    ipAddress: "192.168.1.100",
    country: "PH",
    city: "Baliwag",
    userAgent: "Chrome/126.0",
    metadata: null,
    createdAt: "2026-06-10T09:00:00Z",
  },
  {
    id: "5",
    userId: "u3",
    userName: "Staff Mark",
    action: "group.update",
    targetTable: "Group",
    targetId: "g-1",
    ipAddress: "172.16.0.10",
    country: "PH",
    city: "Bulacan",
    userAgent: "Safari/17.5",
    metadata: null,
    createdAt: "2026-06-09T11:20:00Z",
  },
  {
    id: "6",
    userId: "u1",
    userName: "Admin User",
    action: "testimony.reject",
    targetTable: "Testimony",
    targetId: "t-5",
    ipAddress: "192.168.1.100",
    country: "PH",
    city: "Baliwag",
    userAgent: "Chrome/126.0",
    metadata: null,
    createdAt: "2026-06-08T14:00:00Z",
  },
];

export default function AuditPage() {
  const [filter, setFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesFilter =
      !filter ||
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      log.userName?.toLowerCase().includes(filter.toLowerCase()) ||
      log.targetTable?.toLowerCase().includes(filter.toLowerCase());

    const logDate = new Date(log.createdAt).toISOString().split("T")[0];
    const matchesDateFrom = !dateFrom || logDate >= dateFrom;
    const matchesDateTo = !dateTo || logDate <= dateTo;

    return matchesFilter && matchesDateFrom && matchesDateTo;
  });

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
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slu-gray-500">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-xl border border-slu-gray-200 px-3 py-2 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slu-gray-500">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-xl border border-slu-gray-200 px-3 py-2 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setFilter("");
            setDateFrom("");
            setDateTo("");
          }}
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
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Timestamp
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  User
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Action
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Target
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  IP
                </th>
                <th className="px-4 py-3 font-semibold text-slu-gray-700">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slu-gray-100">
              {filteredLogs.map((log) => (
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
                    {log.userName ?? "System"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-slu-gray-100 px-2.5 py-0.5 text-xs font-medium text-slu-gray-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slu-gray-600">
                    {log.targetTable}
                    {log.targetId && (
                      <span className="ml-1 text-slu-gray-400">
                        #{log.targetId}
                      </span>
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
              {filteredLogs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-slu-gray-400"
                  >
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
