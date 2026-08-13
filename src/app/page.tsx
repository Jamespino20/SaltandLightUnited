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
      <Hero />
      <AboutStrip />
      <WaveTransition from="dark" to="light" />
      <UpcomingEvents />
      <FacebookSection />
      <SmallGroupsPreview />
      <WaveTransition from="light" to="dark" />
      <ScriptureBanner />
      <CallToAction />
    </>
  );
}
