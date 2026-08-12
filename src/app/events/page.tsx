"use client";

import { useState } from "react";
import { CalendarBlank, CaretDown, CaretUp } from "@phosphor-icons/react";

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
      <section className="relative overflow-hidden bg-slu-blue">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              Upcoming Events
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Stay connected with what&apos;s happening at SLU
            </p>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-slu-blue-dark/30 blur-3xl" />
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-slu-blue-light/20 blur-3xl" />
      </section>

      {/* Upcoming Events */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slu-black sm:text-3xl">
            What&apos;s Coming Up
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-slu-gray-200 bg-slu-offwhite p-6 transition-all hover:shadow-md"
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
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-slu-offwhite py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowPast(!showPast)}
            className="flex w-full items-center justify-between rounded-2xl border border-slu-gray-200 bg-white px-6 py-4 text-left transition-all hover:shadow-md"
          >
            <div>
              <h2 className="text-2xl font-bold text-slu-black sm:text-3xl">
                Past Events
              </h2>
              <p className="mt-1 text-sm text-slu-gray-500">
                {pastEvents.length} previous events
              </p>
            </div>
            {showPast ? (
              <CaretUp size={24} className="text-slu-gray-400" />
            ) : (
              <CaretDown size={24} className="text-slu-gray-400" />
            )}
          </button>

          {showPast && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-slu-gray-200 bg-white p-6"
                >
                  <div className="mb-3 flex items-center gap-2 text-sm text-slu-gray-400">
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
            </div>
          )}
        </div>
      </section>
    </>
  );
}
