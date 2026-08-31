import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Zunara's terms of service.",
};

export default function TermsPage() {
  const today = new Date().getUTCFullYear();
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Terms", href: "/terms" }]} />
      <h1 className="mt-8 font-display text-4xl text-starlight">Terms of Service</h1>
      <p className="mt-2 text-sm text-subdued">Last updated: {today}</p>

      <div className="mt-8 space-y-6 leading-7 text-starlight/90">
        <section>
          <h2 className="font-display text-xl text-starlight">Use of the service</h2>
          <p className="mt-2">
            Zunara provides astrological content for personal, non-commercial reflection and
            entertainment. You may view our content freely and share links to it.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-starlight">Nature of the content</h2>
          <p className="mt-2">
            All astrology on Zunara is provided for entertainment and informational purposes. It is
            not professional, medical, legal, or financial advice. You are responsible for your own
            decisions.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-starlight">Acceptable use</h2>
          <p className="mt-2">
            You may not automate scraping in a way that disrupts the service, misrepresent the
            origin of our content, or use the site for unlawful purposes.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-starlight">Availability</h2>
          <p className="mt-2">
            We make our best effort to keep the service available but do not guarantee uninterrupted
            access.
          </p>
        </section>
      </div>
    </article>
  );
}
