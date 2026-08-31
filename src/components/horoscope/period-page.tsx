import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PeriodType } from "@/lib/calendar/periods";
import { periodLabel } from "@/lib/calendar/periods";
import { getZodiacSign } from "@/lib/zodiac/zodiac";
import { getHoroscopeContent } from "@/lib/horoscope/read";
import { HoroscopeArticle } from "@/components/ui/horoscope-article";
import { ZodiacPeriodStrip } from "@/components/ui/zodiac-period-strip";
import { horoscopeMetadata } from "@/lib/seo/metadata";

interface PeriodPageProps {
  params: Promise<{ sign: string }>;
}

export function makePeriodPage(periodType: PeriodType) {
  const periodNoun: Record<PeriodType, string> = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
  };
  const pathFor = (sign: string) =>
    `/horoscope/${sign}/${periodType === "daily" ? "today" : periodType}`;

  async function Page({ params }: PeriodPageProps) {
    const { sign } = await params;
    const signData = getZodiacSign(sign);
    if (!signData) notFound();

    const now = new Date();
    const result = getHoroscopeContent(sign, periodType, now);
    if (!result) notFound();

    const crumbs = [
      { label: "Horoscopes", href: "/horoscope" },
      { label: signData.name, href: `/horoscope/${sign}` },
      { label: periodNoun[periodType], href: pathFor(sign) },
    ];

    return (
      <div>
        <ZodiacPeriodStrip periodType={periodType} activeSign={sign} />
        <div className="mt-8">
          <HoroscopeArticle
            sign={signData}
            periodType={periodType}
            date={now}
            result={result}
            crumbs={crumbs}
          />
        </div>
      </div>
    );
  }

  async function generateMetadata({ params }: PeriodPageProps): Promise<Metadata> {
    const { sign } = await params;
    const signData = getZodiacSign(sign);
    if (!signData) return {};
    const label = periodLabel(periodType, new Date());
    return horoscopeMetadata(signData, periodType, label);
  }

  return { Page, generateMetadata };
}
