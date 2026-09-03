import Link from "next/link";
import { ZODIAC_SIGNS, formatDateRange } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "./zodiac-symbol";
import { elementText } from "./element";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export function ZodiacGrid({ hrefFor }: { hrefFor: (slug: string) => string }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
      {ZODIAC_SIGNS.map((sign, i) => (
        <Link
          key={sign.slug}
          href={hrefFor(sign.slug)}
          className="group relative flex flex-col gap-4 bg-white/[0.04] p-5 backdrop-blur-xl transition-colors hover:bg-white/[0.06]"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-sm italic text-subdued">
              {ROMAN[i % ROMAN.length]}
            </span>
            <span
              aria-hidden="true"
              className="font-display text-xl leading-none text-starlight/25 transition-colors group-hover:text-starlight/50"
            >
              {sign.name.charAt(0)}
            </span>
          </div>
          <ZodiacSymbol
            sign={sign.slug}
            className={`h-11 w-11 text-gold/80 transition-colors group-hover:text-gold ${elementText(sign.element)}`}
            strokeWidth={1.1}
            label={sign.name}
          />
          <div>
            <span className="block font-display text-xl text-starlight">{sign.name}</span>
            <span className="mt-0.5 block text-xs text-subdued">{formatDateRange(sign)}</span>
          </div>
          <div className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.18em] text-subdued">
            <span className={elementText(sign.element)}>{sign.element}</span>
            <span aria-hidden="true" className="text-starlight/20">·</span>
            <span>{sign.modality}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
