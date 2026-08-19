"use client";

import React from "react";

export function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slu-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slu-blue/10 text-slu-blue">
          <Icon size={18} />
        </div>
        <h2 className="text-lg font-semibold text-slu-black">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slu-gray-700">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-xs text-slu-gray-400">{hint}</p>
      )}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slu-gray-200 p-4 transition-colors hover:bg-slu-gray-50">
      <div>
        <p className="text-sm font-medium text-slu-black">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-slu-gray-500">{description}</p>
        )}
      </div>
      <div className="relative ml-4 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="h-6 w-11 rounded-full bg-slu-gray-200 transition-colors peer-checked:bg-slu-blue" />
        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
}

export function SettingsNotice({ notice }: { notice: string }) {
  if (!notice) return null;
  return (
    <div className="rounded-xl border border-slu-blue/20 bg-slu-blue/5 px-4 py-3 text-sm text-slu-blue">
      {notice}
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-48 animate-pulse rounded-2xl bg-slu-gray-100" />
      ))}
    </div>
  );
}
