import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { pageMetadata, alternateLanguages } from "@/lib/seo/metadata";
import { HOUSES, getHouse } from "@/lib/houses/house-content";

export const dynamicParams = false;

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

export function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({ n: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}): Promise<Metadata> {
  const { n } = await params;
  const house = getHouse(Number(n));
  if (!house) return {};
  const path = `/houses/${n}`;
  const ord = ORDINAL[house.number];
  const title = `The ${ord} House in Astrology — ${house.title}`;
  const description = `The ${ord} house: ${house.title.toLowerCase()}. What it covers, which planets rule it, and how it reads in your birth chart — in plain English.`;
  return {
    ...pageMetadata(path, title, description, "article", house.keywords),
    alternates: { canonical: absoluteUrl(path), languages: alternateLanguages(path) },
  };
}

export default async function HousePage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const house = getHouse(Number(n));
  if (!house) notFound();

  const ord = ORDINAL[house.number];
  const titleLower = house.title.toLowerCase();

  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs
            items={[
              { label: "Library", href: "/library" },
              { label: "Houses", href: "/library" },
              { label: `House ${house.number}`, href: `/houses/${house.number}` },
            ]}
          />
        </div>

        <header className="mx-auto mt-10 max-w-2xl text-center">
          <p className="kicker">House {house.number}</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-starlight sm:text-5xl">
            The {ord} House: {house.title}
          </h1>
          <div aria-hidden="true" className="gold-rule mx-auto mt-7 w-20" />
          <p className="mt-7 text-lg leading-8 text-muted">{house.nature}</p>
        </header>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="kicker">What it covers</p>
          <h2 className="mt-2 font-display text-2xl text-starlight">Domains</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {house.domains.map((domain) => (
              <li
                key={domain}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs capitalize text-muted"
              >
                {domain}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="kicker">When a planet sits here</p>
              <h2 className="mt-2 font-display text-2xl text-starlight">
                The house in action
              </h2>
              <p className="mt-4 leading-8 text-muted">
                Any planet placed in the {house.number}
                {house.number === 1 ? "st" : house.number === 2 ? "nd" : house.number === 3 ? "rd" : "th"}{" "}
                house brings its own nature into the arena of {titleLower} — money, work,
                partnership or whichever slice of life this house names. The planet&rsquo;s
                sign, house and aspects together tell the real story, but the house always
                sets the stage.
              </p>
              <p className="mt-4 leading-8 text-muted">{house.signOrbitNote}</p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="kicker">In the birth chart</p>
              <h2 className="mt-2 font-display text-2xl text-starlight">
                Reading this house
              </h2>
              <p className="mt-4 leading-8 text-muted">{house.inChartNote}</p>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="kicker">Signature</p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-subdued">Natural ruling planet</dt>
                <dd className="mt-1 text-starlight">{house.planetRule}</dd>
              </div>
              <div>
                <dt className="text-subdued">Sign that orbits it</dt>
                <dd className="mt-1 text-starlight">{house.signOrbit}</dd>
              </div>
              <div>
                <dt className="text-subdued">Axis</dt>
                <dd className="mt-1 leading-6 text-muted">
                  House {house.number} sits {house.number <= 6 ? `opposite House ${house.number + 6}` : `opposite House ${house.number - 6}`}{" "}
                  across the chart, balancing the {titleLower} theme against its mirror.
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <section className="mt-16">
          <p className="kicker text-center">The other houses</p>
          <h2 className="mt-3 text-center font-display text-2xl text-starlight">
            Explore all twelve
          </h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {HOUSES.filter((h) => h.number !== house.number).map((h) => (
              <Link
                key={h.number}
                href={`/houses/${h.number}`}
                className="group flex items-center justify-between gap-3 bg-white/[0.03] p-5 backdrop-blur-xl transition-colors hover:bg-white/[0.06]"
              >
                <div>
                  <p className="font-display text-lg text-starlight">
                    The {ORDINAL[h.number]} House
                  </p>
                  <p className="mt-1 text-sm text-muted">{h.title}</p>
                </div>
                <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm leading-6 text-muted backdrop-blur-xl">
          <p>
            Want to see where the houses actually fall in your own chart?{" "}
            <Link href="/birthchart" className="text-gold hover:underline">
              Calculate your birth chart
            </Link>{" "}
            and the sign on each house cusp appears in order. Or head back to the{" "}
            <Link href="/library" className="text-gold hover:underline">
              Library index
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}