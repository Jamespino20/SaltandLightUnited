"use client";

import { Reveal } from "@/components/animation/Reveal";
import { brand } from "@/lib/brand";

export function FacebookSection() {
  return (
    <section id="facebook" className="bg-[#F0F0F0] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <Reveal>
            <h2 className="text-3xl font-bold text-slu-black sm:text-4xl lg:text-5xl">
              Join the FB page to{" "}
              <span className="text-slu-blue">
                be updated and to join.
              </span>
            </h2>
            <p className="mt-6 text-lg text-slu-gray-600">
              Stay connected with Salt and Light United through our official
              Facebook page. Get the latest updates on events, fellowship
              nights, and community activities.
            </p>
            <a
              href={brand.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm font-semibold text-slu-blue transition-colors hover:text-slu-blue-dark"
            >
              Visit our page &rarr;
            </a>
          </Reveal>

          {/* FB Embed */}
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-slu-gray-200 bg-white shadow-sm">
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(brand.facebookUrl)}&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                title="Salt and Light United Facebook Page"
                className="h-[400px] w-full border-0 sm:h-[500px]"
                loading="lazy"
                allow="encrypted-media"
              >
                Loading Facebook feed…
              </iframe>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
