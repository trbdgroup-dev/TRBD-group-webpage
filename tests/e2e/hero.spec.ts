import { expect, test } from '@playwright/test'

import { visibleSlide } from './helpers'

// Hero behaviour from ADR-003: TRBD intro first, slideshow only on request,
// 7 s rotation that pauses, respects reduced motion, and resets from the logo.

const ROTATION_MS = 7000

test.describe('home hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Keep the pointer off the hero so hovering doesn't pause rotation.
    await page.mouse.move(1, 1)
  })

  test('opens on the TRBD intro and does not rotate by itself', async ({ page }) => {
    expect(await visibleSlide(page)).toBeNull()
    await expect(page.getByRole('button', { name: 'Explore our verticals' })).toBeVisible()
    await expect(page.getByRole('button', { name: /slideshow/ })).toBeHidden()
    await page.waitForTimeout(ROTATION_MS + 800)
    expect(await visibleSlide(page)).toBeNull()
  })

  test('all five slides are in the page for search engines, but hidden', async ({ page }) => {
    await expect(page.locator('[aria-roledescription="slide"]')).toHaveCount(5)
    await expect(page.locator('[aria-roledescription="slide"] h2').first()).toBeHidden()
  })

  test('Explore opens Manpower and then advances on its own', async ({ page }) => {
    await page.getByRole('button', { name: 'Explore our verticals' }).click()
    await page.mouse.move(1, 1)
    expect(await visibleSlide(page)).toBe('1 of 5: Manpower')
    await expect(page.getByRole('button', { name: 'Pause slideshow' })).toBeVisible()
    await expect
      .poll(() => visibleSlide(page), { timeout: ROTATION_MS + 3000 })
      .toBe('2 of 5: Education & Training')
  })

  test('a tile opens its vertical', async ({ page }) => {
    await page
      .getByRole('group', { name: 'Choose a vertical' })
      .getByRole('button', { name: 'Oil & Gas' })
      .click()
    expect(await visibleSlide(page)).toBe('3 of 5: Oil & Gas')
    // The same link also appears in the "What we do" rows, so look inside the hero.
    const hero = page.locator('section[aria-roledescription="carousel"]')
    await expect(hero.getByRole('link', { name: 'Learn more about Oil & Gas' })).toHaveAttribute(
      'href',
      '/oil-gas',
    )
  })

  test('pause holds the slide past a full rotation', async ({ page }) => {
    await page.getByRole('button', { name: 'Explore our verticals' }).click()
    await page.getByRole('button', { name: 'Pause slideshow' }).click()
    await page.mouse.move(1, 1)
    await expect(page.getByRole('button', { name: 'Play slideshow' })).toBeVisible()
    await page.waitForTimeout(ROTATION_MS + 800)
    expect(await visibleSlide(page)).toBe('1 of 5: Manpower')
  })

  test('the logo returns to the intro', async ({ page }) => {
    await page.getByRole('button', { name: 'Explore our verticals' }).click()
    expect(await visibleSlide(page)).not.toBeNull()
    await page.getByRole('link', { name: 'TRBD Consulting Group home' }).click()
    expect(await visibleSlide(page)).toBeNull()
    await expect(page.getByRole('button', { name: 'Explore our verticals' })).toBeVisible()
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the slideshow opens but never advances by itself', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explore our verticals' }).click()
    await page.mouse.move(1, 1)
    await page.waitForTimeout(ROTATION_MS + 800)
    expect(await visibleSlide(page)).toBe('1 of 5: Manpower')
  })
})
