import { type Browser, type Page, expect } from '@playwright/test'

// Shared helpers for the e2e suite. The suite assumes the seeded content
// (`npm run seed`): five verticals with drafts on top, home and privacy pages.

export const VERTICALS = [
  { slug: 'manpower', name: 'Manpower', title: 'Manpower & Workforce Solutions' },
  { slug: 'education-training', name: 'Education & Training', title: 'Education & Training' },
  { slug: 'oil-gas', name: 'Oil & Gas', title: 'Oil & Gas Services' },
  { slug: 'green-energy', name: 'Green Energy', title: 'Green Energy Consulting' },
  { slug: 'global-business', name: 'Global Business', title: 'Global Business Advisory' },
] as const

export const KEY_PAGES = ['/', '/manpower', '/oil-gas', '/privacy'] as const

/** The page never scrolls sideways (only the hero tile row may). */
export async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
}

/** Label of the visible hero slide, e.g. "1 of 5: Manpower", or null on the intro. */
export function visibleSlide(page: Page) {
  return page.evaluate(
    () =>
      [...document.querySelectorAll('[aria-roledescription="slide"]')]
        .find((el) => !(el as HTMLElement).hidden)
        ?.getAttribute('aria-label') ?? null,
  )
}

/**
 * A page context with draft mode enabled for the seeded admin. Returns null when
 * the admin credentials or preview secret aren't available (tests then skip).
 */
export async function previewContext(browser: Browser, baseURL: string) {
  const {
    SEED_ADMIN_EMAIL: email,
    SEED_ADMIN_PASSWORD: password,
    PREVIEW_SECRET: secret,
  } = process.env
  if (!email || !password || !secret) return null

  const context = await browser.newContext({ baseURL })
  const login = await context.request.post('/api/users/login', { data: { email, password } })
  expect(login.ok()).toBe(true)
  const page = await context.newPage()
  await page.goto(`/preview?secret=${encodeURIComponent(secret)}&path=/`)
  return { context, page }
}
