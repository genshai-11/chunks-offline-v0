import { expect, type Page, test } from '@playwright/test'

function productNavigation(page: Page) {
  return page.getByRole('navigation', { name: /primary|side navigation/i })
}

test('app shell navigation renders truthful product areas without horizontal overflow', async ({ page }) => {
  await page.goto('/')

  const nav = productNavigation(page)
  await expect(nav).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Dashboard' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Library' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'History' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Create Room' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Live Room' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Learner' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Teacher' })).toHaveCount(0)

  const homeOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(homeOverflow).toBe(false)

  await nav.getByRole('link', { name: 'Create Room' }).click()
  await expect(page).toHaveURL(/\/teacher\/setup$/)
  await expect(page.getByRole('heading', { name: /create room/i })).toBeVisible()
  await expect(productNavigation(page)).toBeVisible()

  const teacherOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(teacherOverflow).toBe(false)
})

test('theme shell keeps Bauhaus canvas white and can switch to Craft and Calm canvases', async ({ page }) => {
  await page.goto('/')
  const background = await page.locator('.theme-shell').evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(background).toBe('rgb(255, 255, 255)')

  await page.getByRole('button', { name: /switch to craft theme/i }).click()
  await expect(page.locator('[data-theme="craft"]')).toBeVisible()
  const craftBackground = await page.locator('.theme-shell').evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(craftBackground).toBe('rgb(250, 249, 246)')

  await page.getByRole('button', { name: /switch to calm theme/i }).click()
  await expect(page.locator('[data-theme="calm"]')).toBeVisible()
})
