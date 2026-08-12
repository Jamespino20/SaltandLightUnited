import { Hero } from "@/components/sections/Hero";
import { AboutStrip } from "@/components/sections/AboutStrip";
import { UpcomingEvents } from "@/components/sections/UpcomingEvents";
import { SmallGroupsPreview } from "@/components/sections/SmallGroupsPreview";
import { ScriptureBanner } from "@/components/sections/ScriptureBanner";
import { CallToAction } from "@/components/sections/CallToAction";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutStrip />
      <UpcomingEvents />
      <SmallGroupsPreview />
      <ScriptureBanner />
      <CallToAction />
    </>
  );
}
