"use client";

import { useEffect, useState } from "react";
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
  Images,
  ShieldCheck,
} from "@phosphor-icons/react";

interface Stats {
  events: number;
  devotionals: number;
  testimonies: number;
  groups: number;
  pubmats: number;
  pendingTestimonies: number;
}

interface Activity {
  action: string;
  targetTable: string | null;
  targetId: string | null;
  user: { name: string | null; email: string } | null;
  createdAt: string;
}

const quickActions = [
  { label: "Add Event", href: "/admin/events/new", icon: CalendarBlank },
  { label: "Add Devotional", href: "/admin/devotionals/new", icon: BookOpen },
  { label: "Upload Pubmat", href: "/admin/pubmats/new", icon: Images },
];

const statCards = [
  { key: "events" as const, label: "Events", icon: CalendarBlank, href: "/admin/events", color: "text-slu-blue", bg: "bg-slu-blue/10" },
  { key: "devotionals" as const, label: "Devotionals", icon: BookOpen, href: "/admin/devotionals", color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "testimonies" as const, label: "Testimonies", icon: Heart, href: "/admin/testimonies", color: "text-rose-600", bg: "bg-rose-50" },
  { key: "groups" as const, label: "Groups", icon: Users, href: "/admin/groups", color: "text-amber-600", bg: "bg-amber-50" },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    events: 0, devotionals: 0, testimonies: 0, groups: 0, pubmats: 0, pendingTestimonies: 0,
  });
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/events").then((r) => r.json()),
      fetch("/api/devotionals").then((r) => r.json()),
      fetch("/api/testimonies?all=true").then((r) => r.json()),
      fetch("/api/groups").then((r) => r.json()),
      fetch("/api/pubmats").then((r) => r.json()),
      fetch("/api/audit?limit=8").then((r) => r.json()),
    ]).then(([events, devotionals, testimonies, groups, pubmats, audit]) => {
      const allTestimonies = testimonies.data || [];
      setStats({
        events: events.data?.length || 0,
        devotionals: devotionals.data?.length || 0,
        testimonies: allTestimonies.length,
        groups: groups.data?.length || 0,
        pubmats: pubmats.data?.length || 0,
        pendingTestimonies: allTestimonies.filter((t: { approved: boolean }) => !t.approved).length,
      });
      setActivity(audit.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slu-black sm:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slu-gray-500">
          Welcome back. Here&apos;s an overview of your content.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-slu-gray-200 bg-white p-5">
              <div className="h-10 w-10 rounded-lg bg-slu-gray-100" />
              <div className="mt-3 h-8 w-16 rounded bg-slu-gray-100" />
              <div className="mt-1 h-4 w-24 rounded bg-slu-gray-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Link
              key={stat.key}
              href={stat.href}
              className="group rounded-xl border border-slu-gray-200 bg-white p-5 transition-all hover:border-slu-gray-300 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <ArrowRight size={14} className="text-slu-gray-300 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-slu-black">{stats[stat.key]}</p>
              <p className="text-sm text-slu-gray-500">{stat.label}</p>
            </Link>
          ))}
        </div>
      )}

      {stats.pendingTestimonies > 0 && (
        <Link
          href="/admin/testimonies"
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 transition-colors hover:bg-amber-100"
        >
          <ShieldCheck size={20} className="text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {stats.pendingTestimonies} pending testimony approval{stats.pendingTestimonies !== 1 && "s"}
            </p>
            <p className="text-xs text-amber-600">Review and approve or reject submissions</p>
          </div>
          <ArrowRight size={16} className="ml-auto text-amber-400" />
        </Link>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
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

        <div className="rounded-xl border border-slu-gray-200 bg-white p-5 lg:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slu-gray-400">
            <Clock size={14} />
            Recent Activity
          </h2>
          {activity.length === 0 ? (
            <p className="py-4 text-center text-sm text-slu-gray-400">No activity yet</p>
          ) : (
            <div className="divide-y divide-slu-gray-100">
              {activity.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-slu-black">{item.action}</p>
                    <p className="text-xs text-slu-gray-500">
                      {item.targetTable && `${item.targetTable}`}
                      {item.user?.name && ` by ${item.user.name}`}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-xs text-slu-gray-400">
                    {timeAgo(item.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
