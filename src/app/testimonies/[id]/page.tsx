"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, User, ArrowLeft, Heart } from "@phosphor-icons/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Testimony {
  id: string;
  authorName: string;
  authorAge?: number;
  content: string;
  createdAt: string;
}

export default function TestimonyPage() {
  const t = useTranslations("testimonies");
  const params = useParams();
  const [testimony, setTestimony] = useState<Testimony | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/testimonies/${params.id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setTestimony(res.data);
        } else {
          setError("Testimony not found");
        }
      })
      .catch(() => setError("Failed to load testimony"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 rounded bg-slu-gray-200" />
          <div className="h-8 w-3/4 rounded bg-slu-gray-200" />
          <div className="space-y-3">
            <div className="h-4 rounded bg-slu-gray-200" />
            <div className="h-4 rounded bg-slu-gray-200" />
            <div className="h-4 w-2/3 rounded bg-slu-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !testimony) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <Heart className="mx-auto mb-4 text-slu-gray-400" size={48} />
        <h1 className="mb-2 text-2xl font-bold text-slu-black">{error || "Not found"}</h1>
        <Link
          href="/testimonies"
          className="mt-4 inline-flex items-center gap-2 text-slu-blue hover:underline"
        >
          <ArrowLeft size={16} /> {t("backToList")}
        </Link>
      </div>
    );
  }

  const date = new Date(testimony.createdAt);

  return (
      <article className="mx-auto max-w-3xl px-4 py-12">
        {/* Back link */}
        <Link
          href="/testimonies"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slu-gray-500 transition-colors hover:text-slu-black"
        >
          <ArrowLeft size={16} /> {t("backToList")}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-slu-black sm:text-4xl">
            {t("title")}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slu-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <User size={14} />
              {testimony.authorName}
              {testimony.authorAge ? `, ${testimony.authorAge}` : ""}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} />
              {date.toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Decorative quote mark */}
        <div className="mb-6 text-6xl leading-none text-slu-blue/20">&ldquo;</div>

        {/* Content */}
        <div
          className="resource-content text-slu-gray-700"
          dangerouslySetInnerHTML={{ __html: testimony.content }}
        />
      </article>
  );
}
