import { expect, test } from '@playwright/test'

test('Teacher live room route renders live-control shell and handles unavailable room state', async ({ page }) => {
  await page.goto('/teacher/room/DEMO01')

  await expect(page.getByText('Live Room Control').first()).toBeVisible()
  await expect(page.getByRole('heading', { name: /room demo01/i })).toBeVisible()
  await expect(page.getByText(/keep the sentence window in focus/i)).toBeVisible()
  await expect(page.getByText(/live room action failed|loading live room/i)).toBeVisible()
})
