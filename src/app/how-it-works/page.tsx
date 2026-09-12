import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/ui/json-ld";
import { websiteJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 86400;

export const metadata = pageMetadata(
  "/how-it-works",
  "How Zunara Works — Astronomical Calculation, Honest Interpretation",
  "Zunara computes every planetary position from the VSOP87 planetary theory — the same mathematics used in published ephemerides — then reflects honestly on what those measured positions can mean. No invented coordinates, no hidden rules.",
  "website",
  [
    "how astrology is calculated",
    "VSOPS87 VSOP87 planetary theory",
    "zodiac calculation method",
    "astronomy vs astrology",
    "natal chart calculation",
  ],
);

const STEPS = [
  {
    n: "01",
    title: "You give your birth details",
    text: "A place, a date and a time of birth. The place fixes your local longitude and latitude; the time fixes the exact rotation of the Earth beneath the sky you were born into.",
  },
  {
    n: "02",
    title: "The engine computes the sky",
    text: "Zunara uses the VSOP87 planetary theory to calculate the geocentric ecliptic longitudes of the Sun, Moon, planets and lunar nodes at that exact instant. This is the same mathematics published in professional ephemerides — nothing is invented or approximated.",
  },
  {
    n: "03",
    title: "Geometry turns into a chart",
    text: "From those positions Zunara derives the houses (whole-sign system), the angles between bodies, the signs they occupy and their motion — direct or retrograde. Every number is deterministic: the same input always produces the same chart.",
  },
  {
    n: "04",
    title: "Meaning is written honestly",
    text: "The interpretation layer reflects on what those measured positions symbolically tend to mean — drawn from tradition and written for reflection and entertainment. It is clearly labelled: astronomy measures, astrology reflects.",
  },
  {
    n: "05",
    title: "Tools deliver the reading",
    text: "That one engine powers every tool — your personal sky, birth chart, compatibility, live positions and forecasts — so the sky you read is always the sky the mathematics actually shows.",
  },
];

const TOOLS = [
  { href: "/yoursky", title: "Your Sky", desc: "Transits touching your life topics, from your saved chart." },
  { href: "/birthchart", title: "Birth Chart", desc: "Houses, aspects and placements from one deterministic engine." },
  { href: "/synastry", title: "Compatibility", desc: "Four dimensions scored from the real angles between two charts." },
  { href: "/sky-now", title: "Sky Now", desc: "Live planet positions, retrogrades and the lunar phase." },
  { href: "/sky-map", title: "Sky Map", desc: "Where the Sun, Moon and planets sit above you right now." },
  { href: "/ephemeris", title: "Ephemeris", desc: "Raw planetary tables you can check against any source." },
];

export default function HowItWorksPage() {
  return (
    <div className="constellation-bg">
      <JsonLd data={websiteJsonLd()} />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Breadcrumbs items={[{ label: "How Zunara Works", href: "/how-it-works" }]} />

        <header className="mx-auto mt-8 max-w-3xl text-center">
          <p className="kicker">Our method</p>
          <h1 className="mt-3 font-display text-4xl text-starlight sm:text-5xl">
            How Zunara Works
          </h1>
          <div aria-hidden="true" className="gold-rule mx-auto mt-6 w-20" />
          <p className="mt-6 font-serif-body text-xl italic leading-8 text-muted">
            Astronomy tells you where the planets are. Astrology wonders what that means.
            Zunara never lets the second part change the first.
          </p>
        </header>

        <section className="mt-14" aria-labelledby="steps-heading">
          <div className="flex items-center justify-between border-b border-line-soft pb-5">
            <div>
              <p className="kicker">The pipeline</p>
              <h2 id="steps-heading" className="mt-2 font-display text-2xl text-starlight">
                From birth details to reading, in five steps
              </h2>
            </div>
            <span className="hidden text-sm text-subdued sm:block">
              Deterministic calculation, honest reflection
            </span>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl saturate-180 transition-colors hover:border-gold/30"
              >
                <span aria-hidden="true" className="font-display text-3xl text-gold/60">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-xl text-starlight">{s.title}</h3>
                <div aria-hidden="true" className="gold-rule mt-4 w-12" />
                <p className="mt-4 font-serif-body text-[1.02rem] leading-8 text-muted">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="promises-heading">
          <div className="flex items-center justify-between border-b border-line-soft pb-5">
            <div>
              <p className="kicker">The promises</p>
              <h2 id="promises-heading" className="mt-2 font-display text-2xl text-starlight">
                What we never do
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-6 backdrop-blur-xl">
              <p className="kicker text-emerald-300">We do</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                <li>• Calculate from the VSOP87 planetary theory used in published ephemerides.</li>
                <li>• Keep interpretation clearly separate from measurement.</li>
                <li>• Show you the raw numbers (ephemeris, retrograde, positions) so you can check them.</li>
                <li>• Use the whole-sign house system consistently across every chart.</li>
                <li>• Store your details only in your own browser, by default.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <p className="kicker text-gold">We never</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                <li>• Invent, approximate or fudge a planetary position to fit a prediction.</li>
                <li>• Let interpretation decide an orb, a house, a sign or a retrograde.</li>
                <li>• Claim astrology is science, medicine or a promise of fate.</li>
                <li>• Show fake stats, fake reviews or paywall-first popups.</li>
                <li>• Sell or share your birth details with anyone.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="tools-heading">
          <div className="flex items-center justify-between border-b border-line-soft pb-5">
            <div>
              <p className="kicker">One engine</p>
              <h2 id="tools-heading" className="mt-2 font-display text-2xl text-starlight">
                Every tool runs on the same truthful sky
              </h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-colors hover:border-gold/40"
              >
                <h3 className="font-display text-lg text-starlight group-hover:text-gold">
                  {tool.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{tool.desc}</p>
                <span aria-hidden="true" className="mt-3 inline-block text-sm text-gold">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-6 text-muted backdrop-blur-xl">
          <p>
            For the deeper story — the origin of sky-watching, the exact three-step method and
            the full editorial stance — read{" "}
            <Link href="/about" className="text-gold hover:underline">
              About Zunara &amp; Methodology →
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}