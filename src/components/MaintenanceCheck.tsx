"use client";

import { useEffect, useState } from "react";
import { GearSix } from "@phosphor-icons/react";

export function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState<{
    mode: boolean;
    message: string;
  } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setMaintenance({
            mode: res.data.maintenanceMode,
            message: res.data.maintenanceMessage,
          });
        }
      })
      .catch(() => {});

    // Check admin status via session
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((session) => {
        if (session?.user?.role === "admin") {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  if (maintenance?.mode && !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-4 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slu-blue/20">
          <GearSix size={32} className="text-slu-blue" />
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Under Maintenance
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-white/60">
          {maintenance.message}
        </p>
        <div className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-slu-blue" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
