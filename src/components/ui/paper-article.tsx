import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

interface PaperArticleProps {
  kicker?: string;
  title: string;
  lead?: string;
  crumbs: Crumb[];
  children: ReactNode;
}

/**
 * Shared editorial article shell: constellation backdrop, breadcrumbs,
 * masthead kicker/title, and a cream "paper" reading panel.
 */
export function PaperArticle({ kicker, title, lead, crumbs, children }: PaperArticleProps) {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Breadcrumbs items={crumbs} />
        <header className="mt-8">
          {kicker && <p className="kicker">{kicker}</p>}
          <h1 className={`${kicker ? "mt-3" : "mt-8"} font-display text-4xl text-starlight sm:text-5xl`}>
            {title}
          </h1>
          {lead && (
            <p className="mt-5 font-serif-body text-xl italic leading-8 text-muted">{lead}</p>
          )}
        </header>
        <div className="paper-panel mt-10 rounded-md">
          <div className="border-b border-p-line p-2 text-center">
            <p className="font-serif-body italic text-p-muted">Zunara · {kicker ?? "The publication"}</p>
          </div>
          <div className="space-y-8 p-7 sm:p-9">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface PaperSectionProps {
  heading: string;
  children: ReactNode;
}

export function PaperSection({ heading, children }: PaperSectionProps) {
  return (
    <section>
      <h2 className="kicker">{heading}</h2>
      <div className="gold-rule mt-3 w-14" />
      <p className="mt-4 font-serif-body text-[1.05rem] leading-8 text-p-ink">{children}</p>
    </section>
  );
}
