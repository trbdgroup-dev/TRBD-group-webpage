import { describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { linkProps, resolveHref } from '@/lib/links'
import { documentPath, previewUrl, safePreviewPath } from '@/lib/preview'
import { affectsLiveSite, targetsFor } from '@/lib/revalidate'

describe('resolveHref', () => {
  it('resolves each link type', () => {
    expect(resolveHref({ type: 'page', page: { slug: 'privacy' } })).toBe('/privacy')
    expect(resolveHref({ type: 'page', page: { slug: 'home' } })).toBe('/')
    expect(resolveHref({ type: 'vertical', vertical: { slug: 'oil-gas' } })).toBe('/oil-gas')
    expect(resolveHref({ type: 'anchor', anchor: 'approach' })).toBe('/#approach')
    expect(resolveHref({ type: 'external', url: 'https://example.com' })).toBe(
      'https://example.com',
    )
  })

  it('returns null for missing or unpopulated targets', () => {
    expect(resolveHref(null)).toBeNull()
    expect(resolveHref({ type: 'page', page: 4 })).toBeNull()
    expect(resolveHref({ type: 'vertical' })).toBeNull()
    expect(resolveHref({ type: 'anchor' })).toBeNull()
    expect(resolveHref({ type: 'external', url: '' })).toBeNull()
  })

  it('opens external links in a new tab only when asked', () => {
    expect(linkProps({ type: 'external', url: 'https://x.test', newTab: true })).toEqual({
      href: 'https://x.test',
      external: true,
      target: '_blank',
      rel: 'noopener noreferrer',
    })
    expect(linkProps({ type: 'anchor', anchor: 'why', newTab: true })).toEqual({
      href: '/#why',
      external: false,
    })
  })
})

describe('revalidation plan', () => {
  it('ignores draft saves but reacts to publish and unpublish', () => {
    expect(affectsLiveSite({ _status: 'draft' }, { _status: 'draft' })).toBe(false)
    expect(affectsLiveSite({ _status: 'draft' }, null)).toBe(false)
    expect(affectsLiveSite({ _status: 'published' }, { _status: 'draft' })).toBe(true)
    expect(affectsLiveSite({ _status: 'draft' }, { _status: 'published' })).toBe(true)
  })

  it('always reacts to collections without drafts (media)', () => {
    expect(affectsLiveSite({}, {})).toBe(true)
  })

  it('refreshes a page, including its old address after a slug change', () => {
    expect(targetsFor('pages', { slug: 'home' })).toEqual([{ path: '/' }, { path: '/sitemap.xml' }])
    expect(targetsFor('pages', { slug: 'about' }, { slug: 'about-us' })).toEqual([
      { path: '/about' },
      { path: '/about-us' },
      { path: '/sitemap.xml' },
    ])
  })

  it('refreshes the whole site for verticals and media', () => {
    const site = [{ path: '/', type: 'layout' }, { path: '/sitemap.xml' }]
    expect(targetsFor('verticals', { slug: 'manpower' })).toEqual(site)
    expect(targetsFor('media', {})).toEqual(site)
  })
})

describe('preview helpers', () => {
  it('accepts same-site paths', () => {
    expect(safePreviewPath('/')).toBe('/')
    expect(safePreviewPath('/oil-gas')).toBe('/oil-gas')
    expect(safePreviewPath('/privacy?x=1#top')).toBe('/privacy?x=1#top')
  })

  it('rejects anything that could leave the site', () => {
    for (const bad of [null, '', 'oil-gas', 'https://evil.test', '//evil.test', '/\\evil.test']) {
      expect(safePreviewPath(bad)).toBeNull()
    }
  })

  it('maps documents to their public paths', () => {
    expect(documentPath('pages', 'home')).toBe('/')
    expect(documentPath('pages', 'privacy')).toBe('/privacy')
    expect(documentPath('verticals', 'green-energy')).toBe('/green-energy')
    expect(documentPath('pages', null)).toBeNull()
    expect(documentPath('media', 'x')).toBeNull()
  })

  it('builds the preview URL', () => {
    expect(previewUrl('http://localhost:3000/', 's3cret', '/oil-gas')).toBe(
      'http://localhost:3000/preview?secret=s3cret&path=%2Foil-gas',
    )
  })
})
