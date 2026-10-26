import { describe, expect, it } from 'vitest'

import { pagePath, slugify, validatePageSlug, VERTICAL_SLUGS } from '@/lib/slugs'

describe('validatePageSlug', () => {
  it('accepts simple lowercase slugs, including home', () => {
    expect(validatePageSlug('privacy')).toBe(true)
    expect(validatePageSlug('about-us')).toBe(true)
    expect(validatePageSlug('home')).toBe(true)
    expect(validatePageSlug('stage-2')).toBe(true)
  })

  it('rejects empty or non-string values', () => {
    expect(validatePageSlug('')).toMatch(/Enter an address/)
    expect(validatePageSlug(undefined)).toMatch(/Enter an address/)
  })

  it('rejects badly formed slugs', () => {
    for (const bad of ['About', 'about us', 'about--us', '-about', 'about-', 'a/b', 'café']) {
      expect(validatePageSlug(bad)).toMatch(/lowercase letters/)
    }
  })

  it('rejects reserved app routes and every vertical slug', () => {
    for (const reserved of ['cms', 'api', 'account', 'insights', ...VERTICAL_SLUGS]) {
      expect(validatePageSlug(reserved)).toMatch(/reserved/)
    }
  })
})

describe('slugify', () => {
  it('turns titles into valid slugs', () => {
    expect(slugify('About Us & Team!')).toBe('about-us-team')
    expect(slugify('  Oil & Gas  ')).toBe('oil-gas')
    expect(slugify('Café Résumé')).toBe('cafe-resume')
    expect(validatePageSlug(slugify('Privacy Notice'))).toBe(true)
  })
})

describe('pagePath', () => {
  it('serves home at the root and other pages under their slug', () => {
    expect(pagePath('home')).toBe('/')
    expect(pagePath('privacy')).toBe('/privacy')
  })
})
