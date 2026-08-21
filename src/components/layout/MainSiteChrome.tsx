"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SmoothScroll } from "@/components/animation/SmoothScroll";
import { LightOrb } from "@/components/animation/LightOrb";
import { ScrollProgress } from "@/components/animation/ScrollProgress";
import { PageTransition } from "@/components/transition/PageTransition";
import { LampyWidget } from "./LampyWidget";
import { MaintenanceCheck } from "@/components/MaintenanceCheck";

export function MainSiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname.startsWith("/login");

  if (isAdmin || isLogin) {
    return <>{children}</>;
  }

  return (
    <MaintenanceCheck>
      <ScrollProgress />
      <LightOrb />
      <SmoothScroll>
        <PageTransition>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </PageTransition>
      </SmoothScroll>
      <LampyWidget />
    </MaintenanceCheck>
  );
}
