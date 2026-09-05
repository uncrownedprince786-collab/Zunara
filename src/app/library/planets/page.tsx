import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";
import { CELESTIAL_BODIES } from "@/lib/astronomy/bodies";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { AstroTerm } from "@/components/ui/astro-tooltip";
import type { BodyKey } from "@/lib/astronomy/bodies";

export const metadata: Metadata = {
  title: "Library — Planets",
  description:
    "The Sun, Moon and eight planets plus the lunar nodes: each body's meaning, glyph and plain-English nature.",
  alternates: { canonical: absoluteUrl("/library/planets") },
  ...shareMeta(
    absoluteUrl("/library/planets"),
    "Library — Planets | Zunara",
    "The meaning and behaviour of each planet in the chart.",
  ),
};

/** Honest, plain-English nature lines per body. */
const NATURE: Record<BodyKey, string> = {
  sun: "The centre of the chart. It shows core identity, purpose and the vitality behind everyday choices.",
  moon: "The fastest-moving body. It reflects emotional needs, instincts and the baseline of your inner world.",
  mercury: "The fastest planet. It governs how you take in, process and express information.",
  venus: "The harmony planet. It shows how you love, what you value, and how you attract what you want.",
  mars: "The drive planet. It shows how you assert, act and pursue what matters to you.",
  jupiter: "The expansion planet. It marks where growth, opportunity and optimism feel most available.",
  saturn: "The structure planet. It shows where discipline, limits and long-term responsibility live.",
  uranus: "The change planet. It shakes up routine and points to originality and freedom.",
  neptune: "The imagination planet. It softens boundaries and relates to intuition and inspiration.",
  pluto: "The transformation planet. It points to deep, regenerative change and what must be released.",
  northNode: "A calculated point, not a body. It marks the direction of growth this lifetime tends to reward.",
  southNode: "A calculated point, not a body. It marks familiar, comfortable patterns worth loosening.",
};

export default function PlanetsPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Breadcrumbs
              items={[
                { label: "Library", href: "/library" },
                { label: "Planets", href: "/library/planets" },
              ]}
            />
          </div>
          <p className="kicker">The cast of the chart</p>
          <h1 className="mt-4 font-display text-4xl text-starlight sm:text-6xl">
            Planets
          </h1>
          <div aria-hidden="true" className="gold-rule mx-auto mt-7 w-20" />
          <p className="mt-7 text-lg leading-8 text-muted">
            Each body in Zunara&rsquo;s charts stands for a distinct area of life. Here is
            what each one means and how it tends to behave.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CELESTIAL_BODIES.map((b) => (
            <div
              key={b.key}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-colors hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <PlanetSymbol body={b.key} size="md" className="text-gold" />
                <div>
                  <h2 className="font-display text-lg font-semibold text-starlight">{b.name}</h2>
                  <p className="text-xs uppercase tracking-[0.14em] text-subdued">{b.glyph}</p>
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gold">
                {b.description}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">{NATURE[b.key]}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-6 text-muted backdrop-blur-xl">
          <p>
            The <AstroTerm term="Sun Sign" />, <AstroTerm term="Moon Sign" /> and{" "}
            <AstroTerm term="Ascendant" /> together form the{" "}
            <AstroTerm term="Big Three" /> — the most personally significant points in a
            chart. The <AstroTerm term="North Node" /> and{" "}
            <AstroTerm term="South Node" /> are calculated points rather than physical
            bodies.
          </p>
          <p className="mt-3">
            <Link href="/library" className="text-gold hover:underline">
              ← Back to the Library index
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
