import { expect, test } from '@playwright/test'

const politeToastAnnouncer =
  '[role="status"][aria-live="polite"]:has(+ [role="alert"][aria-live="assertive"] + ol[role="list"])'
const assertiveToastAnnouncer =
  '[role="alert"][aria-live="assertive"]:has(+ ol[role="list"])'
const toastAnnouncers = `${politeToastAnnouncer}, ${assertiveToastAnnouncer}`

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
  await expect(panel).toHaveAttribute('tabindex', '-1')
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
  await start.focus()
  await page.keyboard.press('ArrowRight')
  await expect(center).toBeFocused()

  const formatting = page.getByRole('toolbar', { name: 'Harness formatting' })
  const bold = formatting.getByRole('button', { name: 'Bold' })
  const italic = formatting.getByRole('button', { name: 'Italic' })
  await bold.focus()
  await page.keyboard.press('ArrowRight')
  await expect(italic).toBeFocused()
})

test('Focusgroup survives external detach and reinsertion without duplicate navigation', async ({
  page,
}) => {
  const toolbar = page.getByRole('toolbar', { name: 'Harness toolbar' })
  await toolbar.evaluate(
    (node) =>
      new Promise<void>((resolve) => {
        const parent = node.parentElement
        if (!parent) throw new Error('Toolbar parent is missing')
        node.remove()
        parent.append(node)
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      }),
  )

  const items = toolbar.getByRole('button')
  await expect(items).toHaveCount(3)
  await items.nth(0).focus()
  await page.keyboard.press('ArrowRight')
  await expect(items.nth(1)).toBeFocused()
})

test('Calendar supports its keyboard matrix and bounded selection', async ({ page }) => {
  const calendarRoot = page.getByTestId('bounded-calendar')
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
  await page.keyboard.press('ArrowLeft')
  await expect(day('2026-07-11')).toBeFocused()
  await page.keyboard.press('ArrowUp')
  await expect(day('2026-07-04')).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(day('2026-07-11')).toBeFocused()

  await calendarRoot.evaluate((node) => node.setAttribute('dir', 'rtl'))
  await page.keyboard.press('ArrowRight')
  await expect(day('2026-07-10')).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(day('2026-07-11')).toBeFocused()
  await calendarRoot.evaluate((node) => node.removeAttribute('dir'))

  await page.keyboard.press('ArrowRight')
  await page.keyboard.press(' ')
  await expect(page.getByTestId('calendar-result')).toHaveText('2026-07-12')

  await page.keyboard.press('Home')
  await expect(day('2026-07-12')).toBeFocused()
  await page.keyboard.press('End')
  await expect(day('2026-07-18')).toBeFocused()
  await page.keyboard.press('PageDown')
  await expect(day('2026-08-18')).toBeFocused()
  await page.keyboard.press('PageUp')
  await expect(day('2026-07-18')).toBeFocused()
  await page.keyboard.press('Shift+PageDown')
  await expect(day('2026-08-20')).toBeFocused()
  await page.keyboard.press('Shift+PageUp')
  await expect(day('2026-07-01')).toBeFocused()

  await page.getByTestId('shift-calendar-bounds').click()
  await expect(calendarRoot.getByRole('grid', { name: /September 2026/ })).toBeVisible()
  await expect(day('2026-09-10')).toHaveAttribute('tabindex', '0')
  await expect(calendarRoot.locator('button[tabindex="0"]')).toHaveCount(1)
  await expect(calendarRoot.locator('button:disabled[tabindex="0"]')).toHaveCount(0)

  await page.getByRole('button', { name: 'Restore calendar bounds' }).click()
  await expect(calendarRoot.locator('button[tabindex="0"]')).toHaveCount(1)
  await page.getByRole('button', { name: 'Use malformed calendar bounds' }).click()
  await expect(calendarRoot.locator('button[tabindex="0"]')).toHaveCount(1)
  await expect(calendarRoot.locator('button:disabled[tabindex="0"]')).toHaveCount(0)

  const invalidRangeWarning = page.waitForEvent(
    'console',
    (message) =>
      message.type() === 'warning' && message.text().includes('Both bounds were ignored'),
  )
  await page.getByRole('button', { name: 'Reverse calendar bounds' }).click()
  await invalidRangeWarning
  await expect(calendarRoot.locator('button[tabindex="0"]')).toHaveCount(1)
  await expect(calendarRoot.locator('button:disabled[tabindex="0"]')).toHaveCount(0)
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
  await toast.getByRole('button', { name: 'Dismiss Changes saved' }).click()
  await expect(toast).toBeHidden()
})

