"use client";

import { type ReactNode, FormEvent, useEffect, useState } from "react";
import { BookOpen, Heart, PaperPlaneRight } from "@phosphor-icons/react";
import { WaveTransition } from "@/components/sections/WaveTransition";

type Tab = "Devotionals" | "Testimonies";

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

const tabs: { label: Tab; icon: ReactNode }[] = [
  { label: "Devotionals", icon: <BookOpen size={20} /> },
  { label: "Testimonies", icon: <Heart size={20} /> },
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Devotionals");
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
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
      const [devotionalResponse, testimonyResponse] = await Promise.all([
        fetch("/api/devotionals"),
        fetch("/api/testimonies"),
      ]);
      const devotionalJson = await devotionalResponse.json();
      const testimonyJson = await testimonyResponse.json();
      setDevotionals(devotionalJson.success ? devotionalJson.data : []);
      setTestimonies(testimonyJson.success ? testimonyJson.data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadResources();
  }, []);

  async function submitDevotional(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");
    try {
      const response = await fetch("/api/devotionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(devotionalForm),
      });
      if (!response.ok) throw new Error();
      setDevotionalForm({ title: "", author: "", scriptureRef: "", content: "" });
      setNotice("Thanks. Your devotional was sent for review.");
      await loadResources();
    } catch {
      setNotice("We could not send that yet. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitTestimony(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");
    try {
      const response = await fetch("/api/testimonies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonyForm),
      });
      if (!response.ok) throw new Error();
      setTestimonyForm({ authorName: "", content: "" });
      setNotice("Thanks. Your testimony was sent for review.");
      await loadResources();
    } catch {
      setNotice("We could not send that yet. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const entries = activeTab === "Devotionals" ? devotionals : testimonies;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0A0A0A]">
        <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-slu-blue/40 blur-3xl" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Resources</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            A growing space for SLU devotionals and stories of what God is doing in our lives.
          </p>
        </div>
      </section>

      <WaveTransition from="dark" to="light" />

      <section className="bg-[#F0F0F0] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => {
                  setActiveTab(tab.label);
                  setNotice("");
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === tab.label
                    ? "bg-slu-blue text-white shadow-md"
                    : "border border-slu-gray-200 bg-white text-slu-gray-500 hover:border-slu-blue hover:text-slu-blue"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <h2 className="text-2xl font-bold text-slu-black">
                {activeTab === "Devotionals" ? "Devotionals from the community" : "Stories from the community"}
              </h2>
              <p className="mt-2 max-w-xl text-slu-gray-500">
                {activeTab === "Devotionals"
                  ? "Read a short reflection, then add one of your own. Published submissions appear here after review."
                  : "Share a story of faith, growth, or a moment that encouraged you. Submissions are reviewed before posting."}
              </p>

              {loading ? (
                <p className="mt-8 text-sm text-slu-gray-500">Loading submissions...</p>
              ) : entries.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-slu-gray-300 bg-white p-8">
                  <p className="font-semibold text-slu-black">Nothing published here yet.</p>
                  <p className="mt-2 text-sm text-slu-gray-500">Be the first person to contribute below.</p>
                </div>
              ) : (
                <div className="mt-8 grid gap-5">
                  {activeTab === "Devotionals"
                    ? devotionals.map((item) => (
                        <article key={item.id} className="rounded-2xl border border-slu-gray-200 bg-white p-6">
                          <p className="text-xs font-semibold text-slu-blue">{item.scriptureRef || "Community reflection"}</p>
                          <h3 className="mt-2 text-xl font-bold text-slu-black">{item.title}</h3>
                          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slu-gray-600">{item.content}</p>
                          {item.author && <p className="mt-4 text-xs font-semibold text-slu-gray-500">By {item.author}</p>}
                        </article>
                      ))
                    : testimonies.map((item) => (
                        <article key={item.id} className="rounded-2xl border border-slu-gray-200 bg-white p-6">
                          <p className="text-sm leading-relaxed text-slu-gray-600">{item.content}</p>
                          <p className="mt-4 text-xs font-semibold text-slu-gray-500">Shared by {item.authorName}</p>
                        </article>
                      ))}
                </div>
              )}
            </div>

            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slu-gray-200">
              <h2 className="text-xl font-bold text-slu-black">
                {activeTab === "Devotionals" ? "Drop a devotional" : "Share your testimony"}
              </h2>
              <p className="mt-2 text-sm text-slu-gray-500">Your submission will be reviewed before it appears publicly.</p>

              {activeTab === "Devotionals" ? (
                <form onSubmit={submitDevotional} className="mt-6 space-y-4">
                  <label className="block text-sm font-semibold text-slu-black">Title<input required value={devotionalForm.title} onChange={(e) => setDevotionalForm({ ...devotionalForm, title: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slu-gray-200 px-3 py-2.5 font-normal focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20" /></label>
                  <label className="block text-sm font-semibold text-slu-black">Your name <span className="font-normal text-slu-gray-400">(optional)</span><input value={devotionalForm.author} onChange={(e) => setDevotionalForm({ ...devotionalForm, author: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slu-gray-200 px-3 py-2.5 font-normal focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20" /></label>
                  <label className="block text-sm font-semibold text-slu-black">Scripture reference <span className="font-normal text-slu-gray-400">(optional)</span><input value={devotionalForm.scriptureRef} onChange={(e) => setDevotionalForm({ ...devotionalForm, scriptureRef: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slu-gray-200 px-3 py-2.5 font-normal focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20" /></label>
                  <label className="block text-sm font-semibold text-slu-black">Reflection<textarea required rows={6} value={devotionalForm.content} onChange={(e) => setDevotionalForm({ ...devotionalForm, content: e.target.value })} className="mt-1.5 w-full resize-y rounded-xl border border-slu-gray-200 px-3 py-2.5 font-normal focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20" /></label>
                  <button disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"><PaperPlaneRight size={16} />Send devotional</button>
                </form>
              ) : (
                <form onSubmit={submitTestimony} className="mt-6 space-y-4">
                  <label className="block text-sm font-semibold text-slu-black">Your name<input required value={testimonyForm.authorName} onChange={(e) => setTestimonyForm({ ...testimonyForm, authorName: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slu-gray-200 px-3 py-2.5 font-normal focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20" /></label>
                  <label className="block text-sm font-semibold text-slu-black">Your story<textarea required rows={8} value={testimonyForm.content} onChange={(e) => setTestimonyForm({ ...testimonyForm, content: e.target.value })} className="mt-1.5 w-full resize-y rounded-xl border border-slu-gray-200 px-3 py-2.5 font-normal focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20" /></label>
                  <button disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"><PaperPlaneRight size={16} />Send testimony</button>
                </form>
              )}
              {notice && <p className="mt-4 text-sm font-medium text-slu-blue">{notice}</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
