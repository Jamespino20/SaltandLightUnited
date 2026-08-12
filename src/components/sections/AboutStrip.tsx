"use client";

import Link from "next/link";

export function AboutStrip() {
  return (
    <section className="border-b border-slu-gray-200 bg-white py-12">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-slu-gray-600">
          We are a community of young people united by faith, growing together in
          Christ, and shining His light in our school and beyond.
        </p>
        <Link
          href="/about"
          className="mt-4 inline-block text-sm font-semibold text-slu-blue transition-colors hover:text-slu-blue-dark"
        >
          Learn more about us &rarr;
        </Link>
      </div>
    </section>
  );
}
