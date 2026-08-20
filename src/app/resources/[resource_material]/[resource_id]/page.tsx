"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, BookOpen, Heart, FilePdf, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MainSiteChrome } from "@/components/layout/MainSiteChrome";

type Devotional = {
  id: string;
  title: string;
  description?: string | null;
  content: string;
  author?: string | null;
  scriptureRef?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  createdAt: string;
};

type Testimony = {
  id: string;
  authorName: string;
  authorAge?: number | null;
  description?: string | null;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
};

type Pubmat = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  category?: string | null;
  createdAt: string;
};

type FellowshipGuide = {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  thumbnailUrl?: string | null;
  category?: string | null;
  createdAt: string;
};

const VALID_TYPES = ["devotionals", "testimonies", "pubmats", "guides"] as const;
type ResourceType = (typeof VALID_TYPES)[number];

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("resources");
  const resourceType = params.resource_material as string;
  const resourceId = params.resource_id as string;

  const [item, setItem] = useState<Devotional | Testimony | Pubmat | FellowshipGuide | null>(null);
  const [related, setRelated] = useState<(Devotional | Testimony | Pubmat | FellowshipGuide)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isValidType = VALID_TYPES.includes(resourceType as ResourceType);

  useEffect(() => {
    if (!isValidType) {
      setError("Invalid resource type");
      setLoading(false);
      return;
    }

    const apiType = resourceType === "guides" ? "fellowship-guides" : resourceType;

    fetch(`/api/${apiType}/${resourceId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setItem(res.data);
          loadRelated(resourceType as ResourceType, resourceId);
        } else {
          setError("Resource not found");
        }
      })
      .catch(() => setError("Failed to load resource"))
      .finally(() => setLoading(false));
  }, [resourceType, resourceId, isValidType]);

  async function loadRelated(type: ResourceType, currentId: string) {
    const apiType = type === "guides" ? "fellowship-guides" : type;
    try {
      const res = await fetch(`/api/${apiType}`);
      const data = await res.json();
      if (data.success) {
        const items = data.data.filter((i: { id: string }) => i.id !== currentId).slice(0, 3);
        setRelated(items);
      }
    } catch {
      // Related load failure is non-critical
    }
  }

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

  if (error || !item || !isValidType) {
    return (
      <MainSiteChrome>
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <BookOpen className="mx-auto mb-4 text-slu-gray-400" size={48} />
          <h1 className="mb-2 text-2xl font-bold text-slu-black">{error || "Not found"}</h1>
          <Link href="/resources" className="mt-4 inline-flex items-center gap-2 text-slu-blue hover:underline">
            <ArrowLeft size={16} /> Back to Resources
          </Link>
        </div>
      </MainSiteChrome>
    );
  }

  const date = new Date((item as Devotional | Testimony | Pubmat | FellowshipGuide).createdAt);
  const typeLabel = resourceType === "guides" ? "Fellowship Guide" : resourceType.charAt(0).toUpperCase() + resourceType.slice(1, -1);

  return (
    <MainSiteChrome>
      <article className="mx-auto max-w-3xl px-4 py-12">
        {/* Back link */}
        <Link
          href="/resources"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slu-gray-500 transition-colors hover:text-slu-black"
        >
          <ArrowLeft size={16} /> Back to Resources
        </Link>

        {/* Type badge */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slu-blue">{typeLabel}</p>

        {/* Devotional */}
        {resourceType === "devotionals" && (() => {
          const dev = item as Devotional;
          const devDate = dev.publishedAt ? new Date(dev.publishedAt) : date;
          return (
            <>
              {dev.imageUrl && (
                <div className="mb-8 overflow-hidden rounded-2xl">
                  <img src={dev.imageUrl} alt={dev.title} className="h-auto w-full object-cover" />
                </div>
              )}
              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slu-gray-500">
                <span className="inline-flex items-center gap-1.5"><Calendar size={14} />{devDate.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</span>
                {dev.author && <span className="inline-flex items-center gap-1.5"><User size={14} />{dev.author}</span>}
              </div>
              <h1 className="mb-4 text-3xl font-bold text-slu-black sm:text-4xl">{dev.title}</h1>
              {dev.scriptureRef && <p className="mb-6 text-base italic text-slu-gray-600">&ldquo;{dev.scriptureRef}&rdquo;</p>}
              <div className="resource-content text-slu-gray-700" dangerouslySetInnerHTML={{ __html: dev.content }} />
            </>
          );
        })()}

        {/* Testimony */}
        {resourceType === "testimonies" && (() => {
          const ts = item as Testimony;
          return (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slu-blue/10 text-slu-blue">
                    <User size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slu-black sm:text-3xl">{ts.authorName}</h1>
                    {ts.authorAge && <p className="text-sm text-slu-gray-500">Age {ts.authorAge}</p>}
                  </div>
                </div>
                <p className="text-sm text-slu-gray-500">
                  <Calendar size={14} className="mr-1 inline" />
                  {date.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div className="mb-6 text-6xl leading-none text-slu-blue/20">&ldquo;</div>
              <div className="resource-content text-slu-gray-700" dangerouslySetInnerHTML={{ __html: ts.content }} />
            </>
          );
        })()}

        {/* Pubmat */}
        {resourceType === "pubmats" && (() => {
          const pub = item as Pubmat;
          return (
            <>
              <div className="mb-8 overflow-hidden rounded-2xl">
                <img src={pub.imageUrl} alt={pub.title} className="h-auto w-full object-cover" />
              </div>
              <h1 className="mb-2 text-3xl font-bold text-slu-black sm:text-4xl">{pub.title}</h1>
              {pub.category && <p className="mb-4 text-sm font-semibold text-slu-blue">{pub.category}</p>}
              {pub.description && <p className="text-lg text-slu-gray-600">{pub.description}</p>}
            </>
          );
        })()}

        {/* Fellowship Guide */}
        {resourceType === "guides" && (() => {
          const guide = item as FellowshipGuide;
          return (
            <>
              <h1 className="mb-2 text-3xl font-bold text-slu-black sm:text-4xl">{guide.title}</h1>
              {guide.category && <p className="mb-4 text-sm font-semibold text-slu-blue">{guide.category}</p>}
              {guide.description && <p className="mb-6 text-lg text-slu-gray-600">{guide.description}</p>}
              <div className="overflow-hidden rounded-2xl border border-slu-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-slu-gray-200 bg-slu-gray-50 px-4 py-2">
                  <span className="text-sm font-medium text-slu-gray-600">PDF Document</span>
                  <a
                    href={guide.fileUrl}
                    download
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slu-blue px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slu-blue-dark"
                  >
                    <ArrowRight size={12} />
                    Download
                  </a>
                </div>
                <iframe
                  src={guide.fileUrl}
                  className="w-full border-0"
                  style={{ height: "700px" }}
                  title={guide.title}
                />
              </div>
            </>
          );
        })()}

        {/* Related Resources */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-slu-gray-200 pt-12">
            <h2 className="mb-6 text-xl font-bold text-slu-black">Related Resources</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => {
                const relType = "scriptureRef" in rel ? "devotionals" : "authorName" in rel ? "testimonies" : "fileUrl" in rel && "category" in rel && !("imageUrl" in rel) ? "guides" : "pubmats";
                const href = `/resources/${relType === "guides" ? "guides" : relType}/${rel.id}`;
                return (
                  <Link
                    key={rel.id}
                    href={href}
                    className="group rounded-xl border border-slu-gray-200 bg-white p-4 transition-all hover:shadow-md"
                  >
                    <h3 className="text-sm font-bold text-slu-black group-hover:text-slu-blue line-clamp-2">
                      {"title" in rel ? rel.title : "authorName" in rel ? rel.authorName : "Untitled"}
                    </h3>
                    <p className="mt-1 text-xs text-slu-gray-500 line-clamp-2">
                      {"description" in rel ? rel.description || "" : ""}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </MainSiteChrome>
  );
}
