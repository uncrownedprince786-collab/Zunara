interface JsonLdProps {
  /** Pre-built structured data (from src/lib/seo/jsonld) — rendered verbatim. */
  data?: Record<string, unknown>;
  type?: string;
  name?: string;
  description?: string;
  url?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

/**
 * Serialize JSON-LD for an inline <script>. Escapes `<` as `<` so no value
 * can break out of the script element (defensive; current inputs are all
 * site-defined config, but this hardens against any future dynamic input).
 */
function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Render any JSON-LD payload as a single <script type="application/ld+json">.
 * When `data` is provided it is emitted as-is (see the builders in
 * src/lib/seo/jsonld.ts); otherwise a small schema.org object is assembled
 * from the named props.
 */
export function JsonLd({
  data,
  type = "WebSite",
  name,
  description,
  url,
  datePublished,
  dateModified,
  author = "Zunara",
}: JsonLdProps) {
  const payload =
    data ??
    (() => {
      const built: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": type,
        name,
        description,
        url,
      };
      if (datePublished) built.datePublished = datePublished;
      if (dateModified) built.dateModified = dateModified;
      if (author)
        built.author = { "@type": "Organization", name: author };
      return built;
    })();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(payload) }}
    />
  );
}

/** Minimal raw script emitter for callers that already built the object. */
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}