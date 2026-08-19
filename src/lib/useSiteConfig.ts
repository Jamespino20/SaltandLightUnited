"use client";

import { useEffect, useState } from "react";
import { brand as fallbackBrand } from "@/lib/brand";

interface SiteConfig {
  siteName: string;
  siteShortName: string;
  tagline: string;
  description: string;
  city: string;
  facebookUrl: string;
  phones: string[];
  logoUrl: string | null;
  faviconUrl: string | null;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  independenceNote: string;
}

const defaultConfig: SiteConfig = {
  siteName: fallbackBrand.name,
  siteShortName: fallbackBrand.shortName,
  tagline: fallbackBrand.tagline,
  description: fallbackBrand.description,
  city: fallbackBrand.city,
  facebookUrl: fallbackBrand.facebookUrl,
  phones: [...fallbackBrand.phones],
  logoUrl: null,
  faviconUrl: null,
  heroTitle1: "Salt",
  heroTitle2: "& Light",
  heroSubtitle: "A Christ-centered community of students and young people growing in faith together.",
  aboutTitle: "Who We Are",
  aboutDescription: fallbackBrand.description,
  independenceNote: fallbackBrand.independenceNote,
};

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setConfig({
            siteName: d.siteName || fallbackBrand.name,
            siteShortName: d.siteShortName || fallbackBrand.shortName,
            tagline: d.tagline || fallbackBrand.tagline,
            description: d.description || fallbackBrand.description,
            city: d.city || fallbackBrand.city,
            facebookUrl: d.facebookUrl || fallbackBrand.facebookUrl,
            phones: Array.isArray(d.phones) ? d.phones : [...fallbackBrand.phones],
            logoUrl: d.logoUrl || null,
            faviconUrl: d.faviconUrl || null,
            heroTitle1: d.heroTitle1 || "Salt",
            heroTitle2: d.heroTitle2 || "& Light",
            heroSubtitle: d.heroSubtitle || "A Christ-centered community of students and young people growing in faith together.",
            aboutTitle: d.aboutTitle || "Who We Are",
            aboutDescription: d.aboutDescription || fallbackBrand.description,
            independenceNote: d.independenceNote || fallbackBrand.independenceNote,
          });
        }
      })
      .catch(() => {});
  }, []);

  return config;
}
