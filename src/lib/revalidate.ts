import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

import { pagePath } from './slugs'

// On-demand refresh of the statically generated site when content is published
// (B6). revalidatePath marks a path so its next visit is regenerated fresh.

export type RevalidateTarget = { path: string; type?: 'layout' }

/** Everything under the root layout: home, vertical pages, privacy, header, footer. */
const WHOLE_SITE: RevalidateTarget = { path: '/', type: 'layout' }
/** The sitemap is a route handler outside the layout, so it is refreshed explicitly. */
const SITEMAP: RevalidateTarget = { path: '/sitemap.xml' }

type Status = 'draft' | 'published' | null | undefined
type Doc = { slug?: string | null; _status?: Status } | null | undefined

/** Draft saves never touch the live site; publishing or unpublishing does. */
export function affectsLiveSite(doc: Doc, previousDoc: Doc): boolean {
  const versioned = doc?._status !== undefined || previousDoc?._status !== undefined
  if (!versioned) return true
  return doc?._status === 'published' || previousDoc?._status === 'published'
}

/** Which paths to refresh for a change to a document in `collection`. */
export function targetsFor(collection: string, doc: Doc, previousDoc?: Doc): RevalidateTarget[] {
  if (collection === 'pages') {
    const paths = new Set<string>()
    if (doc?.slug) paths.add(pagePath(doc.slug))
    if (previousDoc?.slug) paths.add(pagePath(previousDoc.slug))
    return [...[...paths].map((path) => ({ path })), SITEMAP]
  }
  // Verticals feed the home page, their own page and the footer; media and
  // globals can appear anywhere. The site is small, so refresh all of it.
  return [WHOLE_SITE, SITEMAP]
}

function run(targets: RevalidateTarget[], log: (msg: string) => void) {
  for (const target of targets) {
    try {
      if (target.type) revalidatePath(target.path, target.type)
      else revalidatePath(target.path)
      log(`Revalidated ${target.path}${target.type ? ` (${target.type})` : ''}`)
    } catch (error) {
      // Outside a Next.js request (seed scripts, CLI) there is nothing to refresh.
      log(`Skipped revalidating ${target.path}: ${(error as Error).message}`)
    }
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({
  collection,
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context.disableRevalidate) return doc
  if (!affectsLiveSite(doc, previousDoc)) return doc
  run(targetsFor(collection.slug, doc, previousDoc), (msg) => req.payload.logger.info(msg))
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({
  collection,
  doc,
  req,
  context,
}) => {
  if (context.disableRevalidate) return doc
  run(targetsFor(collection.slug, doc), (msg) => req.payload.logger.info(msg))
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req, context }) => {
  if (context.disableRevalidate) return doc
  run([WHOLE_SITE, SITEMAP], (msg) => req.payload.logger.info(msg))
  return doc
}
