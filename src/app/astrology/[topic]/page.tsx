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
    openGraph: { title: data.title, description: data.summary, url: canonical, type: "article" },
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
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(scriptData) }} />
      <Breadcrumbs
        items={[
          { label: "Astrology", href: "/astrology" },
          { label: data.title, href: `/astrology/${topic}` },
        ]}
      />
      <header className="mt-8">
        <h1 className="font-display text-4xl text-starlight sm:text-5xl">{data.title}</h1>
        <p className="mt-3 text-lg text-muted">{data.summary}</p>
      </header>
      <div className="mt-8 space-y-6">
        {data.body.map((para, i) => (
          <p key={i} className="leading-7 text-starlight/90">{para}</p>
        ))}
      </div>
      {data.related.length > 0 && (
        <section className="mt-12 border-t border-line-soft pt-8">
          <h2 className="text-xs uppercase tracking-[0.18em] text-gold">Continue reading</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {data.related.map((slug) => {
              const related = getAstrologyTopic(slug);
              if (!related) return null;
              return (
                <Link
                  key={slug}
                  href={`/astrology/${slug}`}
                  className="rounded-full border border-line bg-obsidian px-4 py-2 text-sm text-muted transition-colors hover:border-gold/40 hover:text-starlight"
                >
                  {related.title}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
