"use client";

import { useEffect, useState } from "react";
import { Calendar, User, BookOpen, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
interface Devotional {
  id: string;
  title: string;
  content: string;
  author?: string;
  scriptureRef?: string;
  imageUrl?: string;
  publishedAt: string;
}

export default function DevotionalsPage() {
  const t = useTranslations("devotionals");
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/devotionals?upcoming=true")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setDevotionals(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-slu-navy py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <BookOpen className="mx-auto mb-4 text-slu-gold" size={48} />
          <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{t("title")}</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">{t("subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slu-gray-200 bg-white p-6">
                <div className="mb-4 h-48 rounded-xl bg-slu-gray-200" />
                <div className="mb-2 h-6 w-3/4 rounded bg-slu-gray-200" />
                <div className="h-4 w-1/2 rounded bg-slu-gray-200" />
              </div>
            ))}
          </div>
        ) : devotionals.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto mb-4 text-slu-gray-400" size={48} />
            <p className="text-lg text-slu-gray-500">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {devotionals.map((d) => {
              const date = new Date(d.publishedAt);
              return (
                <Link
                  key={d.id}
                  href={`/devotionals/${d.id}`}
                  className="group overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  {d.imageUrl ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={d.imageUrl}
                        alt={d.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-slu-navy/5">
                      <BookOpen className="text-slu-navy/20" size={48} />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-3 text-xs text-slu-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        {date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {d.author && (
                        <span className="inline-flex items-center gap-1">
                          <User size={12} />
                          {d.author}
                        </span>
                      )}
                    </div>
                    <h2 className="mb-2 text-lg font-bold text-slu-black group-hover:text-slu-blue">
                      {d.title}
                    </h2>
                    {d.scriptureRef && (
                      <p className="mb-2 text-sm italic text-slu-gray-600">{d.scriptureRef}</p>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-slu-blue">
                      {t("readMore")} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
