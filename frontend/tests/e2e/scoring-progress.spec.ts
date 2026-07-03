import { expect, test } from '@playwright/test'

test('scoring progress display shows captured response metrics within 2 seconds', async ({ page }) => {
  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Scoring progress contract</title>
        <style>
          body { font-family: Inter, system-ui, sans-serif; margin: 0; padding: 24px; background: #f7f3eb; color: #1e1917; }
          main { display: grid; gap: 16px; max-width: 960px; }
          .card { border: 1px solid #e7ddd1; border-radius: 24px; background: white; padding: 20px; box-shadow: 0 18px 40px rgba(44, 31, 24, 0.08); }
          .metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
          .metric { border-radius: 18px; background: #fff5ef; padding: 16px; }
          dt { color: #6f625b; font-size: 12px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
          dd { margin: 8px 0 0; font-size: 28px; font-weight: 800; }
          .badge { display: inline-flex; min-height: 44px; align-items: center; border-radius: 999px; background: #dc2626; color: white; padding: 0 16px; font-weight: 900; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <main aria-label="Scoring progress harness">
          <section class="card" aria-label="Room progress">
            <h1>Room progress</h1>
            <p id="status">Waiting for captured response…</p>
            <div class="metrics" aria-live="polite" id="teacher-metrics"></div>
          </section>
          <section class="card" aria-label="My progress">
            <h2>My progress</h2>
            <div class="metrics" aria-live="polite" id="learner-metrics"></div>
          </section>
        </main>
        <script>
          window.__capturedAt = 0;
          setTimeout(() => {
            window.__capturedAt = performance.now();
            document.getElementById('status').innerHTML = '<span class="badge">green captured</span>';
            document.getElementById('teacher-metrics').innerHTML = [
              '<dl class="metric"><dt>CCI</dt><dd>20</dd></dl>',
              '<dl class="metric"><dt>CPD</dt><dd>40</dd></dl>',
              '<dl class="metric"><dt>Reflection</dt><dd>1.2s</dd></dl>',
              '<dl class="metric"><dt>Total CPD</dt><dd>40</dd></dl>'
            ].join('');
            document.getElementById('learner-metrics').innerHTML = [
              '<dl class="metric"><dt>Responses</dt><dd>1</dd></dl>',
              '<dl class="metric"><dt>Green</dt><dd>1</dd></dl>',
              '<dl class="metric"><dt>Highest CPD</dt><dd>40</dd></dl>',
              '<dl class="metric"><dt>Avg reflection</dt><dd>1.2s</dd></dl>'
            ].join('');
          }, 250);
        </script>
      </body>
    </html>
  `)

  const startedAt = Date.now()

  await expect(page.getByText(/green captured/i)).toBeVisible({ timeout: 2000 })
  await expect(page.getByLabel('Room progress')).toContainText('CCI')
  await expect(page.getByLabel('Room progress')).toContainText('CPD')
  await expect(page.getByLabel('Room progress')).toContainText('Reflection')
  await expect(page.getByLabel('My progress')).toContainText('Highest CPD')
  await expect(page.getByLabel('My progress')).toContainText('Avg reflection')

  expect(Date.now() - startedAt).toBeLessThan(2000)
})
