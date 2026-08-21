import type { MetadataRoute } from "next";

const BASE_URL = "https://saltandlightunited.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/groups`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/devotionals`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/testimonies`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/bible`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Fetch dynamic pages from API
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const [devRes, testRes] = await Promise.all([
      fetch(`${BASE_URL}/api/devotionals`),
      fetch(`${BASE_URL}/api/testimonies`),
    ]);

    const devJson = await devRes.json();
    if (devJson.success && Array.isArray(devJson.data)) {
      for (const d of devJson.data) {
        dynamicPages.push({
          url: `${BASE_URL}/devotionals/${d.id}`,
          lastModified: new Date(d.publishedAt || d.createdAt || now),
          changeFrequency: "monthly",
          priority: 0.7,
        });
        dynamicPages.push({
          url: `${BASE_URL}/resources/devotionals/${d.id}`,
          lastModified: new Date(d.publishedAt || d.createdAt || now),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }

    const testJson = await testRes.json();
    if (testJson.success && Array.isArray(testJson.data)) {
      for (const t of testJson.data) {
        dynamicPages.push({
          url: `${BASE_URL}/testimonies/${t.id}`,
          lastModified: new Date(t.createdAt || now),
          changeFrequency: "monthly",
          priority: 0.7,
        });
        dynamicPages.push({
          url: `${BASE_URL}/resources/testimonies/${t.id}`,
          lastModified: new Date(t.createdAt || now),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // API might not be available at build time; skip dynamic pages
  }

  return [...staticPages, ...dynamicPages];
}
