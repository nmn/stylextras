import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/ui')
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible()
})

test('Tabs handles arrows, Home/End, activation, and disabled skipping', async ({ page }) => {
  const account = page.getByRole('tab', { name: 'Account' })
  const security = page.getByRole('tab', { name: 'Security' })
  const billing = page.getByRole('tab', { name: 'Billing' })

  const list = page.getByTestId('managed-tabs-list')
  const panel = page.getByTestId('managed-tabs-content')
  const changeCount = page.getByTestId('tab-change-count')
  await expect(list).toHaveRole('tablist')
  await expect(list).toHaveAttribute('aria-orientation', 'horizontal')
  await expect(account).toHaveAttribute('type', 'button')
  await expect(account).toHaveAttribute('tabindex', '0')
  await expect(account).toHaveAttribute('aria-selected', 'true')
  await expect(account).not.toHaveAttribute('id', 'consumer-tab')
  await expect(panel).toHaveRole('tabpanel')
  await expect(panel).toBeVisible()
  await expect(panel).toHaveAttribute('tabindex', '0')
  await expect(panel).not.toHaveAttribute('id', 'consumer-panel')
  await expect(account).toHaveAttribute('aria-controls', /^stylextras-tabs-panel-/)
  await expect(panel).toHaveAttribute('aria-labelledby', /^stylextras-tabs-trigger-/)
  expect(await account.getAttribute('aria-controls')).toBe(await panel.getAttribute('id'))
  expect(await panel.getAttribute('aria-labelledby')).toBe(await account.getAttribute('id'))

  const disabledSelected = page.getByRole('tab', { name: 'Unavailable' })
  const fallback = page.getByTestId('disabled-selected-fallback')
  await expect(disabledSelected).toBeDisabled()
  await expect(disabledSelected).toHaveAttribute('tabindex', '-1')
  await expect(fallback).toHaveAttribute('tabindex', '0')

  await account.click()
  await expect(changeCount).toHaveText('0')
  await security.click()
  await expect(changeCount).toHaveText('1')
  await account.click()
  await expect(changeCount).toHaveText('2')

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

test('Focusgroup bridges toolbar arrow-key navigation', async ({ page }) => {
  const toolbar = page.getByRole('toolbar', { name: 'Harness toolbar' })
  const start = toolbar.getByRole('button', { name: 'Align start' })
  const center = toolbar.getByRole('button', { name: 'Align center' })
  await expect(start).toHaveAttribute('data-fg-ati')
  await start.focus()
  await page.keyboard.press('ArrowRight')
  await expect(center).toBeFocused()

  const formatting = page.getByRole('toolbar', { name: 'Harness formatting' })
  const bold = formatting.getByRole('button', { name: 'Bold' })
  const italic = formatting.getByRole('button', { name: 'Italic' })
  await expect(bold).toHaveAttribute('data-fg-ati')
  await bold.focus()
  await page.keyboard.press('ArrowRight')
  await expect(italic).toBeFocused()
})

test('Calendar supports its keyboard matrix and bounded selection', async ({ page }) => {
  const calendarRoot = page.getByTestId('bounded-calendar')
  const calendar = calendarRoot.getByRole('grid', { name: /July 2026/ })
  const day = (value: string) => {
    const name = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
      weekday: 'long',
      year: 'numeric',
    }).format(new Date(`${value}T00:00:00Z`))
    return calendarRoot.getByRole('button', { exact: true, name })
  }

  await day('2026-07-31').focus()
  await calendarRoot.getByRole('button', { name: 'Next month' }).click()
  await expect(page.getByRole('grid', { name: /August 2026/ }).last()).toBeVisible()
  await expect(day('2026-08-20')).toHaveAttribute('tabindex', '0')
  await expect(calendarRoot.locator('button[tabindex="0"]')).toHaveCount(1)
  await expect(calendarRoot.getByRole('button', { name: 'Next month' })).toBeDisabled()

  await calendarRoot.getByRole('button', { name: 'Previous month' }).click()
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
  await page.getByRole('button', { name: 'Show toast', exact: true }).click()
  const announcement = page.getByRole('status', { name: '' }).filter({
    hasText: 'Changes saved',
  })
  await expect(announcement).toContainText('The project settings were updated.')
  const toast = page.getByRole('list', { name: 'Notifications' }).getByRole('listitem').filter({
    hasText: 'Changes saved',
  })
  await toast.getByRole('button', { name: 'Dismiss notification' }).click()
  await expect(toast).toBeHidden()
})

