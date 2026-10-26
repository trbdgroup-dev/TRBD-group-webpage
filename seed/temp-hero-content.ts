// TEMPORARY (delete in E3): content for viewing the hero and blocks during C3–C7.
// `npx payload run seed/temp-hero-content.ts` creates it; add `clean` to remove it.
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
// A fresh object per call: Payload writes to `context`, so sharing one object
// across Local API calls makes later uploads skip storage.
const context = () => ({ disableRevalidate: true })
const TAG = 'temp-hero'

type ManifestEntry = { file: string; use: string; alt: string; credit: string; sourceUrl: string }
const manifest: ManifestEntry[] = JSON.parse(
  fs.readFileSync(path.resolve('seed/images/manifest.json'), 'utf8'),
)

const verticals = [
  {
    slug: 'manpower',
    name: 'Manpower',
    title: 'Manpower & Workforce Solutions',
    heroHeadline: 'The right workforce, at home and overseas',
    summary:
      'We recruit and deploy skilled, semi-skilled and professional staff for projects at home and overseas, and handle the paperwork that comes with it.',
  },
  {
    slug: 'education-training',
    name: 'Education & Training',
    title: 'Education & Training',
    heroHeadline: 'Training that leads to job-ready skills',
    summary:
      'We design and deliver training that leads to job-ready skills, from technical trades to corporate leadership, and guide students toward study opportunities.',
  },
  {
    slug: 'oil-gas',
    name: 'Oil & Gas',
    title: 'Oil & Gas Services',
    heroHeadline: 'Specialist people and support across the asset lifecycle',
    summary:
      'We support upstream, midstream and downstream operators with specialist people, technical consulting and project support across the asset lifecycle.',
  },
  {
    slug: 'green-energy',
    name: 'Green Energy',
    title: 'Green Energy Consulting',
    heroHeadline: 'Renewable projects that cut costs and emissions',
    summary:
      'We help businesses and developers plan, build and run renewable energy projects that cut costs and emissions.',
  },
  {
    slug: 'global-business',
    name: 'Global Business',
    title: 'Global Business Advisory',
    heroHeadline: 'Enter new markets with fewer surprises',
    summary:
      'We help companies enter new markets, find the right partners and set up operations abroad with fewer surprises.',
  },
] as const

async function clean() {
  await payload.delete({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    context: context(),
  })
  await payload.delete({
    collection: 'verticals',
    where: { order: { greater_than: 0 } },
    context: context(),
  })
  await payload.delete({
    collection: 'media',
    where: { credit: { contains: TAG } },
    context: context(),
  })
  payload.logger.info('TEMP cleaned')
}

if (process.argv.includes('clean')) {
  await clean()
  process.exit(0)
}

await clean()
const upload = async (use: string) => {
  const entry = manifest.find((m) => m.use === use)!
  const doc = await payload.create({
    collection: 'media',
    data: { alt: entry.alt, credit: `${entry.credit} [${TAG}]`, sourceUrl: entry.sourceUrl },
    filePath: path.resolve('seed/images', entry.file),
    context: context(),
  })
  return doc
}

const heroImage = await upload('hero-intro')
for (const [i, v] of verticals.entries()) {
  const image = await upload(`vertical:${v.slug}`)
  await payload.create({
    collection: 'verticals',
    data: {
      ...v,
      order: i + 1,
      copyStatus: 'draft-needs-review',
      heroImage: image.id,
      services: [{ name: 'Placeholder service', summary: 'Placeholder' }],
      _status: 'published',
    },
    context: context(),
  })
}
await payload.create({
  collection: 'pages',
  data: {
    title: 'Home',
    slug: 'home',
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        label: 'TRBD Consulting Group',
        title: 'People, skills, energy and markets under one roof',
        ctaLabel: 'Explore our verticals',
        backgroundImage: heroImage.id,
      },
    ],
  },
  context: context(),
})
payload.logger.info('TEMP created')
process.exit(0)
