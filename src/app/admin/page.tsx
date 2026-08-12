"use client";

import Link from "next/link";
import {
  CalendarBlank,
  BookOpen,
  Heart,
  Users,
  Plus,
  ArrowRight,
} from "@phosphor-icons/react";

const stats = [
  {
    label: "Total Events",
    value: 12,
    icon: CalendarBlank,
    href: "/admin/events",
    color: "bg-slu-blue",
  },
  {
    label: "Devotionals",
    value: 8,
    icon: BookOpen,
    href: "/admin/devotionals",
    color: "bg-emerald-600",
  },
  {
    label: "Testimonies",
    value: 24,
    icon: Heart,
    href: "/admin/testimonies",
    color: "bg-rose-600",
  },
  {
    label: "Groups",
    value: 5,
    icon: Users,
    href: "/admin/groups",
    color: "bg-amber-600",
  },
];

const quickActions = [
  { label: "Add Event", href: "/admin/events/new", icon: CalendarBlank },
  { label: "Add Devotional", href: "/admin/devotionals/new", icon: BookOpen },
  { label: "Add Testimony", href: "/admin/testimonies/new", icon: Heart },
];

const recentActivity = [
  { action: "Event created", detail: "Youth Night — June 2026", time: "2 hours ago" },
  { action: "Testimony approved", detail: "Maria's testimony", time: "5 hours ago" },
  { action: "Devotional published", detail: "Walking in Faith", time: "1 day ago" },
  { action: "Group updated", detail: "Worship Team schedule changed", time: "2 days ago" },
  { action: "Event created", detail: "Summer Retreat 2026", time: "3 days ago" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slu-black">Dashboard</h1>
        <p className="text-sm text-slu-gray-500">
          Welcome back. Here&apos;s an overview of your content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-slu-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color} text-white`}
              >
                <stat.icon size={20} />
              </div>
              <ArrowRight
                size={16}
                className="text-slu-gray-300 transition-transform group-hover:translate-x-1"
              />
            </div>
            <p className="mt-4 text-2xl font-bold text-slu-black">
              {stat.value}
            </p>
            <p className="text-sm text-slu-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slu-black">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slu-gray-700 transition-colors hover:bg-slu-blue/10 hover:text-slu-blue"
              >
                <Plus size={18} />
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-1 rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-slu-black">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slu-gray-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slu-black">
                    {item.action}
                  </p>
                  <p className="text-xs text-slu-gray-500">{item.detail}</p>
                </div>
                <span className="whitespace-nowrap text-xs text-slu-gray-400">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
