"use client";

import Link from "next/link";
import {
  CalendarBlank,
  BookOpen,
  Heart,
  Users,
  Plus,
  ArrowRight,
  Clock,
  TrendUp,
} from "@phosphor-icons/react";

const stats = [
  {
    label: "Total Events",
    value: 12,
    icon: CalendarBlank,
    href: "/admin/events",
    color: "text-slu-blue",
    bg: "bg-slu-blue/10",
  },
  {
    label: "Devotionals",
    value: 8,
    icon: BookOpen,
    href: "/admin/devotionals",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Testimonies",
    value: 24,
    icon: Heart,
    href: "/admin/testimonies",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    label: "Groups",
    value: 5,
    icon: Users,
    href: "/admin/groups",
    color: "text-amber-600",
    bg: "bg-amber-50",
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slu-black sm:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slu-gray-500">
          Welcome back. Here&apos;s an overview of your content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-slu-gray-200 bg-white p-5 transition-all hover:border-slu-gray-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon size={20} className={stat.color} />
              </div>
              <ArrowRight
                size={14}
                className="text-slu-gray-300 transition-transform group-hover:translate-x-0.5"
              />
            </div>
            <p className="mt-3 text-2xl font-bold text-slu-black">
              {stat.value}
            </p>
            <p className="text-sm text-slu-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-xl border border-slu-gray-200 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slu-gray-400">
            <TrendUp size={14} />
            Quick Actions
          </h2>
          <div className="space-y-1">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slu-gray-700 transition-colors hover:bg-slu-blue/5 hover:text-slu-blue"
              >
                <Plus size={16} className="text-slu-gray-400" />
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-slu-gray-200 bg-white p-5 lg:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slu-gray-400">
            <Clock size={14} />
            Recent Activity
          </h2>
          <div className="divide-y divide-slu-gray-100">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
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
