import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload, type Payload } from 'payload'

import { homeBlocks, navigationAnchors, privacyBlocks, siteSettings } from './content/site'
import { draftRichText, verticals } from './content/verticals'
import { ensureAdmin } from './lib/admin'

// Seeds the CMS for local development and first launch (task E3).
//
//   npm run seed        create whatever is missing; never overwrite edits
//   npm run seed:reset  delete the seeded content first, then reload it
//
// Verticals are published with the approved HTML wording; the expanded copy is
// saved on top as an unpublished draft (copy status "Draft – needs review").
//
// Rules learned the hard way (see .10x SDE notes):
// - pass a FRESH `context` object to every Local API call: Payload writes to it,
//   and a shared one makes later uploads silently skip storage;
// - bulk delete/update report failures in `errors` instead of throwing.

// `payload run` does not forward CLI flags to the script, so reset is an env var.
const RESET = process.env.SEED_RESET === '1'
const context = () => ({ disableRevalidate: true })
const log: string[] = []

type ManifestEntry = { file: string; use: string; alt: string; credit: string; sourceUrl: string }
const manifest: ManifestEntry[] = JSON.parse(
  fs.readFileSync(path.resolve('seed/images/manifest.json'), 'utf8'),
)

function assertNoErrors(label: string, result: { errors: { message: string }[] }) {
  if (result.errors.length) {
    throw new Error(`${label}: ${result.errors.map((e) => e.message).join('; ')}`)
  }
}

async function reset(payload: Payload) {
  assertNoErrors(
    'reset pages',
    await payload.delete({
      collection: 'pages',
      where: { slug: { in: ['home', 'privacy', 'sample-blocks'] } },
      context: context(),
    }),
  )
  assertNoErrors(
    'reset verticals',
    await payload.delete({
      collection: 'verticals',
      where: { id: { exists: true } },
      context: context(),
    }),
  )
  assertNoErrors(
    'reset media',
    await payload.delete({
      collection: 'media',
      where: {
        or: [
          { sourceUrl: { in: manifest.map((m) => m.sourceUrl) } },
          { credit: { contains: 'temp-hero' } },
        ],
      },
      context: context(),
    }),
  )
  await payload.updateGlobal({
    slug: 'navigation',
    data: { headerLinks: [], footerLinks: [], headerCta: { link: { label: null } } },
    context: context(),
  })
  log.push('reset: removed seeded pages, verticals, media and navigation links')
}

async function seedMedia(payload: Payload): Promise<Map<string, number>> {
  const ids = new Map<string, number>()
  for (const entry of manifest) {
    const { docs } = await payload.find({
      collection: 'media',
      where: { sourceUrl: { equals: entry.sourceUrl } },
      limit: 1,
      depth: 0,
    })
    if (docs[0]) {
      ids.set(entry.file, docs[0].id)
      continue
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt: entry.alt, credit: entry.credit, sourceUrl: entry.sourceUrl },
      filePath: path.resolve('seed/images', entry.file),
      context: context(),
    })
    ids.set(entry.file, created.id)
    log.push(`media: uploaded ${entry.file}`)
  }
  return ids
}

async function findPage(payload: Payload, slug: string) {
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    draft: true,
  })
  return docs[0] ?? null
}

async function seedPages(payload: Payload, media: Map<string, number>) {
  let privacy = await findPage(payload, 'privacy')
  if (!privacy) {
    privacy = await payload.create({
      collection: 'pages',
      data: {
        title: 'Privacy notice',
        slug: 'privacy',
        layout: privacyBlocks,
        _status: 'published',
      },
      context: context(),
    })
    log.push('pages: created privacy notice (published; review before launch)')
  }

  if (!(await findPage(payload, 'home'))) {
    const heroImage = media.get('trbd-hero-boardroom.jpg')
    if (!heroImage) throw new Error('hero image missing from the media manifest')
    await payload.create({
      collection: 'pages',
      data: { title: 'Home', slug: 'home', layout: homeBlocks(heroImage), _status: 'published' },
      context: context(),
    })
    log.push('pages: created home page')
  }
  return privacy.id
}

async function seedVerticals(payload: Payload, media: Map<string, number>) {
  for (const v of verticals) {
    const { docs } = await payload.find({
      collection: 'verticals',
      where: { slug: { equals: v.slug } },
      limit: 1,
      depth: 0,
      draft: true,
    })
    if (docs[0]) continue

    const heroImage = media.get(v.image)
    if (!heroImage) throw new Error(`image ${v.image} missing from the media manifest`)

    const services = v.base.services.map((s) => ({ ...s }))
    const published = await payload.create({
      collection: 'verticals',
      data: {
        slug: v.slug,
        order: v.order,
        heroImage,
        copyStatus: 'draft-needs-review',
        name: v.base.name,
        title: v.base.title,
        heroHeadline: v.base.heroHeadline,
        summary: v.base.summary,
        whoWeWorkWith: v.base.whoWeWorkWith.map((label) => ({ label })),
        services,
        _status: 'published',
      },
      context: context(),
    })

    // Expanded copy as an unpublished draft on top of the published version.
    const rich = draftRichText(v)
    await payload.update({
      collection: 'verticals',
      id: published.id,
      draft: true,
      data: {
        services: services.map((s, i) => ({ ...s, description: rich.serviceDescriptions[i] })),
        howWeDeliver: rich.howWeDeliver,
        faqs: v.draft.faqs,
      },
      context: context(),
    })
    log.push(`verticals: created ${v.base.name} (published) with expanded copy as a draft`)
  }
}

async function seedGlobals(payload: Payload, privacyPageId: number) {
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  if (!settings.updatedAt || RESET) {
    await payload.updateGlobal({ slug: 'site-settings', data: siteSettings, context: context() })
    log.push('globals: site settings saved')
  }

  const navigation = await payload.findGlobal({ slug: 'navigation', depth: 0 })
  if (!navigation.headerLinks?.length && !navigation.footerLinks?.length) {
    const anchor = (label: string, value: string) => ({
      link: { label, type: 'anchor' as const, anchor: value as 'about' },
    })
    await payload.updateGlobal({
      slug: 'navigation',
      data: {
        headerLinks: navigationAnchors.header.map((l) => anchor(l.label, l.anchor)),
        headerCta: anchor(navigationAnchors.cta.label, navigationAnchors.cta.anchor),
        footerLinks: [
          ...navigationAnchors.footer.map((l) => anchor(l.label, l.anchor)),
          { link: { label: 'Privacy notice', type: 'page' as const, page: privacyPageId } },
        ],
      },
      context: context(),
    })
    log.push('globals: navigation links saved')
  }
}

const payload = await getPayload({ config })
try {
  log.push(await ensureAdmin(payload))
  if (RESET) await reset(payload)
  const media = await seedMedia(payload)
  const privacyId = await seedPages(payload, media)
  await seedVerticals(payload, media)
  await seedGlobals(payload, privacyId)
  log.forEach((line) => payload.logger.info(`seed: ${line}`))
  payload.logger.info(
    `seed: done (${log.length} steps). Seeding skips page refreshes, so rebuild before testing a production build.`,
  )
  process.exit(0)
} catch (error) {
  log.forEach((line) => payload.logger.info(`seed: ${line}`))
  payload.logger.error(`seed failed: ${(error as Error).message}`)
  process.exit(1)
}
