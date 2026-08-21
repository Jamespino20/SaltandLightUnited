import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { brand } from "@/lib/brand";

export const metadata = {
  title: `Privacy Policy | ${brand.name}`,
  description: `How ${brand.name} collects, uses, and protects your personal information.`,
};

export default function PrivacyPage() {
  const effectiveDate = "August 21, 2026";

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slu-gray-500 transition-colors hover:text-slu-black"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-slu-black sm:text-4xl">Privacy Policy</h1>
      <p className="mb-8 text-sm text-slu-gray-500">Effective Date: {effectiveDate}</p>

      <div className="prose-slu space-y-6 text-slu-gray-700">
        <p>
          {brand.name} (&ldquo;{brand.shortName},&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to
          protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard
          your personal information when you visit our website and participate in our community.
        </p>

        <h2 className="text-xl font-bold text-slu-black">1. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Personal Information:</strong> Name, age, email address, phone number, and
            profile photo — only when you voluntarily submit them through forms (e.g., testimony
            submissions, event registrations, or contact forms).
          </li>
          <li>
            <strong>Content Submissions:</strong> Devotionals, testimonies, and other content you
            choose to share through our platform.
          </li>
          <li>
            <strong>Usage Data:</strong> Anonymous analytics such as page views, browser type,
            and device information collected through Vercel Analytics.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-slu-black">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Operate and maintain the {brand.shortName} website and community platform.</li>
          <li>Display submitted content (testimonies, devotionals) on the public site after review.</li>
          <li>Respond to your inquiries and contact requests.</li>
          <li>Improve our website and user experience through anonymous analytics.</li>
          <li>Communicate about upcoming events and community activities.</li>
        </ul>

        <h2 className="text-xl font-bold text-slu-black">3. Content Sharing</h2>
        <p>
          Testimonies and devotionals you submit may be published publicly on this website after
          review by our team. If you submitted content and wish to have it removed, please
          contact us using the information below.
        </p>

        <h2 className="text-xl font-bold text-slu-black">4. Data Protection</h2>
        <p>
          We implement appropriate security measures to protect your personal information.
          However, no method of transmission over the Internet is 100% secure, and we cannot
          guarantee absolute security.
        </p>

        <h2 className="text-xl font-bold text-slu-black">5. Third-Party Services</h2>
        <p>We use the following third-party services that may collect data:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Vercel Analytics &amp; Speed Insights:</strong> Anonymous usage and performance data.</li>
          <li><strong>Vercel Hosting:</strong> Infrastructure and hosting services.</li>
        </ul>

        <h2 className="text-xl font-bold text-slu-black">6. Children&apos;s Privacy</h2>
        <p>
          {brand.shortName} serves young people. We do not knowingly collect personal information
          from children under 13 without parental or guardian consent. If you believe a child
          has provided us with personal information, please contact us immediately.
        </p>

        <h2 className="text-xl font-bold text-slu-black">7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Request access to the personal data we hold about you.</li>
          <li>Request correction or deletion of your personal data.</li>
          <li>Request that your submitted content be removed from the site.</li>
          <li>Opt out of analytics tracking.</li>
        </ul>

        <h2 className="text-xl font-bold text-slu-black">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this
          page with an updated effective date.
        </p>

        <h2 className="text-xl font-bold text-slu-black">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Email: {brand.phones[0]}</li>
          <li>Facebook: <a href={brand.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-slu-blue hover:underline">{brand.name}</a></li>
          <li>Location: {brand.city}</li>
        </ul>
      </div>
    </section>
  );
}
