import { expect, test } from '@playwright/test'

test('Teacher live room keeps keyboard/audio route stable when room state is unavailable', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  await page.goto('/teacher/room/DEMO01')

  await expect(page.getByText('Live Room Control').first()).toBeVisible()
  await expect(page.getByRole('heading', { name: /room demo01/i })).toBeVisible()

  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('r')
  await page.keyboard.press('s')

  await expect(page.getByText(/live room action failed|loading live room/i)).toBeVisible()
  // T112: after realtime fixes (no bad filters), expect zero realtime subscription errors too
  expect(consoleErrors.filter((error) => error.includes('Supabase realtime subscription error'))).toHaveLength(0)
  expect(consoleErrors).toHaveLength(0)
})
