import type { Metadata } from "next";
import { PaperArticle, PaperSection } from "@/components/ui/paper-article";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Zunara's terms of service.",
  alternates: { canonical: absoluteUrl("/terms") },
  ...shareMeta(
    absoluteUrl("/terms"),
    "Terms of Service | Zunara",
    "Zunara's terms of service.",
  ),
};

export default function TermsPage() {
  const today = new Date().getUTCFullYear();
  return (
    <PaperArticle
      kicker="Terms"
      title="Terms of Service"
      lead={`The terms under which Zunara&rsquo;s editorial content is offered. Last reviewed ${today}.`}
      crumbs={[{ label: "Terms", href: "/terms" }]}
    >
      <PaperSection heading="Use of the service">
        Zunara provides astrological content for personal, non-commercial reflection and
        entertainment. You may view our content freely and share links to it.
      </PaperSection>
      <PaperSection heading="Nature of the content">
        All astrology on Zunara is provided for entertainment and informational purposes. It is not
        professional, medical, legal, or financial advice. You are responsible for your own
        decisions.
      </PaperSection>
      <PaperSection heading="Acceptable use">
        You may not automate scraping in a way that disrupts the service, misrepresent the origin of
        our content, or use the site for unlawful purposes.
      </PaperSection>
      <PaperSection heading="Availability">
        We make our best effort to keep the service available but do not guarantee uninterrupted
        access.
      </PaperSection>
    </PaperArticle>
  );
}
