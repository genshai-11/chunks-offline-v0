import { expect, test } from '@playwright/test'

test('app shell navigation renders on home and teacher setup without horizontal overflow', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('navigation', { name: /primary/i })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Teacher' })).toBeVisible()

  const homeOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(homeOverflow).toBe(false)

  await page.getByRole('link', { name: 'Teacher' }).click()
  await expect(page).toHaveURL(/\/teacher\/setup$/)
  await expect(page.getByRole('heading', { name: /create a live room/i })).toBeVisible()
  await expect(page.getByRole('navigation', { name: /primary/i })).toBeVisible()

  const teacherOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(teacherOverflow).toBe(false)
})

test('theme shell keeps Bauhaus canvas white and can switch to Modular and Craft canvases', async ({ page }) => {
  await page.goto('/')
  const background = await page.locator('.theme-shell').evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(background).toBe('rgb(255, 255, 255)')

  await page.getByRole('button', { name: /switch to modular theme/i }).click()
  await expect(page.locator('[data-theme="modular"]')).toBeVisible()
  const modularBackground = await page.locator('.theme-shell').evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(modularBackground).toBe('rgb(10, 11, 15)')

  await page.getByRole('button', { name: /switch to craft theme/i }).click()
  await expect(page.locator('[data-theme="craft"]')).toBeVisible()
  const craftBackground = await page.locator('.theme-shell').evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(craftBackground).toBe('rgb(250, 249, 246)')
})
