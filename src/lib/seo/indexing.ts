import type { MetadataRoute } from 'next'

// Only the real production deployment may be indexed. Local, preview and
// staging copies are blocked, so drafts never show up in search results.
// Vercel sets VERCEL_ENV to "production" | "preview" | "development".

type Env = Record<string, string | undefined>

export const allowIndexing = (env: Env = process.env): boolean => env.VERCEL_ENV === 'production'

/** Paths crawlers never need: the CMS, its API, previews, generated images, later the account area. */
export const PRIVATE_PATHS = ['/cms', '/api/', '/preview', '/og', '/account']

export function robotsFor(siteUrl: string, env: Env = process.env): MetadataRoute.Robots {
  if (!allowIndexing(env)) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
    sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  }
}
