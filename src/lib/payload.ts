import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Navigation, Page, SiteSetting, Vertical } from '@/payload-types'

// Server-side reads for the public site (C1). Pages are statically generated and
// refreshed by lib/revalidate. In draft mode (enabled only by /preview after a
// staff sign-in check) reads include unpublished drafts.

export const getPayloadClient = cache(() => getPayload({ config }))

const readMode = cache(async () => {
  const { isEnabled } = await draftMode()
  // Draft mode is only ever switched on for signed-in staff, so access checks can
  // be skipped there; the public path always enforces collection access rules.
  return isEnabled
    ? ({ draft: true, overrideAccess: true } as const)
    : ({ draft: false, overrideAccess: false } as const)
})

export const isPreview = cache(async () => (await draftMode()).isEnabled)

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1, ...(await readMode()) })
})

export const getNavigation = cache(async (): Promise<Navigation> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation', depth: 1, ...(await readMode()) })
})

/** All verticals in display order, with hero images populated. */
export const getVerticals = cache(async (): Promise<Vertical[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'verticals',
    sort: 'order',
    limit: 20,
    depth: 1,
    pagination: false,
    ...(await readMode()),
  })
  return docs
})

export const getVertical = cache(async (slug: string): Promise<Vertical | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'verticals',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    ...(await readMode()),
  })
  return docs[0] ?? null
})

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    ...(await readMode()),
  })
  return docs[0] ?? null
})
