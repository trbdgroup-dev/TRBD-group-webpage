import { pagePath } from './slugs'

// Draft preview helpers (B6). Only same-site paths are allowed as redirect
// targets, so /preview can never be used as an open redirect.

export function safePreviewPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return null
  }
  try {
    const url = new URL(value, 'http://site.invalid')
    if (url.origin !== 'http://site.invalid') return null
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return null
  }
}

/** Public path of a Pages or Verticals document, used by the admin's live preview. */
export function documentPath(collection: string, slug: string | null | undefined): string | null {
  if (!slug) return null
  if (collection === 'pages') return pagePath(slug)
  if (collection === 'verticals') return `/${slug}`
  return null
}

/** URL the admin opens to preview a document as a draft. */
export function previewUrl(siteUrl: string, secret: string, path: string): string {
  const params = new URLSearchParams({ secret, path })
  return `${siteUrl.replace(/\/$/, '')}/preview?${params.toString()}`
}
