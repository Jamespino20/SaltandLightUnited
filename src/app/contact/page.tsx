"use client";

import { useState } from "react";
import {
  MapPin,
  Envelope,
  Phone,
  InstagramLogo,
  FacebookLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { brand } from "@/lib/brand";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slu-blue">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-white/80">
              We&apos;d love to hear from you. Reach out anytime.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-slu-blue-dark/30 blur-3xl" />
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-slu-blue-light/20 blur-3xl" />
      </section>

      {/* Form + Info */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-slu-black">
                Send Us a Message
              </h2>
              <p className="mt-2 text-slu-gray-500">
                Fill out the form and we&apos;ll get back to you as soon as
                possible.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl border border-slu-blue/20 bg-slu-blue/5 p-8 text-center">
                  <p className="text-lg font-semibold text-slu-blue">
                    Message sent!
                  </p>
                  <p className="mt-2 text-sm text-slu-gray-500">
                    Thank you for reaching out. We&apos;ll be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1 block text-sm font-medium text-slu-black"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full rounded-xl border border-slu-gray-200 px-4 py-3 text-sm text-slu-black placeholder:text-slu-gray-400 focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-slu-black"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full rounded-xl border border-slu-gray-200 px-4 py-3 text-sm text-slu-black placeholder:text-slu-gray-400 focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1 block text-sm font-medium text-slu-black"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full resize-none rounded-xl border border-slu-gray-200 px-4 py-3 text-sm text-slu-black placeholder:text-slu-gray-400 focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-slu-blue px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slu-blue-dark hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Location & Social */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slu-black">
                  Find Us
                </h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slu-black">
                        We&apos;re based in Baliwag City
                      </p>
                      <p className="text-sm text-slu-gray-500">
                        {brand.city}
                      </p>
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
                <h3 className="text-lg font-bold text-slu-black">
                  Follow Us
                </h3>
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
          </div>
        </div>
      </section>
    </>
  );
}
