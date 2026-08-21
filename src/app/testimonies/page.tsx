"use client";

import { useEffect, useState } from "react";
import { Calendar, User, Heart, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Testimony {
  id: string;
  authorName: string;
  authorAge?: number;
  content: string;
  createdAt: string;
}

export default function TestimoniesPage() {
  const t = useTranslations("testimonies");
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonies?approved=true")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setTestimonies(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-slu-navy py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Heart className="mx-auto mb-4 text-slu-gold" size={48} />
          <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{t("title")}</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">{t("subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slu-gray-200 bg-white p-6">
                <div className="mb-2 h-6 w-1/2 rounded bg-slu-gray-200" />
                <div className="mb-4 h-4 w-1/3 rounded bg-slu-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 rounded bg-slu-gray-200" />
                  <div className="h-4 rounded bg-slu-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-slu-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : testimonies.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="mx-auto mb-4 text-slu-gray-400" size={48} />
            <p className="text-lg text-slu-gray-500">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonies.map((ts) => {
              const date = new Date(ts.createdAt);
              const excerpt = ts.content.replace(/<[^>]+>/g, "").slice(0, 150);
              return (
                <Link
                  key={ts.id}
                  href={`/testimonies/${ts.id}`}
                  className="group overflow-hidden rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slu-blue/10 text-slu-blue">
                      <User size={20} />
                    </div>
                    <div>
                      <h2 className="font-bold text-slu-black group-hover:text-slu-blue">
                        {ts.authorName}
                        {ts.authorAge ? `, ${ts.authorAge}` : ""}
                      </h2>
                      <p className="text-xs text-slu-gray-500">
                        <Calendar size={10} className="mr-1 inline" />
                        {date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <p className="mb-4 line-clamp-4 text-sm text-slu-gray-600">
                    &ldquo;{excerpt}...&rdquo;
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-slu-blue">
                    {t("readMore")} <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
