import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";
import { AstroTerm } from "@/components/ui/astro-tooltip";
import { NodePosition } from "./node-position";

export const metadata: Metadata = {
  title: "Library — Lunar Nodes",
  description:
    "The North Node and South Node explained in plain English, with their current calculated positions.",
  alternates: { canonical: absoluteUrl("/library/nodes") },
  ...shareMeta(
    absoluteUrl("/library/nodes"),
    "Library — Lunar Nodes | Zunara",
    "North and South Node meaning plus live positions.",
  ),
};

const NODES = [
  {
    key: "northNode" as const,
    glyph: "☊",
    title: "North Node",
    meaning:
      "The North Node is the ascending point where the Moon's orbit crosses the ecliptic. In the chart it marks the direction of growth this lifetime tends to reward — the unfamiliar territory worth reaching toward. It is a calculated point, not a physical body.",
    focus:
      "Growth usually asks for more of the North Node's sign: developing skills, habits and comfort in that area rather than retreating to the familiar.",
  },
  {
    key: "southNode" as const,
    glyph: "☋",
    title: "South Node",
    meaning:
      "The South Node is the descending point opposite the North Node. It reflects familiar, comfortable patterns and what comes almost effortlessly. Leaning too far into it can become a rut rather than a strength.",
    focus:
      "The South Node points to habits worth loosening — the easy defaults that can hold growth back when relied on too heavily.",
  },
];

export default function NodesPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Breadcrumbs
              items={[
                { label: "Library", href: "/library" },
                { label: "Lunar Nodes", href: "/library/nodes" },
              ]}
            />
          </div>
          <p className="kicker">Calculated points, not planets</p>
          <h1 className="mt-4 font-display text-4xl text-starlight sm:text-6xl">
            Lunar Nodes
          </h1>
          <div aria-hidden="true" className="gold-rule mx-auto mt-7 w-20" />
          <p className="mt-7 text-lg leading-8 text-muted">
            The <AstroTerm term="Lunar Nodes" /> are the two points where the Moon&rsquo;s path
            crosses the Sun&rsquo;s. They describe the axis between comfortable familiarity and
            forward growth.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {NODES.map((n) => (
            <div
              key={n.key}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-2xl text-gold">
                  {n.glyph}
                </span>
                <h2 className="font-display text-2xl text-starlight">{n.title}</h2>
                <span className="ml-auto hidden text-xs uppercase tracking-[0.14em] text-subdued sm:block">
                  {n.key === "northNode" ? "growth" : "patterns"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted">{n.meaning}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{n.focus}</p>
              <NodePosition node={n.key} />
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          <Link href="/library" className="text-gold hover:underline">
            ← Back to the Library index
          </Link>
        </p>
      </div>
    </div>
  );
}
