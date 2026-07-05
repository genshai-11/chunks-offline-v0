import { expect, type Page, test } from '@playwright/test'

function productNavigation(page: Page) {
  return page.getByRole('navigation', { name: /primary|side navigation/i })
}

test('Learner room route renders isolated join shell and display-name form', async ({ page }) => {
  await page.goto('/room/DEMO01')

  const nav = productNavigation(page)
  await expect(nav).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Dashboard' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Learner' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Create Room' })).toHaveCount(0)
  await expect(nav.getByRole('link', { name: 'Live Room' })).toHaveCount(0)
  await expect(nav.getByRole('link', { name: 'Library' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: /join room demo01|learner room/i })).toBeVisible()
  await expect(page.getByLabel(/display name/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /join room/i })).toBeDisabled()
})
