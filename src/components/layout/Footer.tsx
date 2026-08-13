"use client";

import Link from "next/link";
import { FacebookLogo } from "@phosphor-icons/react";
import { brand } from "@/lib/brand";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/events", label: "Events" },
      { href: "/groups", label: "Small Groups" },
      { href: "/resources", label: "Resources" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/chat", label: "Chat with Us" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-slu-gray-800 bg-slu-black text-white">
      {/* returning light at the very end of the journey */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-200/20 blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-slu-blue">{brand.name}</h3>
            <p className="mt-2 text-sm text-slu-gray-400">{brand.description}</p>
            <div className="mt-4">
              <Link
                href={brand.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slu-gray-400 transition-colors hover:text-slu-blue"
              >
                <FacebookLogo size={20} />
                Follow us on Facebook
              </Link>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slu-gray-300">
                {group.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slu-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Final narrative echo — the loop closes */}
        <p className="mt-10 text-center text-sm font-semibold tracking-wide text-[#D4A843]">
          Be the Light. &nbsp; Be the Salt.
        </p>

        {/* Bottom */}
        <div className="mt-4 border-t border-slu-gray-800 pt-6 text-center text-xs text-slu-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p className="mt-1">{brand.independenceNote}</p>
        </div>
      </div>
    </footer>
  );
}