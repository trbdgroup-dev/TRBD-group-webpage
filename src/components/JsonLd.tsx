import { serializeJsonLd } from '@/lib/seo/jsonld'

// Structured data for search engines. The payload is built from our own objects
// and escaped by serializeJsonLd, so CMS text cannot break out of the script tag.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
