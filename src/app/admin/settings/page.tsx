"use client";

import { GearSix, Users, Globe, Bell } from "@phosphor-icons/react";

const settingSections = [
  {
    icon: Users,
    title: "Team Management",
    description: "Manage admin users and roles.",
    status: "Coming soon",
  },
  {
    icon: Globe,
    title: "Site Configuration",
    description: "Site name, description, and public settings.",
    status: "Coming soon",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Email and push notification preferences.",
    status: "Coming soon",
  },
  {
    icon: GearSix,
    title: "Advanced",
    description: "Cache, maintenance mode, and system settings.",
    status: "Coming soon",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slu-black">Settings</h1>
        <p className="text-sm text-slu-gray-500">
          Configure your admin panel and site settings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {settingSections.map((section) => (
          <div
            key={section.title}
            className="flex items-start gap-4 rounded-2xl border border-slu-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slu-gray-100 text-slu-gray-500">
              <section.icon size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slu-black">{section.title}</h3>
              <p className="mt-0.5 text-sm text-slu-gray-500">
                {section.description}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-slu-gray-100 px-2.5 py-0.5 text-xs font-medium text-slu-gray-500">
              {section.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
