interface JsonLdProps {
  type?: string;
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

export function JsonLd({
  type = "WebSite",
  name,
  description,
  url,
  datePublished,
  dateModified,
  author = "Zunara",
}: JsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
  };
  if (datePublished) data.datePublished = datePublished;
  if (dateModified) data.dateModified = dateModified;
  if (author) data.author = { "@type": "Organization", name: author };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
