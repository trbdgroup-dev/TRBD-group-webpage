import type { MetadataRoute } from 'next'

import { env } from '@/lib/env'
import { getPayloadClient } from '@/lib/payload'
import { pagePath } from '@/lib/slugs'

// Published pages and verticals, skipping any marked "Hide from search engines".
// Refreshed together with the pages (lib/revalidate refreshes the whole site
// when verticals change, and this route sits under the same root layout).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  const published = { _status: { equals: 'published' } } as const
  const indexable = { 'seo.noIndex': { not_equals: true } } as const

  const [pages, verticals] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: { and: [published, indexable] },
      select: { slug: true, updatedAt: true },
      pagination: false,
      depth: 0,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'verticals',
      where: { and: [published, indexable] },
      select: { slug: true, updatedAt: true },
      sort: 'order',
      pagination: false,
      depth: 0,
      overrideAccess: false,
    }),
  ])

  return [
    ...pages.docs.map((page) => ({
      url: `${base}${pagePath(page.slug)}`,
      lastModified: page.updatedAt,
      priority: page.slug === 'home' ? 1 : 0.5,
    })),
    ...verticals.docs.map((vertical) => ({
      url: `${base}/${vertical.slug}`,
      lastModified: vertical.updatedAt,
      priority: 0.8,
    })),
  ]
}
