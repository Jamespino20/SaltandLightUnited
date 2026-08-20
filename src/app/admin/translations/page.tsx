"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Translate,
  FloppyDisk,
  Spinner,
  MagnifyingGlass,
  ArrowClockwise,
  Check,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface TranslationsData {
  locale: string;
  namespaces: Record<string, Record<string, string>>;
}

const LOCALES = [
  { code: "en", label: "English" },
  { code: "fil", label: "Filipino" },
];

export default function TranslationsPage() {
  const [data, setData] = useState<TranslationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locale, setLocale] = useState("en");
  const [selectedNs, setSelectedNs] = useState<string>("");
  const [search, setSearch] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const fetchTranslations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/translations?locale=${locale}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        const ns = Object.keys(json.data.namespaces || {});
        if (ns.length > 0 && !selectedNs) {
          setSelectedNs(ns[0]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  useEffect(() => {
    setEdits({});
    setHasChanges(false);
    setSearch("");
  }, [locale, selectedNs]);

  const namespaces = data?.namespaces || {};
  const currentNs = selectedNs || Object.keys(namespaces)[0] || "";
  const currentTranslations = namespaces[currentNs] || {};

  const filteredKeys = Object.keys(currentTranslations).filter((key) =>
    search
      ? key.toLowerCase().includes(search.toLowerCase()) ||
        currentTranslations[key].toLowerCase().includes(search.toLowerCase())
      : true
  );

  const handleEdit = (key: string, value: string) => {
    setEdits((prev) => {
      const next = { ...prev, [key]: value };
      setHasChanges(true);
      return next;
    });
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    setNotice("");
    try {
      const translations: Record<string, string> = {};
      for (const [key, value] of Object.entries(edits)) {
        translations[`${currentNs}.${key}`] = value;
      }
      const res = await fetch("/api/translations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, translations }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setEdits({});
      setHasChanges(false);
      setNotice("Translations saved");
      await fetchTranslations();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setShowResetModal(false);
    setSaving(true);
    try {
      await fetch(`/api/translations?locale=${locale}&namespace=${currentNs}`, {
        method: "DELETE",
      });
      await fetchTranslations();
      setNotice("Namespace reset to defaults");
    } catch {
      setNotice("Failed to reset");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-48 animate-pulse rounded-xl bg-slu-gray-100" />
        <div className="flex gap-4">
          <div className="h-96 w-48 animate-pulse rounded-2xl bg-slu-gray-100" />
          <div className="flex-1 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slu-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={showResetModal}
        title="Reset Translations"
        message="This will remove all database overrides for this namespace and revert to the JSON defaults. This cannot be undone."
        variant="warning"
        confirmLabel="Reset"
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
            <Translate size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slu-black">Translations</h1>
            <p className="mt-0.5 text-sm text-slu-gray-500">
              Edit site translations for each language.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="rounded-xl border border-slu-gray-200 px-3 py-2 text-sm outline-none focus:border-slu-blue"
          >
            {LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          {hasChanges && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              Unsaved changes
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
          >
            {saving ? <Spinner size={16} className="animate-spin" /> : <FloppyDisk size={16} />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-xl border border-slu-blue/20 bg-slu-blue/5 px-4 py-3 text-sm text-slu-blue">
          {notice}
        </div>
      )}

      <div className="flex gap-4 overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-sm">
        {/* Namespace sidebar */}
        <div className="hidden w-52 shrink-0 border-r border-slu-gray-200 bg-slu-gray-50 md:block">
          <div className="border-b border-slu-gray-200 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slu-black">
              <Translate size={16} className="text-slu-gray-400" />
              Namespaces
            </div>
          </div>
          <nav className="admin-scrollable max-h-[60vh] overflow-y-auto p-2">
            {Object.keys(namespaces).map((ns) => (
              <button
                key={ns}
                onClick={() => setSelectedNs(ns)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                  ns === currentNs
                    ? "bg-slu-blue/10 text-slu-blue"
                    : "text-slu-gray-600 hover:bg-slu-gray-100"
                )}
              >
                {ns}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile namespace selector */}
        <div className="border-b border-slu-gray-200 p-3 md:hidden">
          <select
            value={currentNs}
            onChange={(e) => setSelectedNs(e.target.value)}
            className="w-full rounded-xl border border-slu-gray-200 px-3 py-2 text-sm outline-none"
          >
            {Object.keys(namespaces).map((ns) => (
              <option key={ns} value={ns}>
                {ns}
              </option>
            ))}
          </select>
        </div>

        {/* Editor */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slu-gray-200 px-4 py-3">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slu-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search keys or values..."
                className="w-full rounded-lg border border-slu-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-slu-blue"
              />
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slu-gray-200 px-3 py-2 text-sm text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
              title="Reset to JSON defaults"
            >
              <ArrowClockwise size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          <div className="admin-scrollable flex-1 overflow-y-auto p-4">
            {filteredKeys.length === 0 ? (
              <div className="py-12 text-center text-sm text-slu-gray-400">
                {search ? "No matching translations" : "No translations in this namespace"}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredKeys.map((key) => {
                  const original = currentTranslations[key];
                  const edited = edits[key];
                  const isDirty = edited !== undefined && edited !== original;

                  return (
                    <div key={key} className="group">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-medium text-slu-gray-500">
                          {currentNs}.{key}
                        </span>
                        {isDirty && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                            Modified
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <textarea
                          value={edited !== undefined ? edited : original}
                          onChange={(e) => handleEdit(key, e.target.value)}
                          rows={1}
                          className={cn(
                            "flex-1 resize-none rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
                            isDirty
                              ? "border-amber-300 bg-amber-50 focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                              : "border-slu-gray-200 focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                          )}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto";
                            target.style.height = target.scrollHeight + "px";
                          }}
                        />
                        {isDirty && (
                          <button
                            onClick={() => {
                              setEdits((prev) => {
                                const next = { ...prev };
                                delete next[key];
                                if (Object.keys(next).length === 0) setHasChanges(false);
                                return next;
                              });
                            }}
                            className="self-start rounded-lg p-2 text-slu-gray-400 hover:bg-slu-gray-100 hover:text-slu-black"
                            title="Revert"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
