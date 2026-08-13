"use client";

import { useState, useMemo } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/animation/Reveal";

const sampleEvents = [
  {
    id: "1",
    title: "Friday Fellowship Night",
    date: "Every Friday, 6:00 PM",
    description: "Join us for worship, the Word, and fellowship every Friday evening.",
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
    description: "Our annual youth camp — three days of spiritual growth and fun.",
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
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <section id="events" className="bg-[#F0F0F0] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-slu-black sm:text-4xl lg:text-5xl">
            Mark your calendars.{" "}
            <span className="text-slu-blue">Keep the date.</span>
          </h2>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Calendar */}
          <Reveal>
            <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />
          </Reveal>

          {/* Events */}
          <Reveal stagger className="space-y-4">
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
      </div>
    </section>
  );
}
