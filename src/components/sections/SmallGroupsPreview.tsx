"use client";

import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";

const sampleGroups = [
  {
    id: "1",
    name: "Teens for Christ",
    description:
      "For teens ages 13-17. A place to explore faith, ask the hard questions, and grow together through Bible study, worship, and real friendship.",
    schedule: "Saturdays, 3:00 PM",
    accent: "glow" as const,
  },
  {
    id: "2",
    name: "Tweens of Light",
    description:
      "For tweens ages 10-12. Building a strong foundation of faith through fun, interactive Bible lessons and activities.",
    schedule: "Saturdays, 1:00 PM",
    accent: "particles" as const,
  },
  {
    id: "3",
    name: "Worship Team",
    description:
      "For those passionate about worship and music. Learn to lead praise, play instruments, and serve through song.",
    schedule: "Fridays, 5:00 PM",
    accent: "wave" as const,
  },
];

function GroupDecor({ accent }: { accent: "glow" | "particles" | "wave" }) {
  if (accent === "glow") {
    return (
      <div className="slu-glow absolute -inset-12 -z-10 rounded-full bg-amber-200/40 blur-3xl" />
    );
  }
  if (accent === "wave") {
    return (
      <div className="slu-waveform text-slu-blue-light" aria-hidden>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  }
  return (
    <>
      <span className="slu-particle h-2 w-2" style={{ top: "18%", left: "12%" }} />
      <span
        className="slu-particle h-1.5 w-1.5"
        style={{ top: "60%", left: "75%", animationDelay: "1.2s" }}
      />
      <span
        className="slu-particle h-2.5 w-2.5"
        style={{ top: "72%", left: "30%", animationDelay: "2.1s" }}
      />
      <span
        className="slu-particle h-1 w-1"
        style={{ top: "30%", left: "82%", animationDelay: "0.6s" }}
      />
    </>
  );
}

export function SmallGroupsPreview() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slu-black sm:text-4xl">
            Find your place.
          </h2>
          <p className="mt-2 text-slu-gray-500">
            We grow together — discover the small group where you belong.
          </p>
        </Reveal>

        <Reveal stagger className="grid gap-6 lg:grid-cols-3">
          {/* Featured group */}
          <div className="group relative isolate overflow-hidden rounded-2xl border border-slu-gray-200 bg-slu-blue p-8 text-white lg:col-span-1 lg:row-span-1">
            <GroupDecor accent="glow" />
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
              Featured
            </span>
            <h3 className="mt-4 text-2xl font-bold">{sampleGroups[0].name}</h3>
            <p className="mt-2 text-white/80">{sampleGroups[0].description}</p>
            <p className="mt-4 text-sm text-white/60">{sampleGroups[0].schedule}</p>
            <Link
              href="/groups"
              className="mt-6 inline-block rounded-xl bg-white px-6 py-2 text-sm font-semibold text-slu-blue transition-all hover:bg-amber-100"
            >
              Learn More
            </Link>
          </div>

          {sampleGroups.slice(1).map((group) => (
            <div
              key={group.id}
              className="group relative isolate overflow-hidden rounded-2xl border border-slu-gray-200 bg-slu-offwhite p-6 transition-all hover:border-slu-blue hover:shadow-lg"
            >
              <GroupDecor accent={group.accent} />
              <h3 className="mb-3 text-lg font-bold text-slu-black">{group.name}</h3>
              <p className="mt-2 text-sm text-slu-gray-500">{group.description}</p>
              <p className="mt-3 text-xs text-slu-gray-400">{group.schedule}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-8 text-center">
          <Link
            href="/groups"
            className="inline-block rounded-xl border border-slu-gray-300 px-6 py-3 text-sm font-semibold text-slu-black transition-all hover:border-slu-blue hover:text-slu-blue"
          >
            View All Groups
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
