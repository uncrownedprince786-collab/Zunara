"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  celebritiesForDate,
  type Celebrity,
  type CelebrityRegion,
} from "@/lib/content/celebrities";
import { zodiacForDate, type ZodiacSign } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "./zodiac-symbol";

const REGION_STYLE: Record<CelebrityRegion, string> = {
  Hollywood: "border-white/10 bg-white/[0.04] text-muted",
  Bollywood: "border-gold/20 bg-gold/5 text-gold-deep",
  "K-Pop": "border-cosmic/25 bg-cosmic/10 text-cosmic",
  Thai: "border-air/25 bg-air/10 text-air",
  Sports: "border-fire/25 bg-fire/10 text-fire",
  Global: "border-white/10 bg-white/[0.04] text-muted",
};

const ELEMENT_GLOW: Record<ZodiacSign["element"], string> = {
  Fire: "from-fire/25",
  Earth: "from-earth/25",
  Air: "from-air/25",
  Water: "from-water/25",
};

const ELEMENT_RING: Record<ZodiacSign["element"], string> = {
  Fire: "text-fire",
  Earth: "text-earth",
  Air: "text-air",
  Water: "text-water",
};

const ELEMENT_BG: Record<ZodiacSign["element"], string> = {
  Fire: "from-fire/15 to-nebula/40",
  Earth: "from-earth/15 to-nebula/40",
  Air: "from-air/15 to-nebula/40",
  Water: "from-water/15 to-nebula/40",
};

function PortraitAvatar({
  celebrity,
  sign,
}: {
  celebrity: Celebrity;
  sign: ZodiacSign;
}) {
  const [failed, setFailed] = useState(false);
  const glow = ELEMENT_GLOW[sign.element];
  const bg = ELEMENT_BG[sign.element];

  if (!celebrity.image || failed) {
    return (
      <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${bg}`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-3 -top-3 h-10 w-10 rounded-full bg-gradient-to-br ${glow} to-transparent blur-xl`}
        />
        <span className={`font-display text-lg font-semibold ${ELEMENT_RING[sign.element]}`}>
          <ZodiacSymbol sign={sign.slug} size={24} label={sign.name} />
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-16 w-16 shrink-0">
      <div className="absolute inset-0 overflow-hidden rounded-full border border-white/10">
        <Image
          src={celebrity.image}
          alt={celebrity.name}
          width={120}
          height={120}
          quality={80}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
          sizes="120px"
        />
      </div>
      <span
        aria-hidden
        className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-gold/25 bg-cosmic/15"
      >
        <ZodiacSymbol sign={sign.slug} size={16} label={sign.name} />
      </span>
    </div>
  );
}

function CelebrityCard({ celebrity }: { celebrity: Celebrity }) {
  const sign = zodiacForDate(1990, celebrity.month, celebrity.day);
  const regionStyle = REGION_STYLE[celebrity.region];
  const glow = ELEMENT_GLOW[sign.element];
  const ring = ELEMENT_RING[sign.element];
  const dateLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(2000, celebrity.month - 1, celebrity.day));

  return (
    <div className="group relative flex min-w-[19rem] max-w-[19rem] flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.04] p-6 backdrop-blur-xl saturate-180 transition-colors hover:border-gold/40 sm:min-w-[22rem] sm:max-w-[22rem]">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${glow} to-transparent blur-2xl`}
      />

      <div className="relative flex items-start gap-4">
        <PortraitAvatar celebrity={celebrity} sign={sign} />
        <div className="min-w-0">
          <h3 className="truncate font-display text-xl text-starlight">{celebrity.name}</h3>
          <p className="mt-0.5 text-sm text-muted">{celebrity.profession}</p>
          <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[0.62rem] font-medium tracking-wide ${regionStyle}`}>
            {celebrity.region}
          </span>
        </div>
      </div>

      <p className="relative mt-5 text-sm leading-6 text-p-muted">{celebrity.star}</p>

      <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-p-line pt-4">
        <span className="flex items-center gap-2 text-xs text-subdued">
          <span className={`text-sm ${ring}`}>
            <ZodiacSymbol sign={sign.slug} size={18} label={sign.name} />
          </span>
          {sign.name} · {dateLabel}
        </span>
        <a
          href={celebrity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold-deep transition-colors hover:bg-gold/20"
        >
          Full profile
          <span aria-hidden className="text-gold">&rarr;</span>
        </a>
      </div>
    </div>
  );
}

/**
 * Dynamic "Born Under Today's Stars" section. Filters a curated dataset by the
 * caller's date (UTC) and renders frosted-glass celebrity cards in a
 * horizontally scrollable, arrow-navigated carousel. Client-side so the
 * portrait fallback + scroll controls can react.
 */
export function CelebrityBirthdays() {
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const dateLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(now);

  const people = celebritiesForDate(month, day);
  const trackRef = useRef<HTMLDivElement>(null);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  // Arrows only appear when the carousel actually has more cards than fit in
  // a single row (3+), per the celebrity-count threshold.
  const showArrows = people.length > 3;

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setHasPrev(el.scrollLeft > 4);
    setHasNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure, people.length]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // Fixed 340px step, smooth.
    el.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex items-end justify-between border-b border-line-soft pb-5">
        <div>
          <p className="kicker">Born under today&rsquo;s stars</p>
          <h2 className="mt-3 font-display text-3xl text-starlight sm:text-4xl">
            {dateLabel}
          </h2>
        </div>
        {showArrows && (
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              disabled={!hasPrev}
              aria-label="Previous celebrities"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-starlight transition-colors hover:border-gold/40 hover:bg-white/[0.08] disabled:pointer-events-none disabled:opacity-30"
            >
              <span aria-hidden>&larr;</span>
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              disabled={!hasNext}
              aria-label="Next celebrities"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-starlight transition-colors hover:border-gold/40 hover:bg-white/[0.08] disabled:pointer-events-none disabled:opacity-30"
            >
              <span aria-hidden>&rarr;</span>
            </button>
          </div>
        )}
      </div>

      {people.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          No featured stars born today — but every day is written in the sky.
          Explore the signs to see who shares yours.
        </p>
      ) : (
        <div className="relative mt-8">
          <div
            ref={trackRef}
            className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scroll-smooth"
          >
            {people.map((celebrity) => (
              <div key={celebrity.url} className="shrink-0 snap-start">
                <CelebrityCard celebrity={celebrity} />
              </div>
            ))}
          </div>

          {showArrows && (
            <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={!hasPrev}
                aria-label="Previous celebrities"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-starlight transition-colors hover:border-gold/40 hover:bg-white/[0.08] disabled:pointer-events-none disabled:opacity-30"
              >
                <span aria-hidden>&larr;</span>
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={!hasNext}
                aria-label="Next celebrities"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-starlight transition-colors hover:border-gold/40 hover:bg-white/[0.08] disabled:pointer-events-none disabled:opacity-30"
              >
                <span aria-hidden>&rarr;</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
