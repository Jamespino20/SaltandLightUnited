"use client";

import Link from "next/link";
import { CalendarBlank } from "@phosphor-icons/react";

const sampleEvents = [
  {
    id: "1",
    title: "Friday Fellowship Night",
    date: "Every Friday, 6:00 PM",
    description: "Join us for worship, Word, and fellowship every Friday evening.",
  },
  {
    id: "2",
    title: "Sunday Worship Service",
    date: "Every Sunday, 9:00 AM",
    description: "Start your week with praise and worship at our Sunday service.",
  },
  {
    id: "3",
    title: "Youth Camp 2026",
    date: "December 15-18, 2026",
    description: "Our annual youth camp — three days of spiritual growth and fun.",
  },
];

export function UpcomingEvents() {
  return (
    <section className="bg-slu-offwhite py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slu-black sm:text-4xl">
            Upcoming Events
          </h2>
          <p className="mt-2 text-slu-gray-500">
            Stay connected with what&apos;s happening at SLU
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-slu-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-2 text-sm text-slu-blue">
                <CalendarBlank size={16} />
                {event.date}
              </div>
              <h3 className="text-lg font-bold text-slu-black">{event.title}</h3>
              <p className="mt-2 text-sm text-slu-gray-500">
                {event.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/events"
            className="inline-block rounded-xl bg-slu-blue px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slu-blue-dark hover:shadow-lg"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}
