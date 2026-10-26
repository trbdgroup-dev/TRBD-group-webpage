import { expect, test } from '@playwright/test'

import { previewContext, VERTICALS } from './helpers'

test.describe('pages render', () => {
  test('home shows the approved sections in order', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText('People, skills, energy and markets under one roof')
    const headings = await page.locator('main section h2').allTextContents()
    const sections = [
      'One partner, one point of accountability.',
      'Five verticals, connected by one team.',
      'From first brief to long-term support',
      'What clients get from working with us',
      'Tell us what you need',
    ]
    const positions = sections.map((text) => headings.indexOf(text))
    expect(positions.every((i) => i >= 0)).toBe(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
  })

  for (const vertical of VERTICALS) {
    test(`${vertical.slug} renders with its title and email subject`, async ({ page }) => {
      const response = await page.goto(`/${vertical.slug}`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveText(vertical.title)
      const mailto = await page.getByRole('link', { name: 'Email us' }).getAttribute('href')
      expect(decodeURIComponent(mailto ?? '')).toBe(
        `mailto:contact@trbdgroup.com?subject=Enquiry: ${vertical.name}`,
      )
      await expect(
        page.getByRole('navigation', { name: 'Other verticals' }).getByRole('link'),
      ).toHaveCount(4)
    })
  }

  test('privacy notice is published', async ({ page }) => {
    const response = await page.goto('/privacy')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveText('Privacy notice')
    await expect(page.getByRole('heading', { name: 'Your rights' })).toBeVisible()
  })

  test('unknown addresses get the branded 404', async ({ page }) => {
    for (const path of ['/no-such-page', '/home']) {
      const response = await page.goto(path)
      expect(response?.status()).toBe(404)
      await expect(page.locator('h1')).toHaveText('Page not found')
      await expect(page.getByRole('link', { name: 'Back to the home page' })).toBeVisible()
    }
  })
})

test.describe('drafts stay private', () => {
  test('public vertical pages show only the published copy', async ({ page }) => {
    for (const vertical of VERTICALS) {
      await page.goto(`/${vertical.slug}`)
      await expect(page.getByRole('heading', { name: 'From brief to results' })).toHaveCount(0)
      await expect(page.locator('details')).toHaveCount(0)
      await expect(page.getByText('Preview: showing unpublished drafts')).toHaveCount(0)
    }
  })

  test('staff preview shows the draft copy', async ({ browser, baseURL }) => {
    const preview = await previewContext(browser, baseURL!)
    test.skip(!preview, 'needs SEED_ADMIN_* and PREVIEW_SECRET')
    const { context, page } = preview!
    await page.goto('/manpower')
    await expect(page.getByText('Preview: showing unpublished drafts')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'From brief to results' })).toBeVisible()
    expect(await page.locator('details').count()).toBeGreaterThanOrEqual(3)
    await context.close()
  })

  test('preview refuses visitors without a staff session', async ({ request }) => {
    const secret = process.env.PREVIEW_SECRET ?? 'x'.repeat(16)
    const response = await request.get(`/preview?secret=${encodeURIComponent(secret)}&path=/`, {
      maxRedirects: 0,
    })
    expect([401, 403]).toContain(response.status())
  })
})
