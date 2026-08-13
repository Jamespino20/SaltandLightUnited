import Link from "next/link";
import { Users } from "@phosphor-icons/react";
import { WaveTransition } from "@/components/sections/WaveTransition";

export default function GroupsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0A0A0A]">
        <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-slu-blue/40 blur-3xl" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Community</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Come as you are. We are building this fellowship together.
          </p>
        </div>
      </section>

      <WaveTransition from="dark" to="light" />

      <section className="bg-[#F0F0F0] py-20 sm:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slu-blue/10 text-slu-blue">
            <Users size={28} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-slu-black sm:text-4xl">
            Small groups are not running yet
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slu-gray-600 sm:text-lg">
            SLU is currently a hangout fellowship rather than a church or a formal small-group network. We will share updates here if that changes.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slu-gray-600 sm:text-lg">
            For now, follow the events page or come to a gathering when one is announced.
          </p>
          <Link
            href="/events"
            className="mt-8 inline-flex rounded-xl bg-slu-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark"
          >
            See gatherings
          </Link>
        </div>
      </section>
    </>
  );
}
