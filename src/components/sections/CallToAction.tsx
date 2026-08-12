"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export function CallToAction() {
  return (
    <section className="bg-slu-offwhite py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slu-black sm:text-4xl">
          Be Part of SLU
        </h2>
        <p className="mt-4 text-lg text-slu-gray-500">
          Whether you&apos;re a teen looking for community or a parent seeking a
          safe space for your child — we&apos;d love to have you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-slu-blue-dark hover:shadow-lg"
          >
            Get in Touch
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/groups"
            className="inline-flex items-center gap-2 rounded-xl border border-slu-gray-300 px-8 py-3 text-sm font-semibold text-slu-black transition-all hover:border-slu-blue hover:text-slu-blue"
          >
            Browse Groups
          </Link>
        </div>
      </div>
    </section>
  );
}
