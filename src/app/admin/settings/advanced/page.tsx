"use client";

import { useEffect, useState } from "react";
import {
  Warning,
  FloppyDisk,
  Spinner,
  ArrowLeft,
  Trash,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import Link from "next/link";
import {
  Section,
  Field,
  Toggle,
  SettingsNotice,
  SettingsSkeleton,
} from "../shared";

interface AdvancedConfig {
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

const defaults: AdvancedConfig = {
  maintenanceMode: false,
  maintenanceMessage:
    "We're currently performing maintenance. Please check back soon.",
};

export default function AdvancedPage() {
  const [config, setConfig] = useState<AdvancedConfig>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [clearingCache, setClearingCache] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setConfig({
            maintenanceMode: res.data.maintenanceMode ?? false,
            maintenanceMessage:
              res.data.maintenanceMessage ?? defaults.maintenanceMessage,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof AdvancedConfig, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setNotice("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setNotice("Advanced settings saved");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      await fetch("/api/settings/cache", { method: "POST" });
      setNotice("Cache cleared successfully");
    } catch {
      setNotice("Failed to clear cache");
    } finally {
      setClearingCache(false);
    }
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="rounded-lg p-1.5 text-slu-gray-400 hover:bg-slu-gray-100 hover:text-slu-black"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slu-black">Advanced</h1>
            <p className="mt-0.5 text-sm text-slu-gray-500">
              Maintenance mode, cache, and system settings.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearCache}
            disabled={clearingCache}
            className="inline-flex items-center gap-2 rounded-xl border border-slu-gray-200 px-4 py-2 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100 disabled:opacity-50"
          >
            {clearingCache ? (
              <Spinner size={14} className="animate-spin" />
            ) : (
              <Trash size={14} />
            )}
            Clear Cache
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
          >
            {saving ? (
              <Spinner size={16} className="animate-spin" />
            ) : (
              <FloppyDisk size={16} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <SettingsNotice notice={notice} />

      <Section title="Maintenance Mode" icon={Warning}>
        <Toggle
          checked={config.maintenanceMode}
          onChange={(v) => update("maintenanceMode", v)}
          label="Enable Maintenance Mode"
          description="When enabled, only admins can access the site"
        />
        {config.maintenanceMode && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-2 text-sm font-medium text-amber-700">
              Maintenance mode is active
            </p>
            <Field label="Maintenance Message" hint="Shown to non-admin visitors">
              <input
                value={config.maintenanceMessage}
                onChange={(e) => update("maintenanceMessage", e.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
              />
            </Field>
          </div>
        )}
      </Section>

      <Section title="Cache" icon={ArrowsClockwise}>
        <p className="text-sm text-slu-gray-500">
          Clear the server-side permissions cache. This forces a fresh read from
          the database on the next request.
        </p>
        <button
          onClick={handleClearCache}
          disabled={clearingCache}
          className="inline-flex items-center gap-2 rounded-xl border border-slu-gray-200 px-4 py-2 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100 disabled:opacity-50"
        >
          {clearingCache ? (
            <Spinner size={14} className="animate-spin" />
          ) : (
            <ArrowsClockwise size={14} />
          )}
          Clear Permissions Cache
        </button>
      </Section>
    </div>
  );
}
