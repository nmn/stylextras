import { expect, test } from '@playwright/test'

test('static callouts and primitive toasts do not announce on page load', async ({ page }) => {
  for (const component of ['alert', 'field', 'toast']) {
    await page.goto(`/docs/components/${component}`)
    const preview = page.locator(
      `[data-component-demo="${component === 'toast' ? 'Toast' : component === 'field' ? 'Field' : 'Alert'}"]`,
    )
    await expect(preview).toHaveAttribute('data-preview-ready', 'true')
    const liveRegions = preview.locator(
      '[role="alert"], [role="status"], [aria-live]:not([aria-live="off"])',
    )
    if (component === 'toast') {
      await expect(liveRegions).toHaveCount(2)
      for (const region of await liveRegions.all()) await expect(region).toBeEmpty()
    } else {
      await expect(liveRegions).toHaveCount(0)
    }
  }
})

test('Link and ButtonLink keep native anchors, forwarded refs, and accessible icon names', async ({
  page,
}) => {
  await page.goto('/test/router-links')

  const fixture = page.getByTestId('router-link-fixture')
  await expect(fixture).toHaveAttribute('data-hydrated', 'true')
  for (const testId of ['package-link', 'package-button-link']) {
    const link = page.getByTestId(testId)
    await expect(link).toHaveJSProperty('tagName', 'A')
    await expect(link).toHaveAttribute('href', `#${testId}`)
  }

  await page.goto('/docs/components/button')
  const preview = page.locator('[data-component-demo="Button"]')
  const iconLink = preview.locator('a[href="#button-link-icon"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  await expect(iconLink).toHaveRole('link')
  await expect(iconLink).toHaveAccessibleName('Open linked item')
})

test('CopyToClipboardButton reports success, resets, and clears stale feedback on error', async ({
  page,
}) => {
  await page.goto('/test/docs-migration')
  const fixture = page.getByTestId('copy-error-fixture')
  await expect(fixture).toHaveAttribute('data-hydrated', 'true')
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () => Promise.resolve(),
      },
    })
  })

  const copy = fixture.getByRole('button')
  await copy.click()
  await expect(copy).toHaveAttribute('aria-label', 'Copy error fixture')
  const announcement = fixture.locator('[role="status"][aria-live="polite"]')
  await expect(announcement).toHaveText('Copied to clipboard')
  await expect(fixture.getByTestId('copy-success-output')).toHaveText('copy error value')

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error('Clipboard retry failed')),
      },
    })
  })
  await copy.click()
  await expect(fixture.getByTestId('copy-error-output')).toHaveText('Clipboard retry failed')
  await expect(announcement).toHaveText('Copy failed')
  await expect(copy).toHaveAttribute('aria-label', 'Copy error fixture')
  await expect(copy).toHaveText('Copy')
})

test('TableOfContents exposes nested list structure and active location semantics', async ({
  page,
}) => {
  await page.goto('/docs/components/table-of-contents')

  const preview = page.locator('[data-component-demo="TableOfContents"]')
  const toc = preview.getByRole('navigation', { name: 'On this page' })
  const topLevelList = toc.locator(':scope > ol')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  await expect(toc.getByRole('heading', { name: 'On this page', level: 3 })).toBeVisible()
  await expect(toc.getByRole('link', { name: 'Overview' })).toHaveAttribute(
    'aria-current',
    'location',
  )
  await expect(topLevelList.locator(':scope > li')).toHaveCount(3)
  const nestedItem = toc.getByRole('link', { name: 'Examples' }).locator('xpath=..')
  await expect(nestedItem).toHaveJSProperty('tagName', 'LI')
  await expect(nestedItem.locator('xpath=parent::ol/parent::li')).toContainText('Usage')
})

test('disclosures support custom indicators, hidden indicators, and optional accordion names', async ({
  page,
}) => {
  await page.goto('/docs/components/accordion')
  const accordion = page.locator('[data-component-demo="Accordion"]')
  await expect(accordion.locator('details[name="component-docs-accordion"]')).toHaveCount(3)
  const independent = accordion.locator('details:not([name])')
  await expect(independent).toHaveCount(1)
  await expect(independent.locator('summary span[aria-hidden="true"]')).toHaveCount(0)

  await page.goto('/docs/components/collapsible')
  const collapsible = page.locator('[data-component-demo="Collapsible"]')
  const trigger = collapsible.locator('summary')
  const indicator = trigger.locator(':scope > span[aria-hidden="true"]')
  const label = trigger.locator(':scope > span:not([aria-hidden])')
  await expect(indicator).toHaveText('＋')
  const [indicatorBox, labelBox] = await Promise.all([indicator.boundingBox(), label.boundingBox()])
  expect(indicatorBox).not.toBeNull()
  expect(labelBox).not.toBeNull()
  expect(indicatorBox!.x + indicatorBox!.width).toBeLessThanOrEqual(labelBox!.x)
})

test('ScrollArea preserves stable defaults and offers the six-pixel overlay mode', async ({
  browserName,
  page,
}) => {
  await page.goto('/docs/components/scroll-area')

  const preview = page.locator('[data-component-demo="ScrollArea"]')
  const stable = preview.getByLabel('Stable release history')
  const overlay = preview.getByLabel('Overlay release history')
  await expect(stable).toHaveCSS('scrollbar-gutter', 'stable')
  await expect(overlay).toHaveCSS('scrollbar-gutter', 'auto')
  if (browserName === 'chromium') {
    await expect(overlay).toHaveCSS('scrollbar-width', 'thin')
  }
  if (browserName === 'webkit') {
    const widths = await Promise.all(
      [stable, overlay].map((area) =>
        area.evaluate((element) => getComputedStyle(element, '::-webkit-scrollbar').width),
      ),
    )
    expect(widths).toEqual(['14px', '6px'])
  }
})
