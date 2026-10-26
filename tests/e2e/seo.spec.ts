import { expect, test } from '@playwright/test'

import { VERTICALS } from './helpers'

// What search engines and link previews see. Runs once (desktop project).
test.skip(({ isMobile }) => isMobile, 'SEO output does not depend on the viewport')

const jsonLdTypes = async (page: import('@playwright/test').Page) =>
  (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap((text) => {
    const data = JSON.parse(text)
    return (Array.isArray(data) ? data : [data]).map((d: { '@type': string }) => d['@type'])
  })

test('home metadata and structured data', async ({ page, baseURL }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/^TRBD Consulting Group: Manpower, Training/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', baseURL!)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /1200x630/)
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  )
  expect(await jsonLdTypes(page)).toEqual(expect.arrayContaining(['Organization', 'WebSite']))
})

test('vertical metadata and structured data', async ({ page, baseURL }) => {
  await page.goto('/oil-gas')
  await expect(page).toHaveTitle('Oil & Gas Services | TRBD Consulting Group')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /^We support upstream/,
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${baseURL}/oil-gas`)
  expect(await jsonLdTypes(page)).toEqual(
    expect.arrayContaining(['Organization', 'Service', 'BreadcrumbList']),
  )
})

test('a page without a photo gets the generated preview image', async ({ page, request }) => {
  await page.goto('/privacy')
  const image = await page.locator('meta[property="og:image"]').getAttribute('content')
  expect(image).toMatch(/\/og\?title=Privacy\+notice$/)
  const response = await request.get(image!)
  expect(response.headers()['content-type']).toBe('image/png')
  const png = await response.body()
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630])
})

test('sitemap lists every published page and vertical', async ({ request, baseURL }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const path of ['/', '/privacy', ...VERTICALS.map((v) => `/${v.slug}`)]) {
    expect(xml).toContain(`<loc>${baseURL}${path}</loc>`)
  }
})

test('outside production, robots and headers keep search engines out', async ({ request }) => {
  test.skip(process.env.VERCEL_ENV === 'production', 'production allows indexing')
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toMatch(/Disallow: \/\s*$/m)
  const home = await request.get('/')
  expect(home.headers()['x-robots-tag']).toBe('noindex, nofollow')
})

test('404 pages are not indexed', async ({ request }) => {
  // What crawlers receive: the raw HTML (after hydration Next.js keeps its own
  // plain "noindex" tag instead of ours; both forbid indexing).
  const response = await request.get('/no-such-page')
  expect(response.status()).toBe(404)
  expect(await response.text()).toMatch(/<meta name="robots" content="noindex[^"]*"/)
})
