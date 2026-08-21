import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { brand } from "@/lib/brand";

export const metadata = {
  title: `Terms of Service | ${brand.name}`,
  description: `Terms and conditions for using the ${brand.name} website and community platform.`,
};

export default function TermsPage() {
  const effectiveDate = "August 21, 2026";

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slu-gray-500 transition-colors hover:text-slu-black"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-slu-black sm:text-4xl">Terms of Service</h1>
      <p className="mb-8 text-sm text-slu-gray-500">Effective Date: {effectiveDate}</p>

      <div className="prose-slu space-y-6 text-slu-gray-700">
        <p>
          Welcome to {brand.name} (&ldquo;{brand.shortName}&rdquo;). By accessing or using our website
          and services, you agree to be bound by these Terms of Service. Please read them carefully.
        </p>

        <h2 className="text-xl font-bold text-slu-black">1. Acceptance of Terms</h2>
        <p>
          By visiting or using this website, you acknowledge that you have read, understood, and
          agree to these Terms of Service and our <Link href="/privacy" className="text-slu-blue hover:underline">Privacy Policy</Link>.
          If you do not agree, please do not use this website.
        </p>

        <h2 className="text-xl font-bold text-slu-black">2. About {brand.shortName}</h2>
        <p>
          {brand.name} is {brand.description.toLowerCase()} {brand.independenceNote}
        </p>

        <h2 className="text-xl font-bold text-slu-black">3. Use of the Website</h2>
        <p>You agree to use this website for lawful purposes only. You must not:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use the website in any way that violates applicable laws or regulations.</li>
          <li>Submit content that is defamatory, harassing, hateful, or otherwise objectionable.</li>
          <li>Impersonate another person or misrepresent your affiliation.</li>
          <li>Attempt to gain unauthorized access to any part of the website or its systems.</li>
          <li>Use automated tools (bots, scrapers) to access or collect data from this website.</li>
        </ul>

        <h2 className="text-xl font-bold text-slu-black">4. User-Generated Content</h2>
        <p>
          This website allows you to submit content such as testimonies, devotionals, and other
          materials. By submitting content, you:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Confirm that the content is your own and does not infringe on third-party rights.</li>
          <li>Grant {brand.shortName} a non-exclusive license to display, publish, and share your
            submitted content on this website and related social media channels.</li>
          <li>Acknowledge that submitted content may be edited for clarity, length, or
            appropriateness before publication.</li>
          <li>Understand that submitted content will be reviewed by our team before being published
            publicly.</li>
        </ul>

        <h2 className="text-xl font-bold text-slu-black">4. Content Ownership</h2>
        <p>
          You retain ownership of any original content you create and submit. {brand.shortName} does
          not claim ownership over your personal testimonies, devotionals, or other submissions.
        </p>

        <h2 className="text-xl font-bold text-slu-black">5. Intellectual Property</h2>
        <p>
          All content on this website that is not user-submitted — including design, graphics,
          logos, text, and code — is the property of {brand.name} or its content creators and is
          protected by applicable intellectual property laws.
        </p>

        <h2 className="text-xl font-bold text-slu-black">6. Limitation of Liability</h2>
        <p>
          This website is provided &ldquo;as is&rdquo; without warranties of any kind. {brand.shortName} is
          not responsible for any damages arising from the use of this website, including but not
          limited to direct, indirect, incidental, or consequential damages.
        </p>

        <h2 className="text-xl font-bold text-slu-black">7. External Links</h2>
        <p>
          This website may contain links to external sites (e.g., social media pages). {brand.shortName}
          is not responsible for the content, privacy practices, or availability of external
          websites.
        </p>

        <h2 className="text-xl font-bold text-slu-black">8. Modifications</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time. Changes will be
          posted on this page with an updated effective date. Continued use of the website after
          changes constitutes acceptance of the updated terms.
        </p>

        <h2 className="text-xl font-bold text-slu-black">9. Governing Law</h2>
        <p>
          These Terms of Service are governed by and construed in accordance with the laws of
          the Republic of the Philippines.
        </p>

        <h2 className="text-xl font-bold text-slu-black">10. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Phone: {brand.phones[0]}</li>
          <li>Facebook: <a href={brand.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-slu-blue hover:underline">{brand.name}</a></li>
          <li>Location: {brand.city}</li>
        </ul>
      </div>
    </section>
  );
}
