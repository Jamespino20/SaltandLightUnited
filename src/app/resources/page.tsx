"use client";

import { useState } from "react";
import { BookOpen, Headphones, Heart } from "@phosphor-icons/react";

const tabs = ["Sermons", "Devotionals", "Testimonies"] as const;
type Tab = (typeof tabs)[number];

const resources: Record<Tab, { id: string; title: string; description: string; date: string }[]> = {
  Sermons: [
    {
      id: "s1",
      title: "Built on the Rock",
      description:
        "A message on building your life on the foundation of God's Word.",
      date: "August 3, 2026",
    },
    {
      id: "s2",
      title: "Salt in a Bland World",
      description:
        "What it means to be the salt of the earth in everyday situations.",
      date: "July 27, 2026",
    },
    {
      id: "s3",
      title: "Light That Cannot Be Hidden",
      description:
        "Stepping out in faith and letting your light shine before others.",
      date: "July 20, 2026",
    },
  ],
  Devotionals: [
    {
      id: "d1",
      title: "Morning Strength",
      description: "Starting your day with God through prayer and His Word.",
      date: "August 10, 2026",
    },
    {
      id: "d2",
      title: "Walking by Faith",
      description:
        "Trusting God even when the path ahead is unclear.",
      date: "August 3, 2026",
    },
    {
      id: "d3",
      title: "The Power of Gratitude",
      description:
        "How thankfulness transforms your perspective and draws you closer to God.",
      date: "July 27, 2026",
    },
  ],
  Testimonies: [
    {
      id: "t1",
      title: "From Shy to Bold",
      description:
        "How SLU helped a quiet student find confidence and purpose in Christ.",
      date: "August 5, 2026",
    },
    {
      id: "t2",
      title: "A Family Restored",
      description:
        "A teen's prayer led to healing and reconciliation at home.",
      date: "July 22, 2026",
    },
    {
      id: "t3",
      title: "Finding My Tribe",
      description:
        "After moving to a new school, this student found a real community at SLU.",
      date: "July 10, 2026",
    },
  ],
};

const tabIcons: Record<Tab, React.ReactNode> = {
  Sermons: <BookOpen size={20} />,
  Devotionals: <Headphones size={20} />,
  Testimonies: <Heart size={20} />,
};

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Sermons");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slu-blue">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              Resources
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Grow deeper in your faith with sermons, devotionals, and
              testimonies.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-slu-blue-dark/30 blur-3xl" />
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-slu-blue-light/20 blur-3xl" />
      </section>

      {/* Tabs + Grid */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="mb-10 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-slu-blue text-white shadow-md"
                    : "border border-slu-gray-200 text-slu-gray-500 hover:border-slu-blue hover:text-slu-blue"
                }`}
              >
                {tabIcons[tab]}
                {tab}
              </button>
            ))}
          </div>

          {/* Resource Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources[activeTab].map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slu-gray-200 bg-slu-offwhite p-6 transition-all hover:shadow-md"
              >
                <p className="mb-2 text-xs font-medium text-slu-blue">
                  {item.date}
                </p>
                <h3 className="text-lg font-bold text-slu-black">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slu-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
