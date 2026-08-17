"use client";

import { useState } from "react";
import { CalendarBlank, CaretDown, CaretUp } from "@phosphor-icons/react";
import { Reveal } from "@/components/animation/Reveal";
import { WaveTransition } from "@/components/sections/WaveTransition";
import { useTranslations } from "next-intl";

const upcomingEvents = [
  {
    id: "1",
    title: "Friday Hangout",
    date: "Every Friday, 6:00 PM",
    description: "A relaxed evening to catch up, talk about life, and spend time together.",
  },
  {
    id: "2",
    title: "Creative Night",
    date: "Monthly · Date announced soon",
    description: "Music, art, games, and whatever the community wants to make together.",
  },
  {
    id: "3",
    title: "School Break Meetup",
    date: "Next school break · Details soon",
    description:
      "A casual day out for food, conversation, and meeting new friends from SLU.",
  },
  {
    id: "4",
    title: "Open Mic & Hangout",
    date: "September 25, 2026",
    description:
      "Bring a song, poem, game, or story and make the evening your own.",
  },
  {
    id: "5",
    title: "Back-to-School Meetup",
    date: "August 15, 2026",
    description:
      "Start the semester with familiar faces, new friends, and a little encouragement.",
  },
];

const pastEvents = [
  {
    id: "6",
    title: "Summer Community Day",
    date: "April 5, 2026",
    description:
      "A simple day of food, games, and time together.",
  },
  {
    id: "7",
    title: "Game Night",
    date: "February 14, 2026",
    description:
      "Board games, group games, snacks, and a lot of friendly competition.",
  },
  {
    id: "8",
    title: "Year-End Hangout",
    date: "December 28, 2025",
    description:
      "A low-key year-end gathering to look back, laugh, and look ahead together.",
  },
];

export default function EventsPage() {
  const t = useTranslations("events");
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
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <WaveTransition from="dark" to="light" />

      {/* Upcoming Events */}
      <section className="bg-[#F0F0F0] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-bold text-slu-black sm:text-3xl">
              {t("upcoming")}
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
                {t("past")}
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
