"use client";

import { useState, useMemo, useEffect } from "react";
import { CaretLeft, CaretRight, Spinner } from "@phosphor-icons/react";
import { Reveal } from "@/components/animation/Reveal";
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

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Calendar({
  selectedDate,
  onSelect,
  eventDays,
}: {
  selectedDate: Date;
  onSelect: (d: Date) => void;
  eventDays: Set<string>;
}) {
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const cells = useMemo(() => {
    const result: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  }, [firstDay, daysInMonth]);

  return (
    <div className="rounded-2xl border border-slu-gray-200 bg-white p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={prev} className="rounded-lg p-1.5 text-slu-gray-500 hover:bg-slu-gray-100">
          <CaretLeft size={18} />
        </button>
        <h3 className="text-lg font-bold text-slu-black">{MONTHS[viewMonth]} {viewYear}</h3>
        <button type="button" onClick={next} className="rounded-lg p-1.5 text-slu-gray-500 hover:bg-slu-gray-100">
          <CaretRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs font-semibold">
        {DAYS.map((d, i) => (
          <div key={d} className={`py-1 ${(i === 0 || i === 6) ? "text-rose-500" : "text-slu-gray-400"}`}>{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasEvent = eventDays.has(dateKey);
          const isSelected =
            day === selectedDate.getDate() &&
            viewMonth === selectedDate.getMonth() &&
            viewYear === selectedDate.getFullYear();
          const dayOfWeek = new Date(viewYear, viewMonth, day).getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
              className={`relative flex h-8 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-slu-blue text-white"
                  : isWeekend
                  ? "text-rose-500 hover:bg-slu-gray-100"
                  : "text-slu-black hover:bg-slu-gray-100"
              }`}
            >
              {day}
              {hasEvent && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-slu-blue" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function UpcomingEvents() {
  const t = useTranslations("home.events");
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const eventDays = useMemo(() => {
    const days = new Set<string>();
    for (const event of events) {
      const d = new Date(event.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      days.add(key);
    }
    return days;
  }, [events]);

  return (
    <section id="events" className="bg-[#F0F0F0] py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-bold text-slu-black sm:text-3xl md:text-4xl lg:text-5xl">
            {t("title")}{" "}
            <span className="text-slu-blue">{t("subtitle")}</span>
          </h2>
        </Reveal>

        {/* Calendar — centered single column */}
        <Reveal className="mx-auto max-w-md">
          <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} eventDays={eventDays} />
        </Reveal>

        {/* Events — grid below calendar */}
        {loading ? (
          <div className="mt-8 flex items-center justify-center py-8 sm:mt-10">
            <Spinner size={28} className="animate-spin text-slu-blue" />
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slu-gray-200 bg-white p-8 text-center sm:mt-10">
            <p className="text-slu-gray-500">No upcoming events yet.</p>
          </div>
        ) : (
          <Reveal stagger className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`rounded-2xl border bg-white p-6 transition-all hover:shadow-md ${
                  event.featured
                    ? "border-slu-blue/30 ring-1 ring-slu-blue/10"
                    : "border-slu-gray-200"
                }`}
              >
                <div className="mb-1 text-xs font-semibold tracking-wide text-slu-blue">
                  {formatDateShort(event.date)}
                </div>
                <h3 className="text-lg font-bold text-slu-black">{event.title}</h3>
                {event.description && (
                  <p className="mt-2 text-sm text-slu-gray-600">{event.description}</p>
                )}
                {event.location && (
                  <p className="mt-2 text-xs text-slu-gray-400">📍 {event.location}</p>
                )}
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
