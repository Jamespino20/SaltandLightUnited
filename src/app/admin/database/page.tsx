"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
  ArrowUp,
  ArrowDown,
  X,
  Database,
  List,
  Spinner,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ModelInfo {
  key: string;
  label: string;
  columns: string[];
}

interface Meta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  model: string;
  columns: string[];
}

const TIME_COLS = ["createdAt", "updatedAt", "date", "expiresAt", "lastActiveAt", "publishedAt"];

function formatValue(val: unknown, col: string): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "object") return JSON.stringify(val);
  if (TIME_COLS.includes(col) && typeof val === "string") {
    try {
      return new Date(val).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(val);
    }
  }
  const str = String(val);
  return str.length > 80 ? str.slice(0, 77) + "..." : str;
}

export default function DatabaseViewerPage() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [inspectRow, setInspectRow] = useState<Record<string, unknown> | null>(null);
  const [searchDebounce, setSearchDebounce] = useState("");

  useEffect(() => {
    fetch("/api/database")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setModels(res.data.models);
      });
  }, []);

  const fetchData = useCallback(() => {
    if (!selectedModel) return;
    setLoading(true);
    const params = new URLSearchParams({
      model: selectedModel,
      page: String(page),
      pageSize: "25",
      sortField,
      sortDir,
    });
    if (searchDebounce) params.set("search", searchDebounce);

    fetch(`/api/database?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setRows(res.data);
          setMeta(res.meta);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedModel, page, sortField, sortDir, searchDebounce]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [selectedModel, searchDebounce]);

  const handleSort = (col: string) => {
    if (sortField === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(col);
      setSortDir("asc");
    }
  };

  const handleInspect = async (row: Record<string, unknown>) => {
    setInspectRow(row);
  };

  const currentModel = models.find((m) => m.key === selectedModel);
  const displayCols = meta?.columns || currentModel?.columns || [];

  return (
    <div className="flex h-full gap-0 overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-sm">
      {/* Model sidebar */}
      <div className="hidden w-52 shrink-0 border-r border-slu-gray-200 bg-slu-gray-50 sm:block">
        <div className="border-b border-slu-gray-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slu-black">
            <Database size={16} className="text-slu-gray-400" />
            Tables
          </div>
        </div>
        <nav className="admin-scrollable overflow-y-auto p-2">
          {models.map((m) => (
            <button
              key={m.key}
              onClick={() => {
                setSelectedModel(m.key);
                setInspectRow(null);
                setSortField("createdAt");
                setSortDir("desc");
                setSearch("");
              }}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                selectedModel === m.key
                  ? "bg-slu-blue text-white"
                  : "text-slu-gray-600 hover:bg-slu-gray-100 hover:text-slu-black"
              )}
            >
              {m.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile model selector */}
      <div className="border-b border-slu-gray-200 px-4 py-3 sm:hidden">
        <select
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            setInspectRow(null);
            setSortField("createdAt");
            setSortDir("desc");
            setSearch("");
          }}
          className="w-full rounded-lg border border-slu-gray-200 px-3 py-2 text-sm"
        >
          <option value="">Select a table...</option>
          {models.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {!selectedModel ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slu-gray-400">
            <List size={40} />
            <p className="text-sm">Select a table to browse</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center gap-3 border-b border-slu-gray-200 px-4 py-3">
              <div className="relative flex-1">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slu-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-slu-gray-200 py-2 pl-9 pr-3 text-sm text-slu-black outline-none transition-colors focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                />
              </div>
              <button
                onClick={fetchData}
                className="flex items-center gap-1.5 rounded-lg border border-slu-gray-200 px-3 py-2 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
              >
                <ArrowsClockwise size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              {meta && (
                <span className="whitespace-nowrap text-xs text-slu-gray-400">
                  {meta.total} record{meta.total !== 1 && "s"}
                </span>
              )}
            </div>

            {/* Table */}
            <div className="admin-scrollable flex-1 overflow-auto">
              {loading && rows.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size={24} className="animate-spin text-slu-blue" />
                </div>
              ) : rows.length === 0 ? (
                <div className="py-12 text-center text-sm text-slu-gray-400">
                  No records found
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 z-10 border-b border-slu-gray-200 bg-slu-gray-50">
                    <tr>
                      {displayCols.map((col) => (
                        <th
                          key={col}
                          onClick={() => handleSort(col)}
                          className="cursor-pointer whitespace-nowrap px-4 py-2.5 font-medium text-slu-gray-600 hover:text-slu-black"
                        >
                          <span className="flex items-center gap-1">
                            {col}
                            {sortField === col &&
                              (sortDir === "asc" ? (
                                <ArrowUp size={12} className="text-slu-blue" />
                              ) : (
                                <ArrowDown size={12} className="text-slu-blue" />
                              ))}
                          </span>
                        </th>
                      ))}
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slu-gray-100">
                    {rows.map((row, i) => (
                      <tr
                        key={(row.id as string) || i}
                        className="transition-colors hover:bg-slu-blue/3"
                      >
                        {displayCols.map((col) => (
                          <td
                            key={col}
                            className="max-w-[200px] truncate px-4 py-2.5 text-slu-gray-700"
                            title={String(row[col] ?? "")}
                          >
                            {formatValue(row[col], col)}
                          </td>
                        ))}
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleInspect(row)}
                            className="rounded-md px-2 py-1 text-xs font-medium text-slu-blue transition-colors hover:bg-slu-blue/10"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slu-gray-200 px-4 py-3">
                <span className="text-xs text-slu-gray-400">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-gray-100 disabled:opacity-30"
                  >
                    <CaretLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                    const start = Math.max(1, Math.min(page - 2, meta.totalPages - 4));
                    const p = start + i;
                    if (p > meta.totalPages) return null;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                          p === page
                            ? "bg-slu-blue text-white"
                            : "text-slu-gray-600 hover:bg-slu-gray-100"
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page >= meta.totalPages}
                    className="rounded-lg p-2 text-slu-gray-500 transition-colors hover:bg-slu-gray-100 disabled:opacity-30"
                  >
                    <CaretRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Inspector panel */}
      {inspectRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slu-gray-200 px-5 py-4">
              <h3 className="text-sm font-semibold text-slu-black">Record Inspector</h3>
              <button
                onClick={() => setInspectRow(null)}
                className="rounded-lg p-1.5 text-slu-gray-400 transition-colors hover:bg-slu-gray-100 hover:text-slu-black"
              >
                <X size={18} />
              </button>
            </div>
            <div className="admin-scrollable overflow-y-auto p-5">
              <dl className="space-y-3">
                {Object.entries(inspectRow).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-[120px_1fr] gap-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slu-gray-400">
                      {key}
                    </dt>
                    <dd className="break-all text-sm text-slu-black">
                      {typeof val === "boolean" ? (
                        <span className={val ? "text-emerald-600" : "text-slu-gray-400"}>
                          {val ? "Yes" : "No"}
                        </span>
                      ) : typeof val === "object" && val !== null ? (
                        <pre className="overflow-x-auto rounded-lg bg-slu-gray-50 p-2 text-xs text-slu-gray-700">
                          {JSON.stringify(val, null, 2)}
                        </pre>
                      ) : val === null || val === undefined ? (
                        <span className="text-slu-gray-300">null</span>
                      ) : (
                        String(val)
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="border-t border-slu-gray-200 px-5 py-3">
              <button
                onClick={() => setInspectRow(null)}
                className="rounded-lg bg-slu-gray-100 px-4 py-2 text-sm font-medium text-slu-gray-700 transition-colors hover:bg-slu-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
