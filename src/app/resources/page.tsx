"use client";

import { type ReactNode, FormEvent, useEffect, useState, useRef, useCallback } from "react";
import { BookOpen, Heart, PaperPlaneRight, CaretLeft, CaretRight, X } from "@phosphor-icons/react";
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

/* ── Modal (social-media post style) ── */
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

/* ── Main Page ── */
export default function ResourcesPage() {
  const t = useTranslations("resources");
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [pubmats, setPubmats] = useState<Pubmat[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [modalItem, setModalItem] = useState<Devotional | Testimony | null>(null);
  const [modalType, setModalType] = useState<"devotional" | "testimony">("devotional");
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

  function openDevotionalModal(item: Devotional) {
    setModalItem(item);
    setModalType("devotional");
  }

  function openTestimonyModal(item: Testimony) {
    setModalItem(item);
    setModalType("testimony");
  }

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

      {/* Devotionals Carousel */}
      <section className="bg-[#F0F0F0] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slu-black">{t("devotionals")}</h2>
              <p className="text-sm text-slu-gray-500">{t("devotionalsDescription")}</p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slu-gray-500">{t("loadingSubmissions")}</p>
          ) : devotionals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slu-gray-300 bg-white p-8">
              <p className="font-semibold text-slu-black">{t("nothingPublished")}</p>
              <p className="mt-2 text-sm text-slu-gray-500">{t("beFirst")}</p>
            </div>
          ) : (
            <InfiniteCarousel
              items={devotionals}
              fadeIn
              renderItem={(item) => (
                <button
                  type="button"
                  onClick={() => openDevotionalModal(item)}
                  className="w-full rounded-2xl border border-slu-gray-200 bg-white p-6 text-left transition-all hover:shadow-md"
                >
                  <p className="text-xs font-semibold text-slu-blue">
                    {item.scriptureRef || "Community reflection"}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slu-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slu-gray-600 line-clamp-3">
                    {item.content}
                  </p>
                  {item.author && (
                    <p className="mt-3 text-xs font-semibold text-slu-gray-500">By {item.author}</p>
                  )}
                </button>
              )}
            />
          )}
        </div>
      </section>

      {/* Testimonies Carousel */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
              <Heart size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slu-black">{t("testimonies")}</h2>
              <p className="text-sm text-slu-gray-500">{t("storiesDescription")}</p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slu-gray-500">{t("loadingSubmissions")}</p>
          ) : testimonies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slu-gray-300 bg-[#F0F0F0] p-8">
              <p className="font-semibold text-slu-black">{t("nothingPublished")}</p>
              <p className="mt-2 text-sm text-slu-gray-500">{t("beFirst")}</p>
            </div>
          ) : (
            <InfiniteCarousel
              items={testimonies}
              fadeIn
              renderItem={(item) => (
                <button
                  type="button"
                  onClick={() => openTestimonyModal(item)}
                  className="w-full rounded-2xl border border-slu-gray-200 bg-[#F0F0F0] p-6 text-left transition-all hover:shadow-md"
                >
                  <p className="text-sm leading-relaxed text-slu-gray-600 line-clamp-3">
                    {item.content}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-slu-gray-500">
                    Shared by {item.authorName}
                  </p>
                </button>
              )}
            />
          )}
        </div>
      </section>

      {/* Pubmats Carousel */}
      <section className="bg-[#F0F0F0] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slu-black">{t("pubmats")}</h2>
              <p className="text-sm text-slu-gray-500">{t("pubmatsDescription")}</p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slu-gray-500">{t("loadingSubmissions")}</p>
          ) : pubmats.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slu-gray-300 bg-white p-8">
              <p className="font-semibold text-slu-black">{t("nothingPublished")}</p>
              <p className="mt-2 text-sm text-slu-gray-500">{t("beFirst")}</p>
            </div>
          ) : (
            <InfiniteCarousel
              items={pubmats}
              fadeIn
              renderItem={(item) => (
                <div className="overflow-hidden rounded-2xl border border-slu-gray-200 bg-white transition-all hover:shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-slu-black">{item.title}</h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-slu-gray-500 line-clamp-2">{item.description}</p>
                    )}
                    {item.category && (
                      <p className="mt-2 text-xs font-semibold text-slu-blue">{item.category}</p>
                    )}
                  </div>
                </div>
              )}
            />
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
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slu-gray-700">
              {(modalItem as Devotional).content}
            </p>
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
            <p className="whitespace-pre-line text-sm leading-relaxed text-slu-gray-700">
              {(modalItem as Testimony).content}
            </p>
          </div>
        )}
      </PostModal>
    </>
  );
}
