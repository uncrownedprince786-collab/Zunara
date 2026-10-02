import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShareButtons } from "@/components/ui/share-buttons";
import { absoluteUrl } from "@/lib/seo/site";
import { pageMetadata } from "@/lib/seo/metadata";
import { getJournalArticle, getJournalArticles, markdownBody } from "@/lib/journal/articles";

export const dynamicParams = false;

export function generateStaticParams() {
  return getJournalArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getJournalArticle(slug);
  if (!article) return {};
  const path = `/journal/${article.slug}`;
  return pageMetadata(
    path,
    article.title,
    article.description,
    "article",
    [...article.tags, "astrology", "astronomy"],
  );
}

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getJournalArticle(slug);
  if (!article) notFound();
  const canonical = absoluteUrl(`/journal/${article.slug}`);
  const parts = markdownBody(article.body);
  const all = getJournalArticles();

  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: article.description,
              inLanguage: "en",
              author: { "@id": absoluteUrl("/#organization") },
              publisher: { "@id": absoluteUrl("/#organization") },
              mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
            }),
          }}
        />
        <Breadcrumbs
          items={[
            { label: "Journal", href: "/journal" },
            { label: article.title, href: `/journal/${article.slug}` },
          ]}
        />

        <header className="mt-8">
          <p className="kicker">Zunara Journal · Essay</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-starlight sm:text-5xl">{article.title}</h1>
        </header>

        <article className="paper-panel mt-9 rounded-md">
          <div className="border-b border-p-line p-2 text-center">
            <p className="font-serif-body italic text-p-muted">Zunara Publishing · The astronomy, honestly written</p>
          </div>
          <div className="space-y-6 p-7 sm:p-9">
            {parts.map((part, i) => {
              if (part.type === "sub") {
                return (
                  <h2 key={i} className="pt-2 font-display text-xl text-starlight">
                    {renderParts(part.parts)}
                  </h2>
                );
              }
              if (part.type === "cta") {
                const href = part.parts[0]?.href;
                if (!href) return null;
                return (
                  <div key={i} className="flex justify-center pt-2">
                    <Link
                      href={href}
                      className="inline-flex max-w-full items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-6 py-3 text-center text-sm font-medium text-gold transition-colors hover:bg-gold/15"
                    >
                      {part.parts[0].text} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                );
              }
              return (
                <p
                  key={i}
                  className={`font-serif-body text-[1.05rem] leading-8 text-p-ink ${
                    part.parts.every((p) => p.italic) ? "text-p-muted" : ""
                  }`}
                >
                  {renderParts(part.parts)}
                </p>
              );
            })}
          </div>
        </article>

        <ShareButtons title={article.title} path={`/journal/${article.slug}`} />

        {all.length > 0 && (
          <section className="mt-12 border-t border-line-soft pt-8">
            <div className="flex items-center gap-4">
              <h2 className="kicker">More from the Journal</h2>
              <div aria-hidden="true" className="gold-rule h-px flex-1" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {all
                .filter((a) => a.slug !== article.slug)
                .map((a) => (
                  <Link
                    key={a.slug}
                    href={`/journal/${a.slug}`}
                    className="rounded-full border border-white/[0.12] bg-cosmic/10 px-4 py-2 text-sm text-muted backdrop-blur-sm transition-colors hover:border-gold/40 hover:text-starlight"
                  >
                    {a.title}
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function renderParts(parts: Array<{ text: string; bold?: boolean; italic?: boolean; href?: string }>) {
  return parts.map((p, i) =>
    p.href ? (
      <Link key={i} href={p.href} className="text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold">
        {p.text}
      </Link>
    ) : p.bold ? (
      <strong key={i}>{p.text}</strong>
    ) : p.italic ? (
      <em key={i}>{p.text}</em>
    ) : (
      <span key={i}>{p.text}</span>
    ),
  );
}