"use client";

import Link from "next/link";
import {
  Target,
  Eye,
  BookOpen,
  FacebookLogo,
  Phone,
} from "@phosphor-icons/react";
import { brand } from "@/lib/brand";
import { Reveal } from "@/components/animation/Reveal";
import { WaveTransition } from "@/components/sections/WaveTransition";
import { useTranslations } from "next-intl";

const leaders = [
  {
    name: "Jhulia Cassandra B. Baduria",
    role: "Executive Directives Lead",
    image: "/images/leads/cassy.png",
    description:
      "Founded Salt and Light United in the year 2025 with a heart to build a Christ-centered community where students can know Christ, grow together in faith, and be a light to those around them.",
  },
  {
    name: "Rain Timothy Raymundo",
    role: "OIC Assist Directives / Creatives Lead",
    image: "/images/leads/rain.png",
    description:
      "One of the core members of Salt and Light United, led many fellowships and gatherings as well as inviting members.",
  },
  {
    name: "James Bryant Espino",
    role: "Publications Assist Lead",
    image: "/images/leads/james.png",
    description:
      "Handles SLU's web development and published materials. Also the author of Dawn of Dilemmas, a fiction writing project.",
  },
  {
    name: "Nia Dela Cruz",
    role: "Publications Assist Lead",
    image: "/images/leads/nia.png",
    description:
      "Manages SLU's social media captions and contributes to small creatives work across the community.",
  },
];

function phoneHref(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return digits ? `tel:+${digits}` : "#";
}

export default function AboutPage() {
  const t = useTranslations("about");
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#0A0A0A]">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-slu-blue/30 blur-3xl"
        />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <WaveTransition from="dark" to="light" />

      {/* About Us */}
      <section className="bg-[#F0F0F0] py-16 sm:py-20">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-slu-black sm:text-4xl">
                {t("us.title")}
              </h2>
              <div className="space-y-4 leading-relaxed text-slu-gray-600">
                <p>{t("us.p1")}</p>
                <p>{t("us.p2")}</p>
                <p>{t("us.p3")}</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-2xl border border-slu-blue/20 bg-slu-blue/5 p-8 text-center">
                <p className="text-lg font-semibold italic leading-relaxed text-slu-black">
                  &ldquo;You are the salt of the earth. But if the salt loses
                  its saltiness, how can it be made salty again?&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-slu-blue">
                  — Matthew 5:13
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16 sm:py-20">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" stagger>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slu-gray-200 bg-[#F0F0F0] p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slu-black">
                {t("mission")}
              </h2>
              <p className="mt-4 leading-relaxed text-slu-gray-600">
                {t("missionText")}
              </p>
            </div>
            <div className="rounded-2xl border border-slu-gray-200 bg-[#F0F0F0] p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slu-black">
                {t("vision")}
              </h2>
              <p className="mt-4 leading-relaxed text-slu-gray-600">
                {t("visionText")}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <WaveTransition from="light" to="blue" />

      {/* Our Story */}
      <section className="bg-slu-blue py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slu-blue/15 text-slu-blue-light">
            <BookOpen size={24} />
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("story.title")}
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-white/70">
            <p>{t("story.p1")}</p>
            <p>{t("story.p2")}</p>
          </div>
        </Reveal>
      </section>

      <WaveTransition from="blue" to="light" />

      {/* Leaders */}
      <section className="bg-[#F0F0F0] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slu-black sm:text-4xl">
              {t("leaders.title")}
            </h2>
            <p className="mt-2 text-slu-gray-500">{t("leaders.subtitle")}</p>
          </Reveal>
          <div className="space-y-12 sm:space-y-16">
            {leaders.map((leader, i) => {
              const photoLeft = i % 2 === 0;
              return (
                <Reveal
                  key={leader.name}
                  x={photoLeft ? -60 : 60}
                  delay={i * 0.05}
                >
                  <div
                    className={`flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-12 ${
                      photoLeft ? "" : "sm:flex-row-reverse"
                    }`}
                  >
                    {/* Photo */}
                    <div className="shrink-0">
                      <div className="h-36 w-36 overflow-hidden rounded-full ring-4 ring-slu-blue/20 ring-offset-4 ring-offset-[#F0F0F0] sm:h-40 sm:w-40">
                        <img
                          src={leader.image}
                          alt={leader.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div
                      className={`flex-1 text-center sm:text-left ${
                        photoLeft
                          ? ""
                          : "sm:ml-auto sm:text-right"
                      }`}
                    >
                      <h3 className="text-xl font-bold text-slu-black sm:text-2xl">
                        {leader.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slu-blue sm:text-sm">
                        {leader.role}
                      </p>
                      <p
                        className={`mt-3 text-sm leading-relaxed text-slu-gray-500 sm:text-base ${
                          photoLeft ? "max-w-md" : "sm:ml-auto sm:max-w-md"
                        }`}
                      >
                        {leader.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <WaveTransition from="light" to="blue" />

      {/* Reach Us */}
      <section className="bg-slu-blue py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("reachUs")}
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={brand.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-left text-slu-blue shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <FacebookLogo size={28} />
              <span>
                <span className="block text-xs text-slu-gray-500 uppercase tracking-wide">
                  {t("facebook")}
                </span>
                <span className="block text-sm font-bold">Message us</span>
              </span>
            </Link>
            {brand.phones.map((phone) => (
              <div
                key={phone}
                className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-left text-slu-blue shadow-lg"
              >
                <Phone size={28} />
                <span>
                  <span className="block text-xs text-slu-gray-500 uppercase tracking-wide">
                    Call Us
                  </span>
                  <PhoneLink phone={phone} />
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

function PhoneLink({ phone }: { phone: string }) {
  if (!phone || !phone.replace(/[^\d]/g, "")) {
    return (
      <span className="block text-sm font-bold text-slu-gray-400">{phone}</span>
    );
  }
  return (
    <a
      href={phoneHref(phone)}
      className="block text-sm font-bold hover:underline"
    >
      {phone}
    </a>
  );
}
