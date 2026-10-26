import type { Metadata } from 'next'

import type { Media } from '@/payload-types'

// Page metadata from a document's SEO fields with fallbacks (spec §4, §6).
// Pure: callers pass already-fetched data; tested in tests/unit/seo.test.ts.

export const SITE_NAME = 'TRBD Consulting Group'
export const HOME_TITLE =
  'TRBD Consulting Group: Manpower, Training, Oil & Gas, Green Energy and Global Business Consulting'
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`

type MediaLike = Media | number | string | null | undefined

export type SeoFields =
  | {
      metaTitle?: string | null
      metaDescription?: string | null
      ogImage?: MediaLike
      noIndex?: boolean | null
    }
  | null
  | undefined

export type MetadataInput = {
  /** Public path, e.g. "/" or "/oil-gas". */
  path: string
  /** The document's own title, used when no meta title is set. */
  title: string
  /** Home uses an absolute title instead of the "%s | TRBD" template. */
  isHome?: boolean
  /** Text to fall back on for the description (summary, intro). */
  fallbackDescription?: string | null
  /** Image to fall back on (the document's hero image). */
  fallbackImage?: MediaLike
  /** Site-wide default from Site Settings. */
  defaultImage?: MediaLike
  seo?: SeoFields
}

type OgImage = { url: string; width?: number; height?: number; alt?: string }

/** Prefer the 1200×630 crop generated for link previews; else the original. */
export function ogImageFrom(media: MediaLike): OgImage | null {
  if (!media || typeof media !== 'object' || !media.url) return null
  const og = media.sizes?.og
  if (og?.url)
    return { url: og.url, width: og.width ?? 1200, height: og.height ?? 630, alt: media.alt }
  return {
    url: media.url,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
    alt: media.alt,
  }
}

/** Collapse whitespace and cut at a word boundary, adding an ellipsis. */
export function truncate(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, '')}…`
}

export function generatedOgPath(title: string): string {
  return `/og?${new URLSearchParams({ title }).toString()}`
}

export function buildMetadata(input: MetadataInput): Metadata {
  const { seo, path, isHome } = input
  const title = seo?.metaTitle?.trim() || (isHome ? HOME_TITLE : input.title)
  const descriptionSource = seo?.metaDescription?.trim() || input.fallbackDescription?.trim()
  const description = descriptionSource ? truncate(descriptionSource) : undefined

  const image = ogImageFrom(seo?.ogImage) ??
    ogImageFrom(input.fallbackImage) ??
    ogImageFrom(input.defaultImage) ?? {
      url: generatedOgPath(isHome ? SITE_NAME : input.title),
      width: 1200,
      height: 630,
      alt: isHome ? SITE_NAME : input.title,
    }

  // The home title (or an editor's own meta title on home) is used as-is;
  // every other page gets the "| TRBD Consulting Group" suffix.
  const metaTitle: Metadata['title'] = isHome ? { absolute: title } : title
  const socialTitle = isHome ? title : `${title} | ${SITE_NAME}`

  return {
    title: metaTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_IN',
      url: path,
      title: socialTitle,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [image.url],
    },
    ...(seo?.noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}
