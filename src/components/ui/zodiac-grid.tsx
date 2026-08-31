import Link from "next/link";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "./zodiac-symbol";
import { formatDateRange } from "@/lib/zodiac/zodiac";

export function ZodiacGrid({ hrefFor }: { hrefFor: (slug: string) => string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {ZODIAC_SIGNS.map((sign) => (
        <Link
          key={sign.slug}
          href={hrefFor(sign.slug)}
          className="group relative flex flex-col gap-3 rounded-lg border border-line bg-obsidian p-5 transition-colors hover:border-gold/40 hover:bg-obsidian-2"
        >
          <div className="flex items-center gap-3">
            <ZodiacSymbol
              sign={sign.slug}
              size="md"
              className="text-gold"
              label={sign.name}
            />
            <span className="font-display text-lg text-starlight">{sign.name}</span>
          </div>
          <p className="text-xs text-subdued">{formatDateRange(sign)}</p>
          <span aria-hidden="true" className="absolute right-4 top-4 text-gold opacity-30 group-hover:opacity-70">
            {sign.glyph}
          </span>
        </Link>
      ))}
    </div>
  );
}
