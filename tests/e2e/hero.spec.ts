import { expect, test } from '@playwright/test'

import { visibleSlide } from './helpers'

// Hero behaviour from ADR-003: TRBD intro first; the Explore button fills over
// 6 s and then the slideshow starts by itself (once); 7 s rotation in which the
// next tile fills in; pauses, respects reduced motion, and resets from the logo.

const INTRO_MS = 6000
const ROTATION_MS = 7000

const tileFade = (page: import('@playwright/test').Page, state: 'faded' | 'filling') =>
  page.locator(`[data-tile-fade="${state}"]`)

test.describe('home hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Keep the pointer off the hero so hovering doesn't pause rotation.
    await page.mouse.move(1, 1)
  })

  test('opens on the TRBD intro with every tile faded', async ({ page }) => {
    expect(await visibleSlide(page)).toBeNull()
    await expect(page.getByRole('button', { name: 'Explore our verticals' })).toBeVisible()
    await expect(tileFade(page, 'faded')).toHaveCount(5)
    await expect(tileFade(page, 'filling')).toHaveCount(0)
  })

  test('the Explore button fills, then the slideshow starts by itself', async ({ page }) => {
    await page.waitForTimeout(INTRO_MS / 2)
    expect(await visibleSlide(page)).toBeNull()
    await expect
      .poll(() => visibleSlide(page), { timeout: INTRO_MS + 3000 })
      .toBe('1 of 5: Manpower')
  })

  test('pausing during the intro holds it', async ({ page }) => {
    await page.getByRole('button', { name: 'Pause slideshow' }).click()
    await page.mouse.move(1, 1)
    await expect(page.getByRole('button', { name: 'Play slideshow' })).toBeVisible()
    await page.waitForTimeout(INTRO_MS + 800)
    expect(await visibleSlide(page)).toBeNull()
  })

  test('all five slides are in the page for search engines, but hidden', async ({ page }) => {
    await expect(page.locator('[aria-roledescription="slide"]')).toHaveCount(5)
    await expect(page.locator('[aria-roledescription="slide"] h2').first()).toBeHidden()
  })

  test('Explore opens Manpower; the next tile fills in and then its slide shows', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Explore our verticals' }).click()
    await page.mouse.move(1, 1)
    expect(await visibleSlide(page)).toBe('1 of 5: Manpower')
    await expect(page.getByRole('button', { name: 'Pause slideshow' })).toBeVisible()
    const tiles = page.getByRole('group', { name: 'Choose a vertical' })
    // The current tile is clear, the next one is filling, the other three stay faded.
    await expect(
      tiles.getByRole('button', { name: 'Manpower' }).locator('[data-tile-fade]'),
    ).toHaveCount(0)
    await expect(
      tiles
        .getByRole('button', { name: 'Education & Training' })
        .locator('[data-tile-fade="filling"]'),
    ).toHaveCount(1)
    await expect(tileFade(page, 'faded')).toHaveCount(3)
    await expect
      .poll(() => visibleSlide(page), { timeout: ROTATION_MS + 3000 })
      .toBe('2 of 5: Education & Training')
    await expect(
      tiles.getByRole('button', { name: 'Oil & Gas' }).locator('[data-tile-fade="filling"]'),
    ).toHaveCount(1)
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

  test('the logo returns to the intro, which then waits for the visitor', async ({ page }) => {
    await page.getByRole('button', { name: 'Explore our verticals' }).click()
    expect(await visibleSlide(page)).not.toBeNull()
    await page.getByRole('link', { name: 'TRBD Consulting Group home' }).click()
    await page.mouse.move(1, 1)
    expect(await visibleSlide(page)).toBeNull()
    await expect(page.getByRole('button', { name: 'Explore our verticals' })).toBeVisible()
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
    await page.waitForTimeout(INTRO_MS + 800)
    expect(await visibleSlide(page)).toBeNull()
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the intro never starts the slideshow by itself', async ({ page }) => {
    await page.goto('/')
    await page.mouse.move(1, 1)
    await expect(page.getByRole('button', { name: /slideshow/ })).toBeHidden()
    await page.waitForTimeout(INTRO_MS + 800)
    expect(await visibleSlide(page)).toBeNull()
  })

  test('the slideshow opens but never advances by itself', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Explore our verticals' }).click()
    await page.mouse.move(1, 1)
    await expect(tileFade(page, 'filling')).toHaveCount(0)
    await page.waitForTimeout(ROTATION_MS + 800)
    expect(await visibleSlide(page)).toBe('1 of 5: Manpower')
  })
})
