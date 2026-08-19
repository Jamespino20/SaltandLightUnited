"use client";

import { type ReactNode, FormEvent, useEffect, useState, useRef, useCallback } from "react";
import { BookOpen, Heart, PaperPlaneRight, CaretLeft, CaretRight, X, List, ArrowRight } from "@phosphor-icons/react";
import { WaveTransition } from "@/components/sections/WaveTransition";
import { useTranslations } from "next-intl";

type Devotional = {
  id: string;
  title: string;
  content: string;
  author?: string | null;
  scriptureRef?: string | null;
  publishedAt?: string | null;
};

type Testimony = {
  id: string;
  authorName: string;
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/* ── Modal ── */
function PostModal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out ${
          visible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/5 p-1.5 text-gray-500 transition-colors hover:bg-black/10 hover:text-gray-800"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
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
    <div
      className={`relative transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
    >
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

/* ── Blog Card ── */
function BlogCard({
  item,
  type,
  onClick,
}: {
  item: Devotional | Testimony | Pubmat;
  type: "devotional" | "testimony" | "pubmat";
  onClick: () => void;
}) {
  if (type === "pubmat") {
    const pub = item as Pubmat;
    return (
      <button
        type="button"
        onClick={onClick}
        className="group overflow-hidden rounded-2xl border border-slu-gray-200 bg-white text-left transition-all hover:shadow-md"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pub.imageUrl} alt={pub.title} className="aspect-[4/3] w-full object-cover" />
        <div className="p-5">
          <h3 className="text-lg font-bold text-slu-black group-hover:text-slu-blue">{pub.title}</h3>
          {pub.description && (
            <p className="mt-2 text-sm text-slu-gray-600 line-clamp-2">{stripHtml(pub.description)}</p>
          )}
          {pub.category && <p className="mt-2 text-xs font-semibold text-slu-blue">{pub.category}</p>}
        </div>
      </button>
    );
  }

  if (type === "devotional") {
    const dev = item as Devotional;
    const date = dev.publishedAt ? new Date(dev.publishedAt) : null;
    return (
      <button
        type="button"
        onClick={onClick}
        className="group rounded-2xl border border-slu-gray-200 bg-white p-6 text-left transition-all hover:shadow-md"
      >
        <p className="text-xs font-semibold text-slu-blue">{dev.scriptureRef || "Community reflection"}</p>
        <h3 className="mt-2 text-lg font-bold text-slu-black group-hover:text-slu-blue">{dev.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slu-gray-600 line-clamp-3">{stripHtml(dev.content)}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slu-gray-500">
            {dev.author && <span>By {dev.author}</span>}
            {date && <span>{date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</span>}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-slu-blue opacity-0 transition-opacity group-hover:opacity-100">
            Read <ArrowRight size={14} />
          </span>
        </div>
      </button>
    );
  }

  const ts = item as Testimony;
  const date = new Date(ts.createdAt);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slu-gray-200 bg-slu-gray-50 p-6 text-left transition-all hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slu-blue/10 text-slu-blue">
          <Heart size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slu-black">{ts.authorName}</p>
          <p className="text-xs text-slu-gray-500">
            {date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-slu-gray-600 line-clamp-4">{stripHtml(ts.content)}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-slu-blue opacity-0 transition-opacity group-hover:opacity-100">
        Read <ArrowRight size={14} />
      </span>
    </button>
  );
}

/* ── Main Page ── */
const TABS = ["devotionals", "testimonies", "pubmats"] as const;
type Tab = (typeof TABS)[number];

export default function ResourcesPage() {
  const t = useTranslations("resources");
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [pubmats, setPubmats] = useState<Pubmat[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("devotionals");
  const [viewMode, setViewMode] = useState<"carousel" | "blog">("carousel");
  const [modalItem, setModalItem] = useState<Devotional | Testimony | Pubmat | null>(null);
  const [modalType, setModalType] = useState<"devotional" | "testimony" | "pubmat">("devotional");
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
      const [devRes, testRes, pubRes] = await Promise.all([
        fetch("/api/devotionals"),
        fetch("/api/testimonies"),
        fetch("/api/pubmats"),
      ]);
      const devJson = await devRes.json();
      const testJson = await testRes.json();
      const pubJson = await pubRes.json();
      setDevotionals(devJson.success ? devJson.data : []);
      setTestimonies(testJson.success ? testJson.data : []);
      setPubmats(pubJson.success ? pubJson.data : []);
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

      {/* Tabs + View Toggle */}
      <section className="bg-[#F0F0F0] pt-12 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Tabs */}
            <div className="flex gap-1 rounded-xl bg-white p-1 ring-1 ring-slu-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-slu-navy text-white shadow-sm"
                      : "text-slu-gray-600 hover:text-slu-black"
                  }`}
                >
                  {tab === "devotionals" && <BookOpen size={16} />}
                  {tab === "testimonies" && <Heart size={16} />}
                  {tab === "pubmats" && <BookOpen size={16} />}
                  {t(tab)}
                  <span className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${
                    activeTab === tab ? "bg-white/20" : "bg-slu-gray-100"
                  }`}>
                    {tabCounts[tab]}
                  </span>
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 rounded-xl bg-white p-1 ring-1 ring-slu-gray-200">
              <button
                type="button"
                onClick={() => setViewMode("carousel")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "carousel"
                    ? "bg-slu-navy text-white shadow-sm"
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
                    ? "bg-slu-navy text-white shadow-sm"
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
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-slu-gray-200 bg-white p-6">
                  <div className="mb-2 h-4 w-1/3 rounded bg-slu-gray-200" />
                  <div className="mb-2 h-6 w-1/2 rounded bg-slu-gray-200" />
                  <div className="h-4 w-3/4 rounded bg-slu-gray-200" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Devotionals */}
              {activeTab === "devotionals" && (
                devotionals.length === 0 ? (
                  <EmptyState />
                ) : viewMode === "carousel" ? (
                  <InfiniteCarousel
                    items={devotionals}
                    fadeIn
                    renderItem={(item, i) => (
                      <BlogCard
                        key={item.id}
                        item={item}
                        type="devotional"
                        onClick={() => { setModalItem(item); setModalType("devotional"); }}
                      />
                    )}
                  />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {devotionals.map((item) => (
                      <BlogCard
                        key={item.id}
                        item={item}
                        type="devotional"
                        onClick={() => { setModalItem(item); setModalType("devotional"); }}
                      />
                    ))}
                  </div>
                )
              )}

              {/* Testimonies */}
              {activeTab === "testimonies" && (
                testimonies.length === 0 ? (
                  <EmptyState />
                ) : viewMode === "carousel" ? (
                  <InfiniteCarousel
                    items={testimonies}
                    fadeIn
                    renderItem={(item, i) => (
                      <BlogCard
                        key={item.id}
                        item={item}
                        type="testimony"
                        onClick={() => { setModalItem(item); setModalType("testimony"); }}
                      />
                    )}
                  />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonies.map((item) => (
                      <BlogCard
                        key={item.id}
                        item={item}
                        type="testimony"
                        onClick={() => { setModalItem(item); setModalType("testimony"); }}
                      />
                    ))}
                  </div>
                )
              )}

              {/* Pubmats */}
              {activeTab === "pubmats" && (
                pubmats.length === 0 ? (
                  <EmptyState />
                ) : viewMode === "carousel" ? (
                  <InfiniteCarousel
                    items={pubmats}
                    fadeIn
                    renderItem={(item, i) => (
                      <BlogCard
                        key={item.id}
                        item={item}
                        type="pubmat"
                        onClick={() => { setModalItem(item); setModalType("pubmat"); }}
                      />
                    )}
                  />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pubmats.map((item) => (
                      <BlogCard
                        key={item.id}
                        item={item}
                        type="pubmat"
                        onClick={() => { setModalItem(item); setModalType("pubmat"); }}
                      />
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

      {/* Modal */}
      <PostModal open={!!modalItem} onClose={() => setModalItem(null)}>
        {modalItem && modalType === "devotional" && (
          <div className="p-6">
            <p className="text-xs font-semibold text-slu-blue">
              {(modalItem as Devotional).scriptureRef || "Community reflection"}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slu-black">
              {(modalItem as Devotional).title}
            </h2>
            {(modalItem as Devotional).author && (
              <p className="mt-2 text-sm font-semibold text-slu-gray-500">
                By {(modalItem as Devotional).author}
              </p>
            )}
            <div
              className="prose prose-sm mt-4 max-w-none text-slu-gray-700"
              dangerouslySetInnerHTML={{ __html: (modalItem as Devotional).content }}
            />
          </div>
        )}
        {modalItem && modalType === "testimony" && (
          <div className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slu-blue/10 text-slu-blue">
                <Heart size={14} />
              </div>
              <p className="text-sm font-semibold text-slu-black">
                {(modalItem as Testimony).authorName}
              </p>
            </div>
            <div
              className="prose prose-sm max-w-none text-slu-gray-700"
              dangerouslySetInnerHTML={{ __html: (modalItem as Testimony).content }}
            />
          </div>
        )}
        {modalItem && modalType === "pubmat" && (
          <div className="p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(modalItem as Pubmat).imageUrl}
              alt={(modalItem as Pubmat).title}
              className="mb-4 w-full rounded-xl object-cover"
            />
            <h2 className="text-2xl font-bold text-slu-black">
              {(modalItem as Pubmat).title}
            </h2>
            {(modalItem as Pubmat).category && (
              <p className="mt-2 text-xs font-semibold text-slu-blue">
                {(modalItem as Pubmat).category}
              </p>
            )}
            {(modalItem as Pubmat).description && (
              <div
                className="prose prose-sm mt-3 max-w-none text-slu-gray-700"
                dangerouslySetInnerHTML={{ __html: (modalItem as Pubmat).description! }}
              />
            )}
          </div>
        )}
      </PostModal>
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
