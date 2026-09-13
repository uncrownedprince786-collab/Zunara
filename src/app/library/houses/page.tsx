import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";
import { HOUSES } from "@/lib/houses/house-content";

const ORDINAL: Record<number, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
  4: "4th",
  5: "5th",
  6: "6th",
  7: "7th",
  8: "8th",
  9: "9th",
  10: "10th",
  11: "11th",
  12: "12th",
};

export const metadata: Metadata = {
  title: "The 12 Houses of Astrology",
  description:
    "The twelve astrological houses and the area of life each one governs, from identity and money to career and what stays hidden. Plain-English meanings.",
  alternates: { canonical: absoluteUrl("/library/houses") },
  ...shareMeta(
    absoluteUrl("/library/houses"),
    "The 12 Houses of Astrology | Zunara",
    "The twelve astrological houses and the area of life each one governs, from identity and money to career and what stays hidden.",
  ),
};

export default function HousesLibraryPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Breadcrumbs
              items={[
                { label: "Library", href: "/library" },
                { label: "Houses", href: "/library/houses" },
              ]}
            />
          </div>
          <p className="kicker">The twelve arenas of life</p>
          <h1 className="mt-4 font-display text-4xl text-starlight sm:text-6xl">
            Houses
          </h1>
          <div aria-hidden="true" className="gold-rule mx-auto mt-7 w-20" />
          <p className="mt-7 text-lg leading-8 text-muted">
            Where the planets sit is only half the picture. The houses show which
            area of life each planet works in. They run from who you are to how you
            earn, love, work and rest. Here are all twelve.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOUSES.map((h) => (
            <Link
              key={h.number}
              href={`/houses/${h.number}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-subdued">
                    The {ORDINAL[h.number]} House
                  </p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-starlight">
                    {h.title}
                  </h2>
                </div>
                <span
                  aria-hidden="true"
                  className="text-gold opacity-0 transition-opacity group-hover:opacity-100"
                >
                  →
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gold">
                Ruled by {h.planetRule} · {h.signOrbit}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {h.domains.slice(0, 5).map((domain) => (
                  <span
                    key={domain}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs capitalize text-muted"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-6 text-muted backdrop-blur-xl">
          <p>
            Want to see which sign sits on each house in your own chart?{" "}
            <Link href="/birthchart" className="text-gold hover:underline">
              Calculate your birth chart
            </Link>{" "}
            and every house cusp appears in order. Or head back to the{" "}
            <Link href="/library" className="text-gold hover:underline">
              Library index
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
