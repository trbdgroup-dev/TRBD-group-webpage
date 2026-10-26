import { describe, expect, it } from 'vitest'

import {
  buildMetadata,
  generatedOgPath,
  HOME_TITLE,
  ogImageFrom,
  truncate,
} from '@/lib/seo/metadata'
import type { Media } from '@/payload-types'

const media = (over: Partial<Media> = {}): Media =>
  ({
    id: 1,
    alt: 'Solar panels',
    url: 'https://cdn.test/solar.jpg',
    width: 2400,
    height: 1600,
    updatedAt: '',
    createdAt: '',
    sizes: { og: { url: 'https://cdn.test/solar-1200x630.jpg', width: 1200, height: 630 } },
    ...over,
  }) as Media

describe('truncate', () => {
  it('leaves short text alone and collapses whitespace', () => {
    expect(truncate('  Hello   world ')).toBe('Hello world')
  })

  it('cuts long text at a word boundary with an ellipsis', () => {
    const long = 'word '.repeat(60)
    const out = truncate(long, 50)
    expect(out.length).toBeLessThanOrEqual(50)
    expect(out.endsWith('…')).toBe(true)
    expect(out).not.toMatch(/\s…$/)
  })
})

describe('ogImageFrom', () => {
  it('prefers the 1200×630 crop', () => {
    expect(ogImageFrom(media())).toEqual({
      url: 'https://cdn.test/solar-1200x630.jpg',
      width: 1200,
      height: 630,
      alt: 'Solar panels',
    })
  })

  it('falls back to the original, and to null for unpopulated uploads', () => {
    expect(ogImageFrom(media({ sizes: {} }))?.url).toBe('https://cdn.test/solar.jpg')
    expect(ogImageFrom(5)).toBeNull()
    expect(ogImageFrom(null)).toBeNull()
  })
})

describe('buildMetadata', () => {
  it('uses the fixed home title without the suffix', () => {
    const meta = buildMetadata({ path: '/', title: 'Home', isHome: true })
    expect(meta.title).toEqual({ absolute: HOME_TITLE })
    expect(meta.alternates?.canonical).toBe('/')
  })

  it('falls back to the document title, summary and hero image', () => {
    const meta = buildMetadata({
      path: '/green-energy',
      title: 'Green Energy Consulting',
      fallbackDescription: 'We help businesses plan, build and run renewable projects.',
      fallbackImage: media(),
    })
    expect(meta.title).toBe('Green Energy Consulting')
    expect(meta.description).toBe('We help businesses plan, build and run renewable projects.')
    expect(meta.openGraph?.title).toBe('Green Energy Consulting | TRBD Consulting Group')
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: 'https://cdn.test/solar-1200x630.jpg' }),
    ])
    expect(meta.robots).toBeUndefined()
  })

  it('prefers the SEO fields when an editor fills them in', () => {
    const meta = buildMetadata({
      path: '/oil-gas',
      title: 'Oil & Gas Services',
      fallbackDescription: 'Summary',
      fallbackImage: media({ id: 1 }),
      seo: {
        metaTitle: 'Oil and gas manpower and inspection',
        metaDescription: 'Custom description',
        ogImage: media({ id: 2, sizes: {}, url: 'https://cdn.test/custom.jpg' }),
      },
    })
    expect(meta.title).toBe('Oil and gas manpower and inspection')
    expect(meta.description).toBe('Custom description')
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: 'https://cdn.test/custom.jpg' }),
    ])
  })

  it('uses the site default image, then a generated one', () => {
    const withDefault = buildMetadata({
      path: '/privacy',
      title: 'Privacy notice',
      defaultImage: media(),
    })
    expect(withDefault.openGraph?.images).toEqual([
      expect.objectContaining({ url: 'https://cdn.test/solar-1200x630.jpg' }),
    ])
    const generated = buildMetadata({ path: '/privacy', title: 'Privacy notice' })
    expect(generated.openGraph?.images).toEqual([
      expect.objectContaining({ url: generatedOgPath('Privacy notice'), width: 1200, height: 630 }),
    ])
    expect(generatedOgPath('Oil & Gas')).toBe('/og?title=Oil+%26+Gas')
  })

  it('hides a page from search engines when asked, but still lets them follow links', () => {
    const meta = buildMetadata({ path: '/x', title: 'X', seo: { noIndex: true } })
    expect(meta.robots).toEqual({ index: false, follow: true })
  })

  it('omits the description when there is nothing to use', () => {
    expect(buildMetadata({ path: '/x', title: 'X' }).description).toBeUndefined()
  })
})
