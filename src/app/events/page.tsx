"use client";

import { useState } from "react";
import { CalendarBlank, CaretDown, CaretUp } from "@phosphor-icons/react";
import { Reveal } from "@/components/animation/Reveal";
import { WaveTransition } from "@/components/sections/WaveTransition";

const upcomingEvents = [
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
    date: "December 15–18, 2026",
    description:
      "Our annual youth camp — three days of spiritual growth, outdoor activities, and community building.",
  },
  {
    id: "4",
    title: "Worship Night Under the Stars",
    date: "September 25, 2026",
    description:
      "An outdoor worship night featuring live praise, testimony, and fellowship with friends.",
  },
  {
    id: "5",
    title: "Back-to-School Prayer Rally",
    date: "August 15, 2026",
    description:
      "Kick off the school year with prayer. We gather to seek God's blessing and guidance for the semester ahead.",
  },
];

const pastEvents = [
  {
    id: "6",
    title: "Easter Celebration 2026",
    date: "April 5, 2026",
    description:
      "A special worship service celebrating the resurrection of Jesus with praise, drama, and fellowship.",
  },
  {
    id: "7",
    title: "Valentine's Fellowship",
    date: "February 14, 2026",
    description:
      "A love-themed fellowship night exploring God's love and how we share it with others.",
  },
  {
    id: "8",
    title: "Year-End Thanksgiving Service",
    date: "December 28, 2025",
    description:
      "Looking back on a year of God's faithfulness and stepping into the new year with praise.",
  },
];

export default function EventsPage() {
  const [showPast, setShowPast] = useState(false);

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
            Upcoming Events
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Stay connected with what&apos;s happening at SLU
          </p>
        </div>
      </section>

      <WaveTransition from="dark" to="light" />

      {/* Upcoming Events */}
      <section className="bg-[#F0F0F0] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-bold text-slu-black sm:text-3xl">
              What&apos;s Coming Up
            </h2>
          </Reveal>
          <Reveal
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            stagger
          >
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-slu-gray-200 bg-white p-6 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slu-blue">
                  <CalendarBlank size={16} />
                  {event.date}
                </div>
                <h3 className="text-lg font-bold text-slu-black">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm text-slu-gray-500">
                  {event.description}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <WaveTransition from="light" to="dark" />

      {/* Past Events */}
      <section className="bg-[#0A0A0A] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowPast(!showPast)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-left transition-all hover:bg-white/10"
          >
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Past Events
              </h2>
              <p className="mt-1 text-sm text-white/50">
                {pastEvents.length} previous events
              </p>
            </div>
            {showPast ? (
              <CaretUp size={24} className="text-slu-blue-light" />
            ) : (
              <CaretDown size={24} className="text-slu-blue-light" />
            )}
          </button>

          {showPast && (
            <Reveal
              className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              stagger
            >
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="mb-3 flex items-center gap-2 text-sm text-white/50">
                    <CalendarBlank size={16} />
                    {event.date}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    {event.description}
                  </p>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
