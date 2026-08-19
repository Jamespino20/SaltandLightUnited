"use client";

import { type ReactNode, FormEvent, useEffect, useState, useRef, useCallback } from "react";
import { BookOpen, Heart, PaperPlaneRight, CaretLeft, CaretRight, List, FilePdf } from "@phosphor-icons/react";
import { WaveTransition } from "@/components/sections/WaveTransition";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Devotional = {
  id: string;
  title: string;
  description?: string | null;
  content: string;
  author?: string | null;
  scriptureRef?: string | null;
  publishedAt?: string | null;
};

type Testimony = {
  id: string;
  authorName: string;
  description?: string | null;
  content: string;
  createdAt: string;
};

type Pubmat = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  category?: string | null;
};

type FellowshipGuide = {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  thumbnailUrl?: string | null;
  category?: string | null;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/* ── Infinite Carousel ── */
function InfiniteCarousel<T>({
  items,
  renderItem,
  fadeIn,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  fadeIn?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [visible, setVisible] = useState(!fadeIn);

  useEffect(() => {
    if (fadeIn) {
      const timer = setTimeout(() => setVisible(true), 200);
      return () => clearTimeout(timer);
    }
  }, [fadeIn]);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, items]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > div");
    if (!card) return;
    el.scrollBy({ left: dir === "left" ? -(card.offsetWidth + 24) : card.offsetWidth + 24, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className={`relative transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
      <button
        type="button"
        onClick={() => scroll("left")}
        className={`absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-slu-blue hover:text-white ${canLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-label="Scroll left"
      >
        <CaretLeft size={20} />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, i) => (
          <div key={i} className="snap-start shrink-0 w-[85%] sm:w-[60%] lg:w-[40%]">
            {renderItem(item, i)}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll("right")}
        className={`absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-slu-blue hover:text-white ${canRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-label="Scroll right"
      >
        <CaretRight size={20} />
      </button>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ icon, title, count, color }: { icon: ReactNode; title: string; count: number; color: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slu-black">{title}</h2>
        <p className="text-sm text-slu-gray-500">{count} {count === 1 ? "resource" : "resources"}</p>
      </div>
    </div>
  );
}

/* ── Main Page ── */
const TABS = ["devotionals", "testimonies", "pubmats", "guides"] as const;
type Tab = (typeof TABS)[number];

export default function ResourcesPage() {
  const t = useTranslations("resources");
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [pubmats, setPubmats] = useState<Pubmat[]>([]);
  const [guides, setGuides] = useState<FellowshipGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("devotionals");
  const [viewMode, setViewMode] = useState<"carousel" | "blog">("carousel");
  const [devotionalForm, setDevotionalForm] = useState({
    title: "",
    author: "",
    scriptureRef: "",
    content: "",
  });
  const [testimonyForm, setTestimonyForm] = useState({
    authorName: "",
    content: "",
  });

  async function loadResources() {
    setLoading(true);
    try {
      const [devRes, testRes, pubRes, guideRes] = await Promise.all([
        fetch("/api/devotionals"),
        fetch("/api/testimonies"),
        fetch("/api/pubmats"),
        fetch("/api/fellowship-guides"),
      ]);
      const devJson = await devRes.json();
      const testJson = await testRes.json();
      const pubJson = await pubRes.json();
      const guideJson = await guideRes.json();
      setDevotionals(devJson.success ? devJson.data : []);
      setTestimonies(testJson.success ? testJson.data : []);
      setPubmats(pubJson.success ? pubJson.data : []);
      setGuides(guideJson.success ? guideJson.data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadResources(); }, []);

  async function submitDevotional(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setNotice("");
    try {
      const res = await fetch("/api/devotionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(devotionalForm),
      });
      if (!res.ok) throw new Error();
      setDevotionalForm({ title: "", author: "", scriptureRef: "", content: "" });
      setNotice(t("thanksDevotional"));
      await loadResources();
    } catch {
      setNotice(t("errorSending"));
    } finally {
      setSubmitting(false);
    }
  }

  async function submitTestimony(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setNotice("");
    try {
      const res = await fetch("/api/testimonies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonyForm),
      });
      if (!res.ok) throw new Error();
      setTestimonyForm({ authorName: "", content: "" });
      setNotice(t("thanksTestimony"));
      await loadResources();
    } catch {
      setNotice(t("errorSending"));
    } finally {
      setSubmitting(false);
    }
  }

  const tabCounts: Record<Tab, number> = {
    devotionals: devotionals.length,
    testimonies: testimonies.length,
    pubmats: pubmats.length,
    guides: guides.length,
  };

  const tabLabels: Record<Tab, string> = {
    devotionals: "Devotionals",
    testimonies: "Testimonies",
    pubmats: "Pubmats",
    guides: "Fellowship Guides",
  };

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0A0A0A]">
        <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-slu-blue/40 blur-3xl" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">{t("title")}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">{t("subtitle")}</p>
        </div>
      </section>

      <WaveTransition from="dark" to="light" />

      {/* Controls */}
      <section className="bg-[#F0F0F0] pt-8 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Blog mode: show tabs */}
            {viewMode === "blog" && (
              <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 ring-1 ring-slu-gray-200">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-slu-blue text-white shadow-sm"
                        : "text-slu-gray-600 hover:text-slu-black"
                    }`}
                  >
                    {tabLabels[tab]}
                    <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                      activeTab === tab ? "bg-white/20" : "bg-slu-gray-100"
                    }`}>
                      {tabCounts[tab]}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {viewMode === "carousel" && <div />}

            {/* View Toggle */}
            <div className="flex gap-1 rounded-xl bg-white p-1 ring-1 ring-slu-gray-200">
              <button
                type="button"
                onClick={() => setViewMode("carousel")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "carousel"
                    ? "bg-slu-blue text-white shadow-sm"
                    : "text-slu-gray-600 hover:text-slu-black"
                }`}
              >
                <CaretLeft size={14} className="rotate-90" /> Carousel
              </button>
              <button
                type="button"
                onClick={() => setViewMode("blog")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "blog"
                    ? "bg-slu-blue text-white shadow-sm"
                    : "text-slu-gray-600 hover:text-slu-black"
                }`}
              >
                <List size={14} /> Blog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[#F0F0F0] pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          {loading ? (
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 w-48 animate-pulse rounded bg-slu-gray-200" />
                  <div className="flex gap-6">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-64 w-[40%] shrink-0 animate-pulse rounded-2xl bg-slu-gray-200" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === "carousel" ? (
            /* ══ CAROUSEL: all 4 sections ══ */
            <div className="space-y-12">
              {/* Devotionals */}
              {devotionals.length > 0 && (
                <div>
                  <SectionHeader
                    icon={<BookOpen size={20} className="text-slu-blue" />}
                    title="Devotionals"
                    count={devotionals.length}
                    color="bg-slu-blue/10"
                  />
                  <InfiniteCarousel
                    items={devotionals}
                    fadeIn
                    renderItem={(item) => (
                      <Link
                        href={`/resources/devotionals/${item.id}`}
                        className="block w-full rounded-2xl border border-slu-gray-200 bg-white p-6 transition-all hover:shadow-md"
                      >
                        <p className="text-xs font-semibold text-slu-blue">{item.scriptureRef || "Community reflection"}</p>
                        <h3 className="mt-2 text-lg font-bold text-slu-black">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slu-gray-600 line-clamp-3">
                          {item.description || stripHtml(item.content)}
                        </p>
                        {item.author && <p className="mt-3 text-xs font-semibold text-slu-gray-500">By {item.author}</p>}
                      </Link>
                    )}
                  />
                </div>
              )}

              {/* Testimonies */}
              {testimonies.length > 0 && (
                <div>
                  <SectionHeader
                    icon={<Heart size={20} className="text-slu-blue" />}
                    title="Testimonies"
                    count={testimonies.length}
                    color="bg-slu-blue/10"
                  />
                  <InfiniteCarousel
                    items={testimonies}
                    fadeIn
                    renderItem={(item) => (
                      <Link
                        href={`/resources/testimonies/${item.id}`}
                        className="block w-full rounded-2xl border border-slu-gray-200 bg-slu-gray-50 p-6 transition-all hover:shadow-md"
                      >
                        <p className="text-sm leading-relaxed text-slu-gray-600 line-clamp-3">
                          {item.description || stripHtml(item.content)}
                        </p>
                        <p className="mt-3 text-xs font-semibold text-slu-gray-500">Shared by {item.authorName}</p>
                      </Link>
                    )}
                  />
                </div>
              )}

              {/* Pubmats */}
              {pubmats.length > 0 && (
                <div>
                  <SectionHeader
                    icon={<BookOpen size={20} className="text-slu-blue" />}
                    title="Pubmats"
                    count={pubmats.length}
                    color="bg-slu-blue/10"
                  />
                  <InfiniteCarousel
                    items={pubmats}
                    fadeIn
                    renderItem={(item) => (
                      <Link
                        href={`/resources/pubmats/${item.id}`}
                        className="block overflow-hidden rounded-2xl border border-slu-gray-200 bg-white transition-all hover:shadow-md"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.title} className="aspect-[4/5] w-full object-cover" />
                        <div className="p-4">
                          <h3 className="font-bold text-slu-black">{item.title}</h3>
                          {item.description && <p className="mt-1 text-sm text-slu-gray-500 line-clamp-2">{item.description}</p>}
                          {item.category && <p className="mt-2 text-xs font-semibold text-slu-blue">{item.category}</p>}
                        </div>
                      </Link>
                    )}
                  />
                </div>
              )}

              {/* Fellowship Guides */}
              {guides.length > 0 && (
                <div>
                  <SectionHeader
                    icon={<FilePdf size={20} className="text-slu-blue" />}
                    title="Fellowship Guides"
                    count={guides.length}
                    color="bg-slu-blue/10"
                  />
                  <InfiniteCarousel
                    items={guides}
                    fadeIn
                    renderItem={(item) => (
                      <Link
                        href={`/resources/guides/${item.id}`}
                        className="block overflow-hidden rounded-2xl border border-slu-gray-200 bg-white transition-all hover:shadow-md"
                      >
                        {item.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.thumbnailUrl} alt={item.title} className="aspect-[16/9] w-full object-cover" />
                        ) : (
                          <div className="flex aspect-[16/9] items-center justify-center bg-rose-50">
                            <FilePdf size={48} className="text-rose-300" />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-slu-black">{item.title}</h3>
                          {item.description && <p className="mt-1 text-sm text-slu-gray-500 line-clamp-2">{item.description}</p>}
                          {item.category && <p className="mt-2 text-xs font-semibold text-slu-blue">{item.category}</p>}
                        </div>
                      </Link>
                    )}
                  />
                </div>
              )}

              {devotionals.length === 0 && testimonies.length === 0 && pubmats.length === 0 && guides.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slu-gray-300 bg-white p-12 text-center">
                  <BookOpen className="mx-auto mb-4 text-slu-gray-400" size={48} />
                  <p className="font-semibold text-slu-black">{t("nothingPublished")}</p>
                  <p className="mt-2 text-sm text-slu-gray-500">{t("beFirst")}</p>
                </div>
              )}
            </div>
          ) : (
            /* ══ BLOG: filtered by tab ══ */
            <>
              {activeTab === "devotionals" && (
                devotionals.length === 0 ? <EmptyState /> : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {devotionals.map((item) => (
                      <Link
                        key={item.id}
                        href={`/resources/devotionals/${item.id}`}
                        className="group rounded-2xl border border-slu-gray-200 bg-white p-6 transition-all hover:shadow-md"
                      >
                        <p className="text-xs font-semibold text-slu-blue">{item.scriptureRef || "Community reflection"}</p>
                        <h3 className="mt-2 text-lg font-bold text-slu-black group-hover:text-slu-blue">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slu-gray-600 line-clamp-3">{item.description || stripHtml(item.content)}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-slu-gray-500">
                          {item.author && <span>By {item.author}</span>}
                          <span className="font-medium text-slu-blue opacity-0 transition-opacity group-hover:opacity-100">Read more</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              )}

              {activeTab === "testimonies" && (
                testimonies.length === 0 ? <EmptyState /> : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonies.map((item) => (
                      <Link
                        key={item.id}
                        href={`/resources/testimonies/${item.id}`}
                        className="group rounded-2xl border border-slu-gray-200 bg-slu-gray-50 p-6 transition-all hover:shadow-md"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slu-blue/10 text-slu-blue">
                            <Heart size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slu-black">{item.authorName}</p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slu-gray-600 line-clamp-4">{item.description || stripHtml(item.content)}</p>
                        <span className="mt-3 inline-block text-sm font-medium text-slu-blue opacity-0 transition-opacity group-hover:opacity-100">Read more</span>
                      </Link>
                    ))}
                  </div>
                )
              )}

              {activeTab === "pubmats" && (
                pubmats.length === 0 ? <EmptyState /> : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pubmats.map((item) => (
                      <Link
                        key={item.id}
                        href={`/resources/pubmats/${item.id}`}
                        className="group overflow-hidden rounded-2xl border border-slu-gray-200 bg-white transition-all hover:shadow-md"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-slu-black group-hover:text-slu-blue">{item.title}</h3>
                          {item.description && <p className="mt-2 text-sm text-slu-gray-600 line-clamp-2">{item.description}</p>}
                          {item.category && <p className="mt-2 text-xs font-semibold text-slu-blue">{item.category}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              )}

              {activeTab === "guides" && (
                guides.length === 0 ? <EmptyState /> : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {guides.map((item) => (
                      <Link
                        key={item.id}
                        href={`/resources/guides/${item.id}`}
                        className="group overflow-hidden rounded-2xl border border-slu-gray-200 bg-white transition-all hover:shadow-md"
                      >
                        {item.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.thumbnailUrl} alt={item.title} className="aspect-[16/9] w-full object-cover" />
                        ) : (
                          <div className="flex aspect-[16/9] items-center justify-center bg-rose-50">
                            <FilePdf size={48} className="text-rose-300" />
                          </div>
                        )}
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-slu-black group-hover:text-slu-blue">{item.title}</h3>
                          {item.description && <p className="mt-2 text-sm text-slu-gray-600 line-clamp-2">{item.description}</p>}
                          {item.category && <p className="mt-2 text-xs font-semibold text-slu-blue">{item.category}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </section>

      <WaveTransition from="light" to="dark" />

      {/* Submission Forms */}
      <section className="bg-[#0A0A0A] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-center text-3xl font-bold text-white sm:text-4xl">
            {t("shareWithCommunity")}
          </h2>
          <p className="mb-10 text-center text-white/60">
            {t("submissionNote")}
          </p>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Devotional Form */}
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-slu-blue" />
                <h3 className="text-lg font-bold text-white">{t("dropDevotional")}</h3>
              </div>
              <form onSubmit={submitDevotional} className="space-y-4">
                <label className="block text-sm font-semibold text-white/80">
                  {t("titleLabel")}
                  <input
                    required
                    value={devotionalForm.title}
                    onChange={(e) => setDevotionalForm({ ...devotionalForm, title: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/30 focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-white/80">
                  {t("yourName")}
                  <input
                    required
                    value={devotionalForm.author}
                    onChange={(e) => setDevotionalForm({ ...devotionalForm, author: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/30 focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-white/80">
                  {t("scriptureRef")}
                  <input
                    required
                    value={devotionalForm.scriptureRef}
                    onChange={(e) => setDevotionalForm({ ...devotionalForm, scriptureRef: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/30 focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-white/80">
                  {t("reflection")}
                  <textarea
                    required
                    rows={5}
                    value={devotionalForm.content}
                    onChange={(e) => setDevotionalForm({ ...devotionalForm, content: e.target.value })}
                    className="mt-1.5 w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/30 focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
                  />
                </label>
                <button
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
                >
                  <PaperPlaneRight size={16} />
                  {t("sendDevotional")}
                </button>
              </form>
            </div>

            {/* Testimony Form */}
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="mb-4 flex items-center gap-2">
                <Heart size={18} className="text-slu-blue" />
                <h3 className="text-lg font-bold text-white">{t("shareTestimony")}</h3>
              </div>
              <form onSubmit={submitTestimony} className="space-y-4">
                <label className="block text-sm font-semibold text-white/80">
                  {t("yourName")}
                  <input
                    required
                    value={testimonyForm.authorName}
                    onChange={(e) => setTestimonyForm({ ...testimonyForm, authorName: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/30 focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-white/80">
                  {t("yourStory")}
                  <textarea
                    required
                    rows={8}
                    value={testimonyForm.content}
                    onChange={(e) => setTestimonyForm({ ...testimonyForm, content: e.target.value })}
                    className="mt-1.5 w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/30 focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
                  />
                </label>
                <button
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
                >
                  <PaperPlaneRight size={16} />
                  {t("sendTestimony")}
                </button>
              </form>
            </div>
          </div>

          {notice && (
            <p className="mt-6 text-center text-sm font-medium text-slu-blue">{notice}</p>
          )}
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  const t = useTranslations("resources");
  return (
    <div className="rounded-2xl border border-dashed border-slu-gray-300 bg-white p-12 text-center">
      <BookOpen className="mx-auto mb-4 text-slu-gray-400" size={48} />
      <p className="font-semibold text-slu-black">{t("nothingPublished")}</p>
      <p className="mt-2 text-sm text-slu-gray-500">{t("beFirst")}</p>
    </div>
  );
}
