import type { Metadata } from "next";
import { PaperArticle, PaperSection } from "@/components/ui/paper-article";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Disclaimer & Risk Disclosure",
  description:
    "Important legal disclaimer covering the scope, limitations and risks of using Zunara's astrology content and tools.",
  alternates: { canonical: absoluteUrl("/disclaimer") },
  ...shareMeta(
    absoluteUrl("/disclaimer"),
    "Disclaimer & Risk Disclosure | Zunara",
    "Important legal disclaimer covering the scope, limitations and risks of using Zunara's astrology content and tools.",
  ),
};

export default function DisclaimerPage() {
  return (
    <PaperArticle
      kicker="Disclaimer"
      title="Disclaimer & Risk Disclosure"
      lead="Please read this document carefully. It explains what Zunara is, what it is not, and the limits of our responsibility."
      crumbs={[{ label: "Disclaimer", href: "/disclaimer" }]}
    >
      <PaperSection heading="Entertainment & reflection only">
        All astrology content on Zunara — including daily, weekly, monthly and yearly
        horoscopes, compatibility readings, natal charts, planetary tables and sky
        maps — is provided solely for entertainment, personal reflection and
        educational purposes. Astrology is a symbolic and interpretive tradition; it
        is not a science, even though the underlying planetary positions are computed
        from real astronomical data. Nothing on this site should be treated as
        verified fact or as a description of objective reality.
      </PaperSection>

      <PaperSection heading="Not professional advice">
        Zunara&rsquo;s content is not medical, psychological, legal, financial, tax,
        career, relationship, navigational or safety advice. It must never be used as
        a basis for any important life decision. If you need professional guidance in
        any of these areas, please consult a suitably qualified and licensed
        professional.
      </PaperSection>

      <PaperSection heading="No guarantee of accuracy">
        Planetary positions, aspects and other astronomical calculations on Zunara
        are produced by third-party ephemeris engines (including astronomy-engine and
        VSOP87). While these are widely used and well regarded, no software is
        free from error. Household-chart and whole-sign house rounding may further
        affect results. When a birth time is not provided, a default of 12:00 noon
        is assumed, which can shift house cusps and time-sensitive factors
        significantly. Dates of birth and locations are processed exactly as entered
        by the user; misspelled or approximate place names may resolve to the wrong
        coordinates. Sky events shown on the site may not match any particular
        local or regional guide. Before any real-world observation or action based
        on astronomical data, please verify the information independently using
        authoritative sources.
      </PaperSection>

      <PaperSection heading="Third-party data accuracy">
        Celebrity and famous-birthday data displayed on Zunara is retrieved from
        Wikidata via the SPARQL API and may contain incorrect dates, missing
        entries or other inaccuracies. Place names and coordinates are sourced from
        OpenStreetMap through the Nominatim geocoding API; this data is
        community-sourced and may be imprecise, incomplete or outdated. Images are
        sourced from Wikimedia Commons. All third-party data is provided &ldquo;as
        is&rdquo; and Zunara does not warrant its correctness.
      </PaperSection>

      <PaperSection heading="Not for navigation or safety">
        The interactive night-sky map on Zunara is an educational and visualisation
        tool. It must never be used — and no data on this site should be used — for
        physical navigation, aviation, maritime purposes, safety-critical decisions
        or any planning where inaccurate information could result in harm.
      </PaperSection>

      <PaperSection heading="User responsibility for input">
        Charts, scores and readings are generated from the birth details you enter.
        If those details are wrong, approximate or incomplete, the output will
        reflect those inputs rather than your actual birth chart. It is your
        responsibility to ensure that the information you provide is as accurate and
        complete as possible.
      </PaperSection>

      <PaperSection heading="Privacy & data storage">
        Birth data you enter on Zunara is stored only in your own browser via
        localStorage and is never transmitted to Zunara&rsquo;s servers or to any
        third party. The optional place-name lookup sends a query to the OpenStreetMap
        Nominatim API solely for the purpose of converting a place name into latitude
        and longitude coordinates; no personal identifiers are included. Zunara does
        not sell or share personal data. For full details, see the{" "}
        <a className="underline hover:text-gold" href="/privacy">
          Privacy Policy
        </a>
        .
      </PaperSection>

      <PaperSection heading="Third-party services & licensing">
        Zunara relies on several third-party services and open-source projects.
        OpenStreetMap place data is licensed under the Open Database License (ODbL)
        and requires attribution &copy; OpenStreetMap contributors. The
        astronomy-engine library is released under the MIT license. Celestial data
        may be derived from Wikidata and images from Wikimedia Commons, each subject
        to their own licensing terms. Use of these services is subject to their
        respective terms and compatibility requirements; features may change or
        become unavailable without notice.
      </PaperSection>

      <PaperSection heading="Changes to this disclaimer">
        Zunara&rsquo;s content, features and this disclaimer may be updated or
        amended at any time without prior notice. Continued use of the site after
        any changes constitutes acceptance of the revised terms.
      </PaperSection>

      <PaperSection heading="Limitation of liability">
        To the fullest extent permitted by applicable law, Zunara, its operators and
        contributors shall not be liable for any direct, indirect, incidental,
        special, consequential or other damages arising out of or in connection with
        your use of, or reliance on, any content, tools or data provided on this
        site. Your use of Zunara is entirely at your own risk. Nothing in this
        disclaimer excludes or limits liability that cannot be excluded or limited
        under applicable law.
      </PaperSection>

      <PaperSection heading="Contact">
        If you have questions about this disclaimer, please contact us at{" "}
        <a className="underline hover:text-gold" href="mailto:hello@zunara.today">
          hello@zunara.today
        </a>
        .
      </PaperSection>
    </PaperArticle>
  );
}
