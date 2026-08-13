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
  User,
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

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-lg bg-slu-gray-100 px-3 py-1.5">
        <User size={18} className="text-slu-gray-500" />
        <span className="text-sm font-medium text-slu-gray-700">
          {user?.name || user?.email || "Admin User"}
        </span>
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="inline-flex items-center gap-2 rounded-lg border border-slu-gray-200 px-3 py-1.5 text-sm font-medium text-slu-gray-600 transition-colors hover:bg-slu-gray-100"
      >
        <SignOut size={16} />
        Sign out
      </button>
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
      <div className="flex h-screen overflow-hidden bg-slu-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
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
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <span className="text-xl font-bold text-slu-blue">SLU</span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              Salt & Light
            </span>
            <span className="text-xs text-slu-gray-400">Admin Panel</span>
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
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
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
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slu-blue text-white"
                        : "text-slu-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <link.icon size={20} weight={isActive ? "fill" : "regular"} />
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
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slu-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <SignOut size={20} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slu-gray-200 bg-white px-4 sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-slu-gray-600 hover:bg-slu-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <List size={24} />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <AdminUserChip />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
    </SessionProvider>
  );
}
