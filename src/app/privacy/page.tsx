import type { Metadata } from "next";
import { PaperArticle, PaperSection } from "@/components/ui/paper-article";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Zunara's privacy policy.",
  alternates: { canonical: absoluteUrl("/privacy") },
  ...shareMeta(
    absoluteUrl("/privacy"),
    "Privacy Policy | Zunara",
    "Zunara's privacy policy.",
  ),
};

export default function PrivacyPage() {
  const today = new Date().getUTCFullYear();
  return (
    <PaperArticle
      kicker="Privacy"
      title="Privacy Policy"
      lead={`An editorial publication that asks for as little as possible. Last reviewed ${today}.`}
      crumbs={[{ label: "Privacy", href: "/privacy" }]}
    >
      <PaperSection heading="Overview">
        Zunara is a public editorial publication. We do not require an account and we aim to
        collect the minimum necessary information to operate the site.
      </PaperSection>
      <PaperSection heading="Data we process">
        We do not collect personal information required to read horoscopes. We may process standard,
        anonymised web analytics (such as aggregate page-view counts) to understand how our
        editorial content is used, and operational logs necessary for the security and reliability
        of the service.
      </PaperSection>
      <PaperSection heading="Cookies">
        Zunara does not use advertising cookies or targeted advertising. Any functional or analytics
        storage is limited and privacy-respecting.
      </PaperSection>
      <PaperSection heading="Third parties">
        The site is hosted on Vercel and may use Neon for operational storage. These providers
        process data only on our behalf under their standard terms.
      </PaperSection>
      <PaperSection heading="Contact">
        For any privacy questions, please contact us through the channels listed on this site.
      </PaperSection>
    </PaperArticle>
  );
}
