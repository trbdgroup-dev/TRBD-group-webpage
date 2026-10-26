import type { SiteSetting, Vertical } from '@/payload-types'

// schema.org structured data (spec §6). Only facts the firm has entered are
// included: empty fields are left out, and there are no ratings, client
// counts or service areas.

type Json = Record<string, unknown>

const absolute = (siteUrl: string, path: string) => `${siteUrl.replace(/\/$/, '')}${path}`
const orgId = (siteUrl: string) => absolute(siteUrl, '/#organization')

const compact = (obj: Json): Json =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0),
    ),
  )

export function organizationJsonLd(settings: SiteSetting, siteUrl: string): Json {
  const logo = settings.logo && typeof settings.logo === 'object' ? settings.logo.url : null
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId(siteUrl),
    name: settings.companyName,
    legalName: settings.legalName,
    url: absolute(siteUrl, '/'),
    logo,
    email: settings.contactEmail,
    telephone: settings.phone,
    address: settings.officeAddress?.replace(/\s*\n\s*/g, ', '),
    sameAs: (settings.socialLinks ?? []).map((link) => link.url),
  })
}

export function websiteJsonLd(settings: SiteSetting, siteUrl: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.companyName,
    url: absolute(siteUrl, '/'),
    publisher: { '@id': orgId(siteUrl) },
  }
}

export function serviceJsonLd(vertical: Vertical, siteUrl: string): Json {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: vertical.title,
    serviceType: vertical.name,
    description: vertical.summary,
    url: absolute(siteUrl, `/${vertical.slug}`),
    provider: { '@id': orgId(siteUrl) },
    hasOfferCatalog: (vertical.services ?? []).length
      ? {
          '@type': 'OfferCatalog',
          name: `${vertical.name} services`,
          itemListElement: (vertical.services ?? []).map((service) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: service.name, description: service.summary },
          })),
        }
      : undefined,
  })
}

export function breadcrumbJsonLd(items: { name: string; path: string }[], siteUrl: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(siteUrl, item.path),
    })),
  }
}

export function faqJsonLd(faqs: { question: string; answer: string }[]): Json | null {
  if (faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

/** JSON for a <script type="application/ld+json">, safe against "</script>" in CMS text. */
export function serializeJsonLd(data: Json | Json[]): string {
  return JSON.stringify(data).replace(UNSAFE_IN_SCRIPT, toUnicodeEscape)
}

// "<", ">", "&" and the U+2028/U+2029 line separators, written as unicode
// escapes (valid JSON, inert in HTML). Built from char codes so no literal
// separator characters appear in this file.
const UNSAFE_IN_SCRIPT = new RegExp(`[<>&${String.fromCharCode(0x2028, 0x2029)}]`, 'g')
const toUnicodeEscape = (char: string) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
