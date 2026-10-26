import { describe, expect, it } from 'vitest'

import { allowIndexing, robotsFor } from '@/lib/seo/indexing'
import {
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  serializeJsonLd,
  serviceJsonLd,
  websiteJsonLd,
} from '@/lib/seo/jsonld'
import type { SiteSetting, Vertical } from '@/payload-types'

const site = 'https://www.trbdgroup.com'
const settings = {
  companyName: 'TRBD Consulting Group',
  legalName: 'TRBD Consulting Group Private Limited',
  contactEmail: 'contact@trbdgroup.com',
  phone: null,
  officeAddress: null,
  logo: null,
  socialLinks: [],
} as unknown as SiteSetting

describe('organizationJsonLd', () => {
  it('includes only filled-in facts', () => {
    const org = organizationJsonLd(settings, site)
    expect(org).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://www.trbdgroup.com/#organization',
      name: 'TRBD Consulting Group',
      legalName: 'TRBD Consulting Group Private Limited',
      url: 'https://www.trbdgroup.com/',
      email: 'contact@trbdgroup.com',
    })
  })

  it('adds phone, a one-line address and social profiles once entered', () => {
    const org = organizationJsonLd(
      {
        ...settings,
        phone: '+91 00000 00000',
        officeAddress: 'Line 1\nCity',
        socialLinks: [{ platform: 'linkedin', url: 'https://linkedin.com/company/x' }],
      } as SiteSetting,
      site,
    )
    expect(org).toMatchObject({
      telephone: '+91 00000 00000',
      address: 'Line 1, City',
      sameAs: ['https://linkedin.com/company/x'],
    })
  })
})

describe('page-level structured data', () => {
  const vertical = {
    name: 'Oil & Gas',
    title: 'Oil & Gas Services',
    slug: 'oil-gas',
    summary: 'Specialist people and project support.',
    services: [{ name: 'Technical manpower', summary: 'Engineers on call.' }],
  } as unknown as Vertical

  it('describes a vertical as a Service provided by the organisation', () => {
    expect(serviceJsonLd(vertical, site)).toMatchObject({
      '@type': 'Service',
      name: 'Oil & Gas Services',
      url: 'https://www.trbdgroup.com/oil-gas',
      provider: { '@id': 'https://www.trbdgroup.com/#organization' },
      hasOfferCatalog: { itemListElement: [{ itemOffered: { name: 'Technical manpower' } }] },
    })
  })

  it('builds breadcrumbs, the website node and FAQs', () => {
    expect(
      breadcrumbJsonLd(
        [
          { name: 'Home', path: '/' },
          { name: 'Oil & Gas', path: '/oil-gas' },
        ],
        site,
      ).itemListElement,
    ).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.trbdgroup.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Oil & Gas',
        item: 'https://www.trbdgroup.com/oil-gas',
      },
    ])
    expect(websiteJsonLd(settings, site)).toMatchObject({
      '@type': 'WebSite',
      url: 'https://www.trbdgroup.com/',
    })
    expect(faqJsonLd([])).toBeNull()
    expect(faqJsonLd([{ question: 'Q?', answer: 'A.' }])).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: [{ name: 'Q?', acceptedAnswer: { text: 'A.' } }],
    })
  })
})

describe('serializeJsonLd', () => {
  it('cannot be broken out of with CMS text', () => {
    const out = serializeJsonLd({ name: '</script><script>alert(1)</script> & co' })
    expect(out).not.toContain('<')
    expect(out).not.toContain('>')
    expect(JSON.parse(out)).toEqual({ name: '</script><script>alert(1)</script> & co' })
  })
})

describe('indexing rules', () => {
  it('only allows indexing on the production deploy', () => {
    expect(allowIndexing({ VERCEL_ENV: 'production' })).toBe(true)
    expect(allowIndexing({ VERCEL_ENV: 'preview' })).toBe(false)
    expect(allowIndexing({})).toBe(false)
  })

  it('blocks everything outside production and lists the sitemap in production', () => {
    expect(robotsFor(site, {})).toEqual({ rules: { userAgent: '*', disallow: '/' } })
    expect(robotsFor(`${site}/`, { VERCEL_ENV: 'production' })).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/cms', '/api/', '/preview', '/og', '/account'],
      },
      sitemap: 'https://www.trbdgroup.com/sitemap.xml',
    })
  })
})
