"use client";

import Link from "next/link";
import { Target, Eye, BookOpen, FacebookLogo, Phone } from "@phosphor-icons/react";
import { brand } from "@/lib/brand";
import { Reveal } from "@/components/animation/Reveal";
import { WaveTransition } from "@/components/sections/WaveTransition";

const leaders = [
  {
    name: "Community-Led",
    role: "SLU is led by its community of young people serving together",
    image: "/images/history/first_pic.jpg",
  },
];

function phoneHref(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return digits ? `tel:+${digits}` : "#";
}

export default function AboutPage() {
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
            About {brand.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Discover who we are, what we believe, and why we exist.
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
                About Us
              </h2>
              <div className="space-y-4 leading-relaxed text-slu-gray-600">
                <p>
                  We are {brand.name}! A Christ-centered community of students and
                  young people based in Baliwag City who desire to know Jesus, grow
                  in His Word, and live out our faith together.
                </p>
                <p>
                  We believe that lives are transformed through Christ, and that
                  every believer is called to be the salt of the earth and the light
                  of the world (Matthew 5:13–16).
                </p>
                <p>
                  Whether you&apos;re exploring faith, returning to God, or looking
                  for a place to grow, you&apos;re welcome here.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-2xl border border-slu-blue/20 bg-slu-blue/5 p-8 text-center">
                <p className="text-lg font-semibold italic leading-relaxed text-slu-black">
                  &ldquo;You are the salt of the earth. But if the salt loses its
                  saltiness, how can it be made salty again?&rdquo;
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
        <Reveal
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          stagger
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slu-gray-200 bg-[#F0F0F0] p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slu-black">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-slu-gray-600">
                To raise a generation of young people who are rooted in God&apos;s
                Word, empowered by the Holy Spirit, and united in love to be
                salt and light in their schools, families, and communities.
              </p>
            </div>
            <div className="rounded-2xl border border-slu-gray-200 bg-[#F0F0F0] p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slu-black">Our Vision</h2>
              <p className="mt-4 leading-relaxed text-slu-gray-600">
                A thriving community of young believers who transform their
                generation for Christ — living with purpose, walking in faith,
                and shining God&apos;s light wherever they go.
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
            Our Story
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-white/70">
            <p>
              {brand.name} began as a small gathering of young people in Baliwag
              who shared a common heart — to know God more deeply and to live
              out their faith together. What started as a handful of teens
              meeting after school grew into a vibrant youth fellowship.
            </p>
            <p>
              Named after Jesus&apos; words in Matthew 5:13–16, SLU has always
              been about more than weekly meetings. It&apos;s about building a
              family where young people feel seen, known, and encouraged to
              become who God created them to be.
            </p>
          </div>
        </Reveal>
      </section>

      <WaveTransition from="dark" to="light" />

      {/* Leaders */}
      <section className="bg-[#F0F0F0] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slu-black sm:text-4xl">
              Who Runs SLU?
            </h2>
            <p className="mt-2 text-slu-gray-500">
              No pastors or formal leaders — just a community serving together
            </p>
          </Reveal>
          <Reveal className="mx-auto max-w-2xl text-center" stagger>
            <div className="rounded-2xl border border-slu-gray-200 bg-white p-8 transition-all hover:shadow-md">
              <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-slu-gray-200">
                <img
                  src="/images/history/first_pic.jpg"
                  alt="SLU community"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-slu-black">
                You decide what SLU becomes
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slu-gray-500">
                We&apos;re not a church with a pastor. We&apos;re a hangout fellowship
                where everyone pitches in, organizes events, and shapes the community
                together.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <WaveTransition from="light" to="blue" />

      {/* Reach Us */}
      <section className="bg-slu-blue py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Reach Us Today!
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
                  Facebook
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
          <Link
            href={brand.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
          >
            <FacebookLogo size={18} />
            Visit our Facebook page
          </Link>
        </Reveal>
      </section>

      {/* Independence Note */}
      <section className="bg-[#0A0A0A] pb-12 pt-4">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs leading-relaxed text-white/40">
            *{brand.independenceNote}
          </p>
        </div>
      </section>
    </>
  );
}

function PhoneLink({ phone }: { phone: string }) {
  if (!phone || !phone.replace(/[^\d]/g, "")) {
    return (
      <span className="block text-sm font-bold text-slu-gray-400">
        {phone}
      </span>
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
