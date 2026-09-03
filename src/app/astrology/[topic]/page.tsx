import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAstrologyTopic, ASTROLOGY_TOPICS } from "@/lib/astrology/topics";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl, SITE } from "@/lib/seo/site";

export const revalidate = 604800;

export const dynamicParams = false;

export function generateStaticParams() {
  return ASTROLOGY_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const data = getAstrologyTopic(topic);
  if (!data) return {};
  const canonical = absoluteUrl(`/astrology/${topic}`);
  return {
    title: data.title,
    description: data.summary,
    alternates: { canonical },
    openGraph: { title: data.title, description: data.summary, url: canonical, type: "article", siteName: SITE.name, images: [absoluteUrl(SITE.image)] },
    twitter: { card: "summary_large_image", title: data.title, description: data.summary, site: SITE.twitter, creator: SITE.twitter, images: [absoluteUrl(SITE.image)] },
  };
}

export default async function AstrologyTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const data = getAstrologyTopic(topic);
  if (!data) notFound();

  const canonical = absoluteUrl(`/astrology/${topic}`);
  const scriptData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.summary,
    inLanguage: "en",
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };

  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(scriptData) }} />
        <Breadcrumbs
          items={[
            { label: "Astrology", href: "/astrology" },
            { label: data.title, href: `/astrology/${topic}` },
          ]}
        />

        <header className="mt-8">
          <p className="kicker">From the knowledge base</p>
          <h1 className="mt-3 font-display text-4xl text-starlight sm:text-5xl">{data.title}</h1>
          <p className="mt-4 font-serif-body text-lg italic leading-8 text-muted">{data.summary}</p>
        </header>

        <div className="paper-panel mt-9 rounded-md">
          <div className="border-b border-p-line p-2 text-center">
            <p className="font-serif-body italic text-p-muted">Zunara · The astronomy</p>
          </div>
          <div className="space-y-6 p-7 sm:p-9">
            {data.body.map((para, i) => (
              <p
                key={i}
                className={`font-serif-body text-[1.05rem] leading-8 text-p-ink ${
                  i === 0 ? "drop-cap" : ""
                }`}
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        {data.related.length > 0 && (
          <section className="mt-12 border-t border-line-soft pt-8">
            <div className="flex items-center gap-4">
              <h2 className="kicker">Continue reading</h2>
              <div aria-hidden="true" className="gold-rule h-px flex-1" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {data.related.map((slug) => {
                const related = getAstrologyTopic(slug);
                if (!related) return null;
                return (
                  <Link
                    key={slug}
                    href={`/astrology/${slug}`}
                    className="rounded-full border border-white/[0.12] bg-cosmic/10 px-4 py-2 text-sm text-muted backdrop-blur-sm transition-colors hover:border-gold/40 hover:text-starlight"
                  >
                    {related.title}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
