import { Hero } from "@/components/sections/Hero";
import { AboutStrip } from "@/components/sections/AboutStrip";
import { UpcomingEvents } from "@/components/sections/UpcomingEvents";
import { FacebookSection } from "@/components/sections/FacebookSection";
import { SmallGroupsPreview } from "@/components/sections/SmallGroupsPreview";
import { ScriptureBanner } from "@/components/sections/ScriptureBanner";
import { CallToAction } from "@/components/sections/CallToAction";
import { WaveTransition } from "@/components/sections/WaveTransition";

export default function Home() {
  return (
    <>
      {/* Hero + About share one continuous moving gradient backdrop */}
      <div className="relative bg-[#0A0A0A]">
        <div
          aria-hidden
          className="slu-hero-gradient pointer-events-none absolute inset-0 -z-10 h-[200svh]"
          style={{
            background:
              "radial-gradient(circle at 25% 25%, rgba(7,112,189,0.7) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(10,143,224,0.55) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22) 0%, transparent 50%), conic-gradient(from 180deg at 50% 50%, #0A0A0A, #0770BD, #0A8FE0, #F0F0F0, #0770BD, #0A0A0A)",
            filter: "blur(60px) brightness(1)",
          }}
        />
        <Hero />
        <AboutStrip />
      </div>

      <WaveTransition from="dark" to="light" />
      <UpcomingEvents />
      <WaveTransition from="light" to="blue" />
      <FacebookSection />
      <WaveTransition from="blue" to="light" />
      <SmallGroupsPreview />
      <ScriptureBanner />
      <WaveTransition from="light" to="dark" />
      <CallToAction />
    </>
  );
}
