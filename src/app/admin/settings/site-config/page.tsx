"use client";

import { useEffect, useState } from "react";
import { Globe, FloppyDisk, Spinner, ArrowLeft, Plus, Trash, CaretUp, CaretDown, Images } from "@phosphor-icons/react";
import Link from "next/link";
import { Section, Field, SettingsNotice, SettingsSkeleton } from "../shared";

interface CarouselSlide {
  id: string;
  label: string;
  caption: string;
  image: string;
}

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
  independenceNote: string;
  carouselSlides: CarouselSlide[];
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
  independenceNote: "",
  carouselSlides: [],
};

const defaultSlides: CarouselSlide[] = [
  { id: "1", label: "Teen Nights", caption: "Ages 13–17 · Hanging out and growing together", image: "/images/history/first_pic.jpg" },
  { id: "2", label: "Tween Hangout", caption: "Ages 10–12 · Games, faith, and friendships", image: "/images/history/second_pic.jpg" },
  { id: "3", label: "Jam Sessions", caption: "Music, songs, and creative worship", image: "/images/history/third_pic.jpg" },
  { id: "4", label: "Real Talk", caption: "Deep conversations about faith and life", image: "/images/history/fourth_pic.webp" },
  { id: "5", label: "Street Team", caption: "Serving the community together", image: "/images/history/fifth_pic.jpg" },
];

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
          const slides = Array.isArray(d.carouselSlides)
            ? d.carouselSlides
            : typeof d.carouselSlides === "string"
              ? (() => { try { return JSON.parse(d.carouselSlides); } catch { return defaultSlides; } })()
              : defaultSlides;
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
            independenceNote: d.independenceNote ?? defaultConfig.independenceNote,
            carouselSlides: slides.length > 0 ? slides : defaultSlides,
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

  const updateSlide = (id: string, field: keyof CarouselSlide, value: string) => {
    setConfig((prev) => ({
      ...prev,
      carouselSlides: prev.carouselSlides.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addSlide = () => {
    const newId = Date.now().toString();
    setConfig((prev) => ({
      ...prev,
      carouselSlides: [
        ...prev.carouselSlides,
        { id: newId, label: "New Slide", caption: "Caption here", image: "/images/history/first_pic.jpg" },
      ],
    }));
  };

  const removeSlide = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      carouselSlides: prev.carouselSlides.filter((s) => s.id !== id),
    }));
  };

  const moveSlide = (id: string, direction: "up" | "down") => {
    setConfig((prev) => {
      const slides = [...prev.carouselSlides];
      const idx = slides.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= slides.length) return prev;
      [slides[idx], slides[target]] = [slides[target], slides[idx]];
      return { ...prev, carouselSlides: slides };
    });
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

      {/* Carousel Slides */}
      <Section title="Homepage Carousel" icon={Images}>
        <p className="text-sm text-slu-gray-500">
          Manage the &ldquo;Salt and Lighters&rdquo; slides shown on the homepage.
        </p>
        <div className="space-y-3">
          {config.carouselSlides.map((slide, i) => (
            <div
              key={slide.id}
              className="flex flex-col gap-3 rounded-xl border border-slu-gray-200 p-4 sm:flex-row sm:items-start"
            >
              <div className="flex-1 space-y-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    value={slide.label}
                    onChange={(e) => updateSlide(slide.id, "label", e.target.value)}
                    placeholder="Label"
                    className="rounded-lg border border-slu-gray-200 px-3 py-2 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                  />
                  <input
                    value={slide.caption}
                    onChange={(e) => updateSlide(slide.id, "caption", e.target.value)}
                    placeholder="Caption"
                    className="rounded-lg border border-slu-gray-200 px-3 py-2 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                  />
                </div>
                <input
                  value={slide.image}
                  onChange={(e) => updateSlide(slide.id, "image", e.target.value)}
                  placeholder="Image path (e.g. /images/history/first_pic.jpg)"
                  className="w-full rounded-lg border border-slu-gray-200 px-3 py-2 text-sm outline-none focus:border-slu-blue focus:ring-2 focus:ring-slu-blue/20"
                />
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveSlide(slide.id, "up")}
                  disabled={i === 0}
                  className="rounded-lg p-1.5 text-slu-gray-400 hover:bg-slu-gray-100 hover:text-slu-black disabled:opacity-30"
                  aria-label="Move up"
                >
                  <CaretUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveSlide(slide.id, "down")}
                  disabled={i === config.carouselSlides.length - 1}
                  className="rounded-lg p-1.5 text-slu-gray-400 hover:bg-slu-gray-100 hover:text-slu-black disabled:opacity-30"
                  aria-label="Move down"
                >
                  <CaretDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => removeSlide(slide.id)}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove slide"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSlide}
          className="mt-2 inline-flex items-center gap-2 rounded-xl border border-dashed border-slu-gray-300 px-4 py-2.5 text-sm font-medium text-slu-gray-500 transition-colors hover:border-slu-blue hover:text-slu-blue"
        >
          <Plus size={16} />
          Add Slide
        </button>
      </Section>
    </div>
  );
}
