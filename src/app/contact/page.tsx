"use client";

import {
  MapPin,
  Phone,
  FacebookLogo,
} from "@phosphor-icons/react";
import { brand } from "@/lib/brand";
import { Reveal } from "@/components/animation/Reveal";
import { WaveTransition } from "@/components/sections/WaveTransition";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");
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

      {/* Form + Info */}
      <section className="bg-[#F0F0F0] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form (Google Forms embed) */}
            <div>
              <h2 className="text-2xl font-bold text-slu-black">
                {t("sendMessage")}
              </h2>
              <p className="mt-2 text-slu-gray-500">
                {t("formDescription")}
              </p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-slu-gray-200 bg-white">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfd-uRxe5WYB6gaiH_mSm4rLhGTdmajDXEq3vL1BQssB6Co_A/viewform?embedded=true"
                  title="Salt and Lamp United contact form"
                  className="h-full min-h-[600px] w-full border-0"
                  loading="lazy"
                />
                <div className="hidden py-12 text-center text-slu-gray-500">
                  {t("formLoading")}
                </div>
              </div>

              <p className="mt-3 text-sm text-slu-gray-400">
                {t("formFallback")}{" "}
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfd-uRxe5WYB6gaiH_mSm4rLhGTdmajDXEq3vL1BQssB6Co_A/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slu-blue underline-offset-2 hover:underline"
                >
                  {t("formNewTab")}
                </a>
                .
              </p>
            </div>

            {/* Location & Social */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slu-black">{t("findUs")}</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slu-black">
                        {t("basedIn")}
                      </p>
                      <p className="text-sm text-slu-gray-500">{brand.city}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slu-black">Call Us</p>
                      <p className="text-sm text-slu-gray-500">
                        {brand.phones.join(" · ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slu-black">{t("followUs")}</h3>
                <p className="mt-2 text-sm text-slu-gray-500">
                  {t("followDescription")}
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href={brand.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slu-gray-200 text-slu-gray-500 transition-all hover:border-slu-blue hover:text-slu-blue"
                    aria-label="Facebook"
                  >
                    <FacebookLogo size={20} />
                  </a>
                  <a
                    href={brand.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slu-gray-200 text-slu-gray-500 transition-all hover:border-[#5865F2] hover:text-[#5865F2]"
                    aria-label="Discord"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <WaveTransition from="light" to="blue" />

      {/* CTA */}
      <section className="bg-slu-blue py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("loveToMeet")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            {t("loveDescription")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={brand.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slu-blue transition-colors hover:bg-slu-offwhite"
            >
              <FacebookLogo size={18} />
              {t("messageFacebook")}
            </a>
            <a
              href={brand.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join our Discord
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
