import { pagePath } from './slugs'

// Resolves a CMS link (fields/link.ts) to an href. Relations may arrive as
// populated docs or bare ids; an unpopulated relation resolves to null.

type Related = { slug?: string | null } | number | string | null | undefined

export type CmsLink = {
  type?: 'page' | 'vertical' | 'anchor' | 'external' | null
  page?: Related
  vertical?: Related
  anchor?: string | null
  url?: string | null
  newTab?: boolean | null
  label?: string | null
}

const slugOf = (related: Related): string | null =>
  related && typeof related === 'object' && related.slug ? related.slug : null

export function resolveHref(link: CmsLink | null | undefined): string | null {
  if (!link) return null
  switch (link.type) {
    case 'page': {
      const slug = slugOf(link.page)
      return slug ? pagePath(slug) : null
    }
    case 'vertical': {
      const slug = slugOf(link.vertical)
      return slug ? `/${slug}` : null
    }
    case 'anchor':
      return link.anchor ? `/#${link.anchor}` : null
    case 'external':
      return link.url || null
    default:
      return null
  }
}

/** Link props for an <a>/<Link>: external links get rel/target when asked. */
export function linkProps(link: CmsLink | null | undefined) {
  const href = resolveHref(link)
  if (!href) return null
  const external = link?.type === 'external'
  return {
    href,
    external,
    ...(external && link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  }
}
