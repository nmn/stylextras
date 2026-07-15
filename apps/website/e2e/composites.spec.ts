import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/ui')
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible()
})

test('Tabs handles arrows, Home/End, activation, and disabled skipping', async ({ page }) => {
  const account = page.getByRole('tab', { name: 'Account' })
  const security = page.getByRole('tab', { name: 'Security' })
  const billing = page.getByRole('tab', { name: 'Billing' })

  await account.focus()
  await page.keyboard.press('ArrowRight')
  await expect(security).toBeFocused()
  await expect(security).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: 'Security' })).toBeVisible()

  await page.keyboard.press('ArrowRight')
  await expect(account).toBeFocused()
  await expect(billing).toBeDisabled()
  await page.keyboard.press('End')
  await expect(security).toBeFocused()
  await page.keyboard.press('Home')
  await expect(account).toBeFocused()
})

test('Calendar supports its keyboard matrix and bounded selection', async ({ page }) => {
  const calendar = page.getByRole('grid', { name: /July 2026/ }).last()
  const day = (value: string) =>
    calendar.getByRole('gridcell', {
      exact: true,
      name: String(Number(value.slice(-2))),
    })
  const selected = day('2026-07-11')
  await selected.focus()
  await page.keyboard.press('ArrowRight')
  await expect(day('2026-07-12')).toBeFocused()
  await page.keyboard.press(' ')
  await expect(page.getByTestId('calendar-result')).toHaveText('2026-07-12')

  await page.keyboard.press('Home')
  await expect(day('2026-07-12')).toBeFocused()
  await page.keyboard.press('End')
  await expect(day('2026-07-18')).toBeFocused()
  await page.keyboard.press('PageDown')
  await expect(page.getByRole('grid', { name: /August 2026/ })).toBeVisible()
})

test('Toast announces content and can be dismissed', async ({ page }) => {
  await page.getByRole('button', { name: 'Show toast' }).click()
  const toast = page.getByRole('status', { name: '' }).filter({
    hasText: 'Changes saved',
  })
  await expect(toast).toContainText('The project settings were updated.')
  await toast.getByRole('button', { name: 'Dismiss notification' }).click()
  await expect(toast).toBeHidden()
})

test('RTL, reduced motion, forced colors, zoom, and narrow layout remain usable', async ({
  page,
}) => {
  await page.emulateMedia({
    colorScheme: 'dark',
    forcedColors: 'active',
    reducedMotion: 'reduce',
  })
  await page.setViewportSize({ height: 900, width: 360 })
  await page.reload()

  await expect(page.locator('[dir="rtl"]')).toHaveCSS('direction', 'rtl')
  await page.evaluate(() => {
    document.documentElement.style.zoom = '1.5'
  })
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
  await expect(page.getByRole('button', { name: 'Open dialog' })).toBeVisible()
})
