"use client";

import {
  MapPin,
  Envelope,
  Phone,
  InstagramLogo,
  FacebookLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { brand } from "@/lib/brand";
import { Reveal } from "@/components/animation/Reveal";
import { WaveTransition } from "@/components/sections/WaveTransition";

export default function ContactPage() {
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
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            We&apos;d love to hear from you. Reach out anytime.
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
                Send Us a Message
              </h2>
              <p className="mt-2 text-slu-gray-500">
                Fill out the form and we&apos;ll get back to you as soon as
                possible.
              </p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-slu-gray-200 bg-white">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfd-uRxe5WYB6gaiH_mSm4rLhGTdmajDXEq3vL1BQssB6Co_A/viewform?embedded=true"
                  title="Salt and Light United contact form"
                  className="h-[720px] w-full border-0"
                  loading="lazy"
                >
                  Loading contact form…
                </iframe>
              </div>

              <p className="mt-3 text-sm text-slu-gray-400">
                The form isn&apos;t loading?{" "}
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfd-uRxe5WYB6gaiH_mSm4rLhGTdmajDXEq3vL1BQssB6Co_A/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slu-blue underline-offset-2 hover:underline"
                >
                  Open it in a new tab
                </a>
                .
              </p>
            </div>

            {/* Location & Social */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slu-black">Find Us</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slu-black">
                        We&apos;re based in Baliwag City
                      </p>
                      <p className="text-sm text-slu-gray-500">{brand.city}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
                      <Envelope size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slu-black">Email</p>
                      <p className="text-sm text-slu-gray-500">
                        Reach us on Facebook or call us directly.
                      </p>
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
                <h3 className="text-lg font-bold text-slu-black">Follow Us</h3>
                <p className="mt-2 text-sm text-slu-gray-500">
                  Stay updated on events and announcements.
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slu-gray-200 text-slu-gray-500 transition-all hover:border-slu-blue hover:text-slu-blue"
                    aria-label="Instagram"
                  >
                    <InstagramLogo size={20} />
                  </a>
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
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slu-gray-200 text-slu-gray-500 transition-all hover:border-slu-blue hover:text-slu-blue"
                    aria-label="YouTube"
                  >
                    <YoutubeLogo size={20} />
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
            We&apos;d love to meet you
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Whether you have a question, need prayer, or just want to say hello —
            reach out. You&apos;re always welcome at Salt and Light United.
          </p>
          <a
            href={brand.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slu-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
          >
            <FacebookLogo size={18} />
            Message us on Facebook
          </a>
        </Reveal>
      </section>
    </>
  );
}
