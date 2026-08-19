"use client";

import { useEffect, useState } from "react";
import { Globe, FloppyDisk, Spinner, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { Section, Field, SettingsNotice, SettingsSkeleton } from "../shared";

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
};

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
            siteName: d.siteName ?? defaultConfig.siteName,
            siteShortName: d.siteShortName ?? defaultConfig.siteShortName,
            tagline: d.tagline ?? defaultConfig.tagline,
            description: d.description ?? defaultConfig.description,
            city: d.city ?? defaultConfig.city,
            facebookUrl: d.facebookUrl ?? defaultConfig.facebookUrl,
            phones: Array.isArray(d.phones) ? d.phones : [],
            logoUrl: d.logoUrl ?? null,
            faviconUrl: d.faviconUrl ?? null,
            heroTitle1: d.heroTitle1 ?? defaultConfig.heroTitle1,
            heroTitle2: d.heroTitle2 ?? defaultConfig.heroTitle2,
            heroSubtitle: d.heroSubtitle ?? defaultConfig.heroSubtitle,
            aboutTitle: d.aboutTitle ?? defaultConfig.aboutTitle,
            aboutDescription: d.aboutDescription ?? defaultConfig.aboutDescription,
            independenceNote: d.independenceNote ?? defaultConfig.independenceNote,
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
            <h1 className="text-xl font-bold text-slu-black">Site Configuration</h1>
            <p className="mt-0.5 text-sm text-slu-gray-500">
              Manage your site name, content, and public settings.
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
    </div>
  );
}
