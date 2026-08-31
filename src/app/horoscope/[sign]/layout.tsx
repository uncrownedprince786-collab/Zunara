import { notFound } from "next/navigation";
import { getZodiacSign, formatDateRange } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { elementText } from "@/components/ui/element";

export function generateStaticParams() {
  return ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"].map((sign) => ({ sign }));
}

export default async function SignLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sign: string }>;
}) {
  const { sign: signSlug } = await params;
  const sign = getZodiacSign(signSlug);
  if (!sign) notFound();

  return (
    <div className="constellation-bg">
      <header className="relative border-b border-line-soft">
        <div aria-hidden="true" className="starfield h-6 opacity-70" />
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex shrink-0 items-center justify-center rounded-full border border-line bg-ink-2 p-6">
              <ZodiacSymbol sign={sign.slug} size={52} className="text-gold" strokeWidth={1.1} label={sign.name} />
            </div>
            <div>
              <p className={`kicker ${elementText(sign.element)}`}>
                {sign.element} \u00b7 {sign.modality} \u00b7 {sign.ruler}
                {sign.modernRuler ? ` \u00b7 ${sign.modernRuler}` : ""}
              </p>
              <h1 className="mt-2 font-display text-4xl font-medium text-starlight sm:text-5xl">
                {sign.name}
              </h1>
              <p className="mt-2 text-sm text-muted">{formatDateRange(sign)}</p>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="gold-rule" />
      </header>
      <div className="mx-auto max-w-6xl px-0 py-8 sm:px-6">{children}</div>
    </div>
  );
}
