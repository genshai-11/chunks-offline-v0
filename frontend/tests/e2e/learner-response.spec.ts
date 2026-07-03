import { expect, test } from '@playwright/test'

test('Learner room route renders join shell and display-name form', async ({ page }) => {
  await page.goto('/room/DEMO01')

  await expect(page.getByRole('navigation', { name: /primary/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /join room demo01|learner room/i })).toBeVisible()
  await expect(page.getByLabel(/display name/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /join room/i })).toBeDisabled()
})