test('Toast announces every batched record without cloning rich visual content', async ({ page }) => {
  await page.getByRole('button', { name: 'Show toast batch' }).click()
  const announcement = page.locator('div[role="status"][aria-live="polite"]')
  await expect(announcement).toContainText('First batched notification. Review details.')
  await expect(announcement).toContainText('Second batched notification Queued in the same update.')
  await expect(page.locator('#batch-toast-title')).toHaveCount(1)
  await expect(page.locator('#batch-toast-details')).toHaveCount(1)
  await expect(announcement.locator('a')).toHaveCount(0)

  const visualToast = page
    .getByRole('list', { name: 'Notifications' })
    .getByRole('listitem')
    .filter({ hasText: 'First batched notification' })
  await expect(visualToast).toHaveCSS('display', 'flex')
})

test('RTL, reduced motion, forced colors, zoom, and narrow layout remain usable', async ({
  page,
}) => {
  await page.emulateMedia({
    colorScheme: 'dark',
    forcedColors: 'active',
    reducedMotion: 'reduce',
  })
  await page.setViewportSize({ height: 900, width: 1280 })
  await page.reload()

  await expect(page.locator('[dir="rtl"]')).toHaveCSS('direction', 'rtl')
  const dialogTrigger = page.getByRole('button', { exact: true, name: 'Open dialog' })
  await dialogTrigger.focus()
  const focusIndicator = await dialogTrigger.evaluate((element) => {
    const style = getComputedStyle(element)
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
  })
  expect(focusIndicator.style).not.toBe('none')
  expect(focusIndicator.width).toBeGreaterThanOrEqual(2)

  for (const control of [
    dialogTrigger,
    page.getByRole('switch', { name: 'Notifications' }),
  ]) {
    const box = await control.boundingBox()
    // Browser protocols can expose an exact 24 CSS-pixel layout length as a
    // value a few millionths below 24 (Firefox reports 23.999998 here).
    const cssPixelSerializationTolerance = 0.0001
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(24 - cssPixelSerializationTolerance)
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(24 - cssPixelSerializationTolerance)
  }

  // A 320 CSS-pixel viewport exercises the same reflow width as 400% browser
  // zoom on a 1280-pixel viewport while still allowing responsive media
  // queries to react (CSS `zoom` would scale after layout and create a false
  // two-column overflow).
  await page.setViewportSize({ height: 900, width: 320 })
  const overflow = await page.evaluate(() => {
    const root = document.documentElement
    const width = root.clientWidth
    const offenders = [...document.querySelectorAll<HTMLElement>('body *')]
      .map((element) => ({
        element,
        rect: element.getBoundingClientRect(),
      }))
      .filter(({ rect }) => rect.right > width + 1 || rect.left < -1)
      .sort((left, right) => right.rect.right - left.rect.right)
      .slice(0, 8)
      .map(({ element, rect }) => ({
        className: typeof element.className === 'string' ? element.className : '',
        left: rect.left,
        right: rect.right,
        tag: element.tagName,
        testId: element.dataset.testid,
      }))
    return { amount: root.scrollWidth - width, offenders }
  })
  expect(overflow.amount, JSON.stringify(overflow.offenders)).toBeLessThanOrEqual(1)
  await expect(dialogTrigger).toBeVisible()
})
