"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, User, BookOpen, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MainSiteChrome } from "@/components/layout/MainSiteChrome";

interface Devotional {
  id: string;
  title: string;
  content: string;
  author?: string;
  scriptureRef?: string;
  imageUrl?: string;
  publishedAt: string;
}

export default function DevotionalPage() {
  const t = useTranslations("devotionals");
  const params = useParams();
  const router = useRouter();
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/devotionals/${params.id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setDevotional(res.data);
        } else {
          setError("Devotional not found");
        }
      })
      .catch(() => setError("Failed to load devotional"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <MainSiteChrome>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-32 rounded bg-slu-gray-200" />
            <div className="h-64 rounded-2xl bg-slu-gray-200" />
            <div className="h-8 w-3/4 rounded bg-slu-gray-200" />
            <div className="space-y-3">
              <div className="h-4 rounded bg-slu-gray-200" />
              <div className="h-4 rounded bg-slu-gray-200" />
              <div className="h-4 w-2/3 rounded bg-slu-gray-200" />
            </div>
          </div>
        </div>
      </MainSiteChrome>
    );
  }

  if (error || !devotional) {
    return (
      <MainSiteChrome>
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <BookOpen className="mx-auto mb-4 text-slu-gray-400" size={48} />
          <h1 className="mb-2 text-2xl font-bold text-slu-black">{error || "Not found"}</h1>
          <Link
            href="/devotionals"
            className="mt-4 inline-flex items-center gap-2 text-slu-blue hover:underline"
          >
            <ArrowLeft size={16} /> {t("backToList")}
          </Link>
        </div>
      </MainSiteChrome>
    );
  }

  const date = new Date(devotional.publishedAt);

  return (
    <MainSiteChrome>
      <article className="mx-auto max-w-3xl px-4 py-12">
        {/* Back link */}
        <Link
          href="/devotionals"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slu-gray-500 transition-colors hover:text-slu-black"
        >
          <ArrowLeft size={16} /> {t("backToList")}
        </Link>

        {/* Hero image */}
        {devotional.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-2xl">
            <img
              src={devotional.imageUrl}
              alt={devotional.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slu-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={14} />
            {date.toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {devotional.author && (
            <span className="inline-flex items-center gap-1.5">
              <User size={14} />
              {devotional.author}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold text-slu-black sm:text-4xl">
          {devotional.title}
        </h1>

        {/* Scripture reference */}
        {devotional.scriptureRef && (
          <p className="mb-6 text-base italic text-slu-gray-600">
            &ldquo;{devotional.scriptureRef}&rdquo;
          </p>
        )}

        {/* Content */}
        <div
          className="resource-content text-slu-gray-700"
          dangerouslySetInnerHTML={{ __html: devotional.content }}
        />
      </article>
    </MainSiteChrome>
  );
}
