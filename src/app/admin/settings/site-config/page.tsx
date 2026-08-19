"use client";

import { useEffect, useState } from "react";
import {
  Globe,
  FloppyDisk,
  Spinner,
  Bell,
  Warning,
  Trash,
  ArrowLeft,
} from "@phosphor-icons/react";
import Link from "next/link";

interface SiteConfig {
  siteName: string;
  siteShortName: string;
  tagline: string;
  description: string;
  city: string;
  facebookUrl: string;
  phones: string[];
  logoUrl: string | null;
  faviconUrl: string | null;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  independenceNote: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  notifyNewDevotional: boolean;
  notifyNewTestimony: boolean;
  notifyNewPubmat: boolean;
  notifyNewUser: boolean;
}

const defaultConfig: SiteConfig = {
  siteName: "Salt and Light United",
  siteShortName: "SLU",
  tagline: "Be the Salt. Be the Light",
  description: "",
  city: "Baliwag City, Bulacan, Philippines",
  facebookUrl: "",
  phones: [],
  logoUrl: null,
  faviconUrl: null,
  heroTitle1: "Salt",
  heroTitle2: "& Light",
  heroSubtitle: "",
  aboutTitle: "Who We Are",
  aboutDescription: "",
  independenceNote: "",
  maintenanceMode: false,
  maintenanceMessage: "We're currently performing maintenance. Please check back soon.",
  notifyNewDevotional: true,
  notifyNewTestimony: true,
  notifyNewPubmat: true,
  notifyNewUser: true,
};

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slu-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
          <Icon size={18} />
        </div>
        <h2 className="text-lg font-semibold text-slu-black">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slu-gray-700">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-xs text-slu-gray-400">{hint}</p>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slu-gray-200 p-4 transition-colors hover:bg-slu-gray-50">
      <div>
        <p className="text-sm font-medium text-slu-black">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-slu-gray-500">{description}</p>
        )}
      </div>
      <div className="relative ml-4 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="h-6 w-11 rounded-full bg-slu-gray-200 transition-colors peer-checked:bg-slu-blue" />
        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
}

export default function SiteConfigPage() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [phonesInput, setPhonesInput] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setConfig({
            ...defaultConfig,
            ...d,
            phones: Array.isArray(d.phones) ? d.phones : [],
          });
          setPhonesInput(
            (Array.isArray(d.phones) ? d.phones : []).join(", ")
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof SiteConfig, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setNotice("");
    try {
      const phones = phonesInput
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, phones }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setNotice("Settings saved successfully");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await fetch("/api/settings/cache", { method: "POST" });
      setNotice("Cache cleared");
    } catch {
      setNotice("Failed to clear cache");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-slu-gray-100" />
        ))}
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-slu-black">Site Configuration</h1>
            <p className="mt-0.5 text-sm text-slu-gray-500">
              Manage your site name, content, and public settings.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearCache}
            className="inline-flex items-center gap-2 rounded-xl border border-slu-gray-200 px-4 py-2 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
          >
            <Trash size={14} />
            Clear Cache
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
          >
            {saving ? <Spinner size={16} className="animate-spin" /> : <FloppyDisk size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-xl border border-slu-blue/20 bg-slu-blue/5 px-4 py-3 text-sm text-slu-blue">
          {notice}
        </div>
      )}

      {/* General */}
      <Section title="General" icon={Globe}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Site Name" hint="Shown in the header and browser tab">
            <input
              value={config.siteName}
              onChange={(e) => update("siteName", e.target.value)}
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </Field>
          <Field label="Short Name" hint="Used in badges and compact UI">
            <input
              value={config.siteShortName}
              onChange={(e) => update("siteShortName", e.target.value)}
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </Field>
        </div>
        <Field label="Tagline" hint="Short motto shown on the landing page">
          <input
            value={config.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </Field>
        <Field label="Description" hint="Brief description of the community">
          <textarea
            rows={3}
            value={config.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full resize-y rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City" hint="Location shown in the footer">
            <input
              value={config.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </Field>
          <Field label="Facebook URL" hint="Link to your Facebook page">
            <input
              value={config.facebookUrl}
              onChange={(e) => update("facebookUrl", e.target.value)}
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </Field>
        </div>
        <Field label="Phone Numbers" hint="Comma-separated list of contact numbers">
          <input
            value={phonesInput}
            onChange={(e) => setPhonesInput(e.target.value)}
            placeholder="+63 945 442 0780, +63 942 444 7444"
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </Field>
        <Field label="Independence Note" hint="Disclaimer shown in the footer">
          <textarea
            rows={2}
            value={config.independenceNote}
            onChange={(e) => update("independenceNote", e.target.value)}
            className="w-full resize-y rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </Field>
      </Section>

      {/* Hero Section */}
      <Section title="Hero Section" icon={Globe}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title Part 1" hint="First word of the hero heading">
            <input
              value={config.heroTitle1}
              onChange={(e) => update("heroTitle1", e.target.value)}
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </Field>
          <Field label="Title Part 2" hint="Second word of the hero heading">
            <input
              value={config.heroTitle2}
              onChange={(e) => update("heroTitle2", e.target.value)}
              className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
            />
          </Field>
        </div>
        <Field label="Subtitle" hint="Supporting text below the heading">
          <textarea
            rows={2}
            value={config.heroSubtitle}
            onChange={(e) => update("heroSubtitle", e.target.value)}
            className="w-full resize-y rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </Field>
      </Section>

      {/* About Section */}
      <Section title="About Section" icon={Globe}>
        <Field label="About Title">
          <input
            value={config.aboutTitle}
            onChange={(e) => update("aboutTitle", e.target.value)}
            className="w-full rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </Field>
        <Field label="About Description" hint="Shown on the landing page About strip">
          <textarea
            rows={3}
            value={config.aboutDescription}
            onChange={(e) => update("aboutDescription", e.target.value)}
            className="w-full resize-y rounded-xl border border-slu-gray-200 px-4 py-2.5 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
          />
        </Field>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <p className="text-sm text-slu-gray-500">
          Choose which new submissions trigger admin notifications.
        </p>
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

      {/* Advanced */}
      <Section title="Advanced" icon={Warning}>
        <Toggle
          checked={config.maintenanceMode}
          onChange={(v) => update("maintenanceMode", v)}
          label="Maintenance Mode"
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
    </div>
  );
}
