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

// Minimal Lexical builders for rich text fields.
const text = (t: string) => ({
  type: 'text',
  text: t,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})
const base = { direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 }
const para = (t: string) => ({
  ...base,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: [text(t)],
})
const heading = (t: string) => ({ ...base, type: 'heading', tag: 'h2', children: [text(t)] })
const bullets = (items: string[]) => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((t, i) => ({ ...base, type: 'listitem', value: i + 1, children: [text(t)] })),
})
const richText = (...children: object[]) => ({ root: { ...base, type: 'root', children } }) as never

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
      {
        blockType: 'sectionIntro',
        anchor: 'about',
        label: 'Who we are',
        heading: 'One partner, one point of accountability.',
        text: 'TRBD Consulting Group Private Limited helps organisations hire the right workforce, build their skills, run energy projects, move to cleaner power and grow across borders. A single account lead coordinates every part of your project, so you work with one team instead of several vendors.',
      },
      {
        blockType: 'verticalsList',
        anchor: 'verticals',
        label: 'What we do',
        heading: 'Five verticals, connected by one team.',
        intro:
          'Our verticals often work together. A new energy project may need skilled crews, safety training and market-entry support at the same time, and we can deliver all three.',
      },
      {
        blockType: 'approachStages',
        anchor: 'approach',
        label: 'How we work',
        heading: 'From first brief to long-term support',
        intro:
          'Every engagement follows the same four stages, whether we are filling fifty positions or opening a new market.',
        stages: [
          {
            title: 'Understand',
            text: 'We study your goals, site conditions, compliance needs and timelines before proposing anything.',
          },
          {
            title: 'Plan',
            text: 'You get a clear scope, schedule and cost, with named owners for each deliverable.',
          },
          {
            title: 'Deliver',
            text: 'Our team mobilises people, programmes or projects and reports progress against the plan.',
          },
          {
            title: 'Sustain',
            text: 'We stay on for follow-up, audits, retraining and replacement so results hold over time.',
          },
        ],
      },
      {
        blockType: 'whyPoints',
        anchor: 'why',
        label: 'Why TRBD',
        heading: 'What clients get from working with us',
        intro:
          'We are built for organisations that need several kinds of support and would rather not manage several vendors.',
        points: [
          {
            title: 'One point of contact',
            icon: 'user-round',
            text: 'A single account lead coordinates every vertical involved in your project.',
          },
          {
            title: 'Compliance first',
            icon: 'shield-check',
            text: 'Documentation, certifications, visas and safety standards are checked before work begins.',
          },
          {
            title: 'Sector knowledge',
            icon: 'briefcase',
            text: 'Our consultants come from the industries they advise, from rigs to classrooms to boardrooms.',
          },
          {
            title: 'Scalable teams',
            icon: 'chart-column',
            text: 'We staff a short assignment or a multi-year programme with the same process.',
          },
          {
            title: 'Cross-border reach',
            icon: 'globe',
            text: 'We help clients source talent, partners and opportunities across countries and regions.',
          },
          {
            title: 'Transparent reporting',
            icon: 'file-text',
            text: 'Regular progress reports show what has been done, what is next and what it costs.',
          },
        ],
      },
      {
        blockType: 'contact',
        anchor: 'contact',
        label: 'Contact',
        heading: 'Tell us what you need',
        text: 'Email us a few details about your requirement and our team will get back to you within two working days.',
        buttonLabel: 'Email us',
      },
    ],
  },
  context: context(),
})
await payload.create({
  collection: 'pages',
  data: {
    title: 'Privacy notice',
    slug: 'privacy',
    _status: 'published',
    layout: [
      {
        blockType: 'richText',
        body: richText(
          para(
            'Draft – needs review. This notice explains how TRBD Consulting Group Private Limited handles personal data on this website.',
          ),
          heading('What we collect'),
          para(
            'This website does not ask you for personal data. There are no forms, accounts or sign-ups at this stage.',
          ),
          para(
            'If you email us, we receive the details you choose to send, such as your name, email address and your requirement, and use them only to reply to you.',
          ),
          heading('Analytics and cookies'),
          para(
            'We measure visits with privacy-friendly analytics that do not use cookies or identify you. The site sets no tracking cookies.',
          ),
          heading('Your rights'),
          bullets([
            'Ask what personal data we hold about you.',
            'Ask us to correct or delete it.',
            'Withdraw consent for anything you previously agreed to.',
          ]),
          para('To exercise these rights, email contact@trbdgroup.com.'),
        ),
      },
    ],
  },
  context: context(),
})
const sampleImage = await upload('spare')
await payload.create({
  collection: 'pages',
  data: {
    title: 'Sample blocks (temporary)',
    slug: 'sample-blocks',
    _status: 'published',
    layout: [
      {
        blockType: 'imageText',
        image: sampleImage.id,
        imageSide: 'right',
        label: 'Sample',
        heading: 'Image and text block',
        body: richText(
          para('Sample paragraph for checking the layout.'),
          bullets(['Sample point one', 'Sample point two']),
        ),
      },
      {
        blockType: 'stats',
        label: 'Sample figures – not real data',
        items: [
          { value: '00', label: 'Sample figure A' },
          { value: '00', label: 'Sample figure B' },
          { value: '00', label: 'Sample figure C' },
          { value: '00', label: 'Sample figure D' },
        ],
      },
      {
        blockType: 'testimonials',
        label: 'Sample',
        heading: 'Testimonials block',
        items: [
          {
            quote: 'Sample quote for checking the layout.',
            name: 'Sample Name',
            role: 'Role',
            company: 'Company',
          },
          {
            quote:
              'A second sample quote, a little longer, to check how the cards line up side by side.',
            name: 'Sample Name',
          },
        ],
      },
    ],
  },
  context: context(),
})
payload.logger.info('TEMP created')
process.exit(0)