test('Toast announces every batched record without cloning rich visual content', async ({ page }) => {
  await page.getByRole('button', { name: 'Show toast batch' }).click()
  const announcement = page.locator(politeToastAnnouncer)
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

test('Toast exposes and announces only the reachable FIFO window', async ({ page }) => {
  await page.getByRole('button', { name: 'Show queued toasts' }).click()
  const notifications = page.getByRole('list', { name: 'Notifications' })
  await expect(notifications.getByRole('listitem')).toHaveCount(3)
  await expect(notifications).toContainText('First queued notification')
  await expect(notifications).toContainText('Third queued notification')
  await expect(notifications).not.toContainText('Fourth queued notification')

  const announcement = page.locator(politeToastAnnouncer)
  await expect(announcement).toContainText('First queued notification')
  await expect(announcement).not.toContainText('Fourth queued notification')

  await notifications
    .getByRole('button', { name: 'Dismiss First queued notification' })
    .click()
  await expect(notifications).toContainText('Fourth queued notification')
  await expect(announcement).toContainText('Fourth queued notification')
  await expect(
    notifications.getByRole('button', { name: 'Dismiss Fourth queued notification' }),
  ).toBeVisible()
})

test('Toast live regions deliver one message, clear buffers, and fail over to one document owner', async ({
  page,
}) => {
  const polite = page.locator(politeToastAnnouncer)
  const assertive = page.locator(assertiveToastAnnouncer)
  await expect(polite).toHaveCount(1)
  await expect(assertive).toHaveCount(1)

  await polite.evaluate((node) => {
    const state = { messages: [] as string[] }
    ;(window as typeof window & { __toastMutationState?: typeof state }).__toastMutationState =
      state
    new MutationObserver(() => {
      const text = node.textContent?.trim() ?? ''
      if (text && state.messages.at(-1) !== text) state.messages.push(text)
    }).observe(node, { childList: true, subtree: true })
  })
  await page.getByRole('button', { name: 'Show toast', exact: true }).click()
  await expect(polite).toHaveText('Changes saved The project settings were updated.')
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & {
            __toastMutationState?: { messages: string[] }
          }).__toastMutationState?.messages ?? [],
      ),
    )
    .toEqual(['Changes saved The project settings were updated.'])
  await expect(polite).toHaveText('', { timeout: 2_000 })

  await page.getByRole('button', { name: 'Mount secondary toaster' }).click()
  await expect(page.getByRole('list', { name: 'Secondary notifications' })).toBeVisible()
  await expect(page.locator(toastAnnouncers)).toHaveCount(2)
  await page.getByRole('button', { name: 'Unmount primary toaster' }).click()
  await expect(page.getByRole('list', { name: 'Notifications', exact: true })).toHaveCount(0)
  await expect(page.locator(toastAnnouncers)).toHaveCount(2)

  await page.getByRole('button', { name: 'Show urgent toast' }).click()
  await expect(page.locator(assertiveToastAnnouncer)).toHaveText('Connection lost')
  const urgentToast = page
    .getByRole('list', { name: 'Secondary notifications' })
    .getByRole('listitem')
    .filter({ hasText: 'Connection lost' })
  await expect(urgentToast.getByRole('button', { name: 'Dismiss notification' })).toBeVisible()
  await expect(page.locator(assertiveToastAnnouncer)).toHaveText('', {
    timeout: 2_000,
  })
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
  await expect(dialogTrigger).toBeFocused()

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
