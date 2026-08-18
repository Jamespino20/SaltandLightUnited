"use client";

import { useState, useMemo } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/animation/Reveal";
import { useTranslations } from "next-intl";

const sampleEvents = [
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
    description: "A casual day out for food, conversation, and meeting new friends from SLU.",
  },
];

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

function Calendar({ selectedDate, onSelect }: { selectedDate: Date; onSelect: (d: Date) => void }) {
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
              className={`flex h-8 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-slu-blue text-white"
                  : isWeekend
                  ? "text-rose-500 hover:bg-slu-gray-100"
                  : "text-slu-black hover:bg-slu-gray-100"
              }`}
            >
              {day}
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
          <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />
        </Reveal>

        {/* Events — grid below calendar */}
        <Reveal stagger className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleEvents.map((event, i) => (
            <div
              key={event.id}
              className="rounded-2xl border border-slu-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <div className="mb-1 text-xs font-semibold tracking-wide text-slu-blue">
                EVENT {i + 1}
              </div>
              <h3 className="text-lg font-bold text-slu-black">{event.title}</h3>
              <p className="mt-1 text-sm text-slu-gray-500">{event.date}</p>
              <p className="mt-2 text-sm text-slu-gray-600">{event.description}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
