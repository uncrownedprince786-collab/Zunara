import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Zunara's privacy policy.",
};

export default function PrivacyPage() {
  const today = new Date().getUTCFullYear();
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Privacy", href: "/privacy" }]} />
      <h1 className="mt-8 font-display text-4xl text-starlight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-subdued">Last updated: {today}</p>

      <div className="mt-8 space-y-6 leading-7 text-starlight/90">
        <section>
          <h2 className="font-display text-xl text-starlight">Overview</h2>
          <p className="mt-2">
            Zunara is a public editorial publication. We do not require an account and we aim to
            collect the minimum necessary information to operate the site.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-starlight">Data we process</h2>
          <p className="mt-2">
            We do not collect personal information required to read horoscopes. We may process
            standard, anonymised web analytics (such as aggregate page-view counts) to understand
            how our editorial content is used, and operational logs necessary for the security and
            reliability of the service.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-starlight">Cookies</h2>
          <p className="mt-2">
            Zunara does not use advertising cookies or targeted advertising. Any functional or
            analytics storage is limited and privacy-respecting.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-starlight">Third parties</h2>
          <p className="mt-2">
            The site is hosted on Vercel and may use Neon for operational storage. These providers
            process data only on our behalf under their standard terms.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-starlight">Contact</h2>
          <p className="mt-2">
            For any privacy questions, please contact us through the channels listed on this site.
          </p>
        </section>
      </div>
    </article>
  );
}
