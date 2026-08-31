import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Astrology Disclaimer",
  description: "Zunara's astrology and entertainment disclaimer.",
};

export default function DisclaimerPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Disclaimer", href: "/disclaimer" }]} />
      <h1 className="mt-8 font-display text-4xl text-starlight">Astrology Disclaimer</h1>
      <div className="mt-8 space-y-6 leading-7 text-starlight/90">
        <section>
          <h2 className="font-display text-xl text-starlight">Entertainment &amp; reflection</h2>
          <p className="mt-2">
            All astrology content on Zunara \u2014 including daily, weekly, monthly and yearly
            horoscopes, guides, and planetary tables \u2014 is provided for entertainment,
            inspiration and reflection. It is not a substitute for professional advice.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-starlight">Not professional advice</h2>
          <p className="mt-2">
            Zunara&rsquo;s content is not medical, legal, financial, or psychological advice, and
            should never be used as a basis for important life decisions. For any such concerns,
            please consult a qualified professional.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-starlight">Astronomy vs. astrology</h2>
          <p className="mt-2">
            While Zunara&rsquo;s planetary calculations are scientifically grounded in astronomical
            theory, astrology itself is a cultural and interpretive practice, not a science. Its
            meaning is symbolic and personal, and its value lies in reflection.
          </p>
        </section>
      </div>
    </article>
  );
}
