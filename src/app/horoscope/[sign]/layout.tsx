import { notFound } from "next/navigation";
import { getZodiacSign, formatDateRange } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";

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
    <div>
      <div className="border-b border-line-soft bg-obsidian/40">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-5">
            <ZodiacSymbol sign={sign.slug} size="lg" className="text-gold" label={sign.name} />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-subdued">
                {sign.element} \u00b7 {sign.modality}
              </p>
              <h1 className="font-display text-3xl text-starlight sm:text-4xl">{sign.name}</h1>
              <p className="mt-1 text-sm text-muted">{formatDateRange(sign)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-0 py-8 sm:px-6">{children}</div>
    </div>
  );
}
