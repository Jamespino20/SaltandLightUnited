"use client";

import Link from "next/link";

const sampleGroups = [
  {
    id: "1",
    name: "Teens for Christ",
    description: "For teens ages 13-17. Growing in faith together.",
    schedule: "Saturdays, 3:00 PM",
  },
  {
    id: "2",
    name: "Tweens of Light",
    description: "For tweens ages 10-12. Building a strong foundation.",
    schedule: "Saturdays, 1:00 PM",
  },
  {
    id: "3",
    name: "Worship Team",
    description: "For those passionate about worship and music.",
    schedule: "Fridays, 5:00 PM",
  },
];

export function SmallGroupsPreview() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slu-black sm:text-4xl">
            Our Groups
          </h2>
          <p className="mt-2 text-slu-gray-500">
            Find your place in one of our small groups
          </p>
        </div>

        {/* Bento Layout: 1 large + 2 stacked */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Featured Group */}
          <div className="rounded-2xl border border-slu-gray-200 bg-slu-blue p-8 text-white lg:col-span-2 lg:row-span-2">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
              Featured
            </span>
            <h3 className="mt-4 text-2xl font-bold">{sampleGroups[0].name}</h3>
            <p className="mt-2 text-white/80">{sampleGroups[0].description}</p>
            <p className="mt-4 text-sm text-white/60">
              {sampleGroups[0].schedule}
            </p>
            <Link
              href="/groups"
              className="mt-6 inline-block rounded-xl bg-white px-6 py-2 text-sm font-semibold text-slu-blue transition-all hover:bg-slu-offwhite"
            >
              Learn More
            </Link>
          </div>

          {/* Side Groups */}
          {sampleGroups.slice(1).map((group) => (
            <div
              key={group.id}
              className="rounded-2xl border border-slu-gray-200 bg-slu-offwhite p-6 transition-all hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slu-black">{group.name}</h3>
              <p className="mt-2 text-sm text-slu-gray-500">
                {group.description}
              </p>
              <p className="mt-3 text-xs text-slu-gray-400">
                {group.schedule}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/groups"
            className="inline-block rounded-xl border border-slu-gray-300 px-6 py-3 text-sm font-semibold text-slu-black transition-all hover:border-slu-blue hover:text-slu-blue"
          >
            View All Groups
          </Link>
        </div>
      </div>
    </section>
  );
}
