"use client";

import { useEffect, useState } from "react";
import { Bell, FloppyDisk, Spinner, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { Section, Toggle, SettingsNotice, SettingsSkeleton } from "../shared";

interface NotificationConfig {
  notifyNewDevotional: boolean;
  notifyNewTestimony: boolean;
  notifyNewPubmat: boolean;
  notifyNewUser: boolean;
}

const defaults: NotificationConfig = {
  notifyNewDevotional: true,
  notifyNewTestimony: true,
  notifyNewPubmat: true,
  notifyNewUser: true,
};

export default function NotificationsPage() {
  const [config, setConfig] = useState<NotificationConfig>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setConfig({
            notifyNewDevotional: res.data.notifyNewDevotional ?? true,
            notifyNewTestimony: res.data.notifyNewTestimony ?? true,
            notifyNewPubmat: res.data.notifyNewPubmat ?? true,
            notifyNewUser: res.data.notifyNewUser ?? true,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof NotificationConfig, value: boolean) => {
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
      setNotice("Notification settings saved");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
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
            <h1 className="text-xl font-bold text-slu-black">Notifications</h1>
            <p className="mt-0.5 text-sm text-slu-gray-500">
              Choose which new submissions trigger admin notifications.
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
        >
          {saving ? <Spinner size={16} className="animate-spin" /> : <FloppyDisk size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <SettingsNotice notice={notice} />

      <Section title="Notification Preferences" icon={Bell}>
        <Toggle
          checked={config.notifyNewDevotional}
          onChange={(v) => update("notifyNewDevotional", v)}
          label="New Devotional"
          description="Notify when someone submits a new devotional"
        />
        <Toggle
          checked={config.notifyNewTestimony}
          onChange={(v) => update("notifyNewTestimony", v)}
          label="New Testimony"
          description="Notify when someone shares a new testimony"
        />
        <Toggle
          checked={config.notifyNewPubmat}
          onChange={(v) => update("notifyNewPubmat", v)}
          label="New Pubmat"
          description="Notify when a new publication material is uploaded"
        />
        <Toggle
          checked={config.notifyNewUser}
          onChange={(v) => update("notifyNewUser", v)}
          label="New User Signup"
          description="Notify when a new user creates an account"
        />
      </Section>
    </div>
  );
}
