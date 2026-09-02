import type { Metadata } from "next";
import { PaperArticle, PaperSection } from "@/components/ui/paper-article";

export const metadata: Metadata = {
  title: "Astrology Disclaimer",
  description: "Zunara's astrology and entertainment disclaimer.",
};

export default function DisclaimerPage() {
  return (
    <PaperArticle
      kicker="Disclaimer"
      title="Astrology Disclaimer"
      lead="Astrology is offered as a practice of reflection and entertainment — never as a substitute for professional advice."
      crumbs={[{ label: "Disclaimer", href: "/disclaimer" }]}
    >
      <PaperSection heading="Entertainment & reflection">
        All astrology content on Zunara — including daily, weekly, monthly and yearly
        horoscopes, guides, and planetary tables — is provided for entertainment, inspiration
        and reflection. It is not a substitute for professional advice.
      </PaperSection>
      <PaperSection heading="Not professional advice">
        Zunara&rsquo;s content is not medical, legal, financial, or psychological advice, and should
        never be used as a basis for important life decisions. For any such concerns, please
        consult a qualified professional.
      </PaperSection>
      <PaperSection heading="Astronomy vs. astrology">
        While Zunara&rsquo;s planetary calculations are scientifically grounded in astronomical
        theory, astrology itself is a cultural and interpretive practice, not a science. Its
        meaning is symbolic and personal, and its value lies in reflection.
      </PaperSection>
    </PaperArticle>
  );
}
