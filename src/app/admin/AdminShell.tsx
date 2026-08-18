"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import {
  House,
  CalendarBlank,
  BookOpen,
  Heart,
  Images,
  Users,
  ShieldCheck,
  GearSix,
  List,
  X,
  SignOut,
  CaretLeft,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: House },
  { href: "/admin/events", label: "Events", icon: CalendarBlank },
  { href: "/admin/devotionals", label: "Devotionals", icon: BookOpen },
  { href: "/admin/testimonies", label: "Testimonies", icon: Heart },
  { href: "/admin/pubmats", label: "Pubmats", icon: Images },
  { href: "/admin/groups", label: "Groups", icon: Users },
  { href: "/admin/audit", label: "Audit Log", icon: ShieldCheck },
  { href: "/admin/settings", label: "Settings", icon: GearSix },
];

function AdminUserChip() {
  const { data: session } = useSession();
  const user = session?.user;
  const initials = (user?.name || user?.email || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="hidden items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slu-gray-500 transition-colors hover:bg-slu-gray-100 hover:text-slu-gray-700 sm:inline-flex"
      >
        <SignOut size={16} />
        Sign out
      </button>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slu-blue text-sm font-semibold text-white">
        {initials}
      </div>
    </div>
  );
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slu-black transition-transform duration-200 lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Brand */}
          <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slu-blue text-xs font-bold text-white">
              SLU
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight text-white">
                Salt & Light
              </span>
              <span className="text-[11px] leading-tight text-slu-gray-500">
                Admin Panel
              </span>
            </div>
            <button
              type="button"
              className="ml-auto rounded-lg p-1 text-slu-gray-400 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="admin-scrollable flex-1 overflow-y-auto px-3 py-3">
            <ul className="space-y-0.5">
              {sidebarLinks.map((link) => {
                const isActive =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-slu-gray-400 hover:bg-white/5 hover:text-slu-gray-200"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-slu-blue" />
                      )}
                      <link.icon
                        size={18}
                        weight={isActive ? "fill" : "regular"}
                        className={cn(
                          "shrink-0 transition-colors",
                          isActive ? "text-slu-blue" : "text-slu-gray-500 group-hover:text-slu-gray-300"
                        )}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-white/10 px-3 py-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slu-gray-500 transition-colors hover:bg-white/5 hover:text-slu-gray-300"
            >
              <CaretLeft size={18} />
              Back to Site
            </Link>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-slu-gray-200 bg-white px-4 sm:px-6">
            <button
              type="button"
              className="rounded-lg p-2 text-slu-gray-500 hover:bg-slu-gray-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <List size={20} />
            </button>
            <div className="flex-1" />
            <AdminUserChip />
          </header>

          {/* Page content */}
          <main className="admin-scrollable flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
