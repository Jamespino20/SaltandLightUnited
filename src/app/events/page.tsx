"use client";

import { useState, useEffect } from "react";
import { CalendarBlank, CaretDown, CaretUp, Spinner } from "@phosphor-icons/react";
import { Reveal } from "@/components/animation/Reveal";
import { WaveTransition } from "@/components/sections/WaveTransition";
import { useTranslations } from "next-intl";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  imageUrl: string | null;
  featured: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  if (days < 30) return `In ${Math.ceil(days / 7)} weeks`;
  return formatDate(dateStr);
}

export default function EventsPage() {
  const t = useTranslations("events");
  const [showPast, setShowPast] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setEvents(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  const pastEvents = events
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

          {loading ? (
            <div className="mt-8 flex items-center justify-center py-12">
              <Spinner size={32} className="animate-spin text-slu-blue" />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-slu-gray-200 bg-white p-12 text-center">
              <CalendarBlank size={48} className="mx-auto text-slu-gray-300" />
              <p className="mt-4 text-slu-gray-500">No upcoming events yet.</p>
              <p className="mt-1 text-sm text-slu-gray-400">
                Check back soon for new events!
              </p>
            </div>
          ) : (
            <Reveal
              className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              stagger
            >
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`rounded-2xl border bg-white p-6 transition-all hover:shadow-md ${
                    event.featured
                      ? "border-slu-blue/30 ring-1 ring-slu-blue/10"
                      : "border-slu-gray-200"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slu-blue">
                    <CalendarBlank size={16} />
                    {formatRelativeDate(event.date)}
                  </div>
                  <h3 className="text-lg font-bold text-slu-black">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="mt-2 text-sm text-slu-gray-500">
                      {event.description}
                    </p>
                  )}
                  {event.location && (
                    <p className="mt-2 text-xs text-slu-gray-400">
                      📍 {event.location}
                    </p>
                  )}
                  {event.featured && (
                    <span className="mt-3 inline-block rounded-full bg-slu-blue/10 px-2.5 py-0.5 text-xs font-medium text-slu-blue">
                      Featured
                    </span>
                  )}
                </div>
              ))}
            </Reveal>
          )}
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
                {pastEvents.length} previous event{pastEvents.length !== 1 && "s"}
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
                    {formatDate(event.date)}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="mt-2 text-sm text-white/60">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
