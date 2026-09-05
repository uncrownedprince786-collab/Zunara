import type { Metadata } from "next";
import { RetrogradeClient } from "./retrograde-client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Retrograde Tracker & Sky Stats",
  description:
    "Which planets are retrograde right now, when the next retrograde starts, plain-English advice for each planet, and current sky statistics.",
  alternates: { canonical: absoluteUrl("/retrograde") },
  ...shareMeta(
    absoluteUrl("/retrograde"),
    "Retrograde Tracker & Sky Stats | Zunara",
    "Live retrograde status, next stations, and behavioural guidance for every planet.",
  ),
};

export default function RetrogradePage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Retrograde Tracker", href: "/retrograde" }]} />
        </div>
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="kicker">The apparent backward motion</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl text-starlight sm:text-6xl">
            Retrograde Tracker
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            A retrograde is an apparent motion, not a real reversal — a planet only looks
            like it slows and moves backward against the stars. Here is which planets are
            currently retrograde, when the next stations begin, and practical, caution-free
            advice for each.
          </p>
        </div>
      </div>
      <RetrogradeClient />
    </div>
  );
}