import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { expectNoHorizontalScroll, KEY_PAGES } from './helpers'

// Layout and accessibility, run at both project sizes (1280px and 375px).

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

for (const path of [...KEY_PAGES, '/no-such-page']) {
  test(`${path}: no serious accessibility issues and no sideways scroll`, async ({ page }) => {
    await page.goto(path)
    await expectNoHorizontalScroll(page)
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
    const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(
      serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
    ).toEqual([])
  })
}

test('hero slideshow state has no serious accessibility issues', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Explore our verticals' }).click()
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([])
})

test('first Tab reaches the skip link, which moves focus to the content', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'keyboard navigation is a desktop concern')
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main#main')).toBeFocused()
})

test('header links collapse to the Contact button on phones', async ({ page, isMobile }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Main' })
  await expect(nav.getByRole('link', { name: 'Contact us' })).toBeVisible()
  if (isMobile) {
    await expect(nav.getByRole('link', { name: 'How we work' })).toBeHidden()
  } else {
    await expect(nav.getByRole('link', { name: 'How we work' })).toBeVisible()
  }
})

test('the hero tiles swipe sideways on phones and form a grid on desktop', async ({
  page,
  isMobile,
}) => {
  await page.goto('/')
  const row = page.getByRole('group', { name: 'Choose a vertical' })
  const layout = await row.evaluate((el) => ({
    display: getComputedStyle(el).display,
    scrolls: el.scrollWidth > el.clientWidth,
  }))
  expect(layout).toEqual(
    isMobile ? { display: 'flex', scrolls: true } : { display: 'grid', scrolls: false },
  )
})
