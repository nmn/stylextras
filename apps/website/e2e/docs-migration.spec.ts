import { expect, test } from '@playwright/test'
import { componentPreview } from './locators'

test('site-local MDX surfaces compose package primitives with native semantics', async ({
  page,
}) => {
  await page.goto('/test/docs-migration')
  await expect(page.getByTestId('docs-migration-fixture')).toBeVisible()

  const callout = page.getByRole('note').filter({
    hasText: 'Native alert composition',
  })
  await expect(callout).toBeVisible()
  await expect(callout).toContainText('The documentation callout composes the package alert parts.')

  const linkedCard = page.getByTestId('linked-mdx-card')
  await expect(linkedCard).toHaveRole('link')
  await expect(linkedCard).toHaveAttribute('href', '/docs/get-started')
  await expect(linkedCard.getByRole('heading', { name: 'Read the setup guide' })).toBeVisible()
  await expect(linkedCard).toContainText('The linked card composes the package card surface.')

  await expect(page.getByTestId('dynamic-code-fixture')).toHaveAttribute('data-hydrated', 'true')
  const tabs = page.getByRole('tablist', { name: 'Content tabs' })
  const npm = tabs.getByRole('tab', { name: 'npm' })
  const bun = tabs.getByRole('tab', { name: 'bun' })
  await expect(npm).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: 'npm' })).toContainText(
    'npm install @stylextras/ui',
  )

  await npm.focus()
  await page.keyboard.press('ArrowRight')
  await expect(bun).toBeFocused()
  await expect(bun).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: 'bun' })).toContainText('bun add @stylextras/ui')
})

test('site-local table, permalink, and scrolling-code adapters preserve docs geometry', async ({
  browserName,
  page,
}) => {
  await page.goto('/test/docs-migration')

  const heading = page.getByRole('heading', {
    name: 'MDX table, permalink, and scrolling code',
  })
  const permalink = heading.getByRole('link', {
    name: 'MDX table, permalink, and scrolling code',
  })
  await expect(permalink).toHaveAttribute('href', '#mdx-adapters-title')
  await permalink.click()
  await expect(page).toHaveURL(/#mdx-adapters-title$/)

  const table = page.getByTestId('mdx-table')
  const tableScroller = page.locator('[aria-label="Scrollable table"]')
  const firstHead = table.getByRole('columnheader').first()
  const firstCell = table.getByRole('cell').first()
  await expect(tableScroller).toHaveAttribute('tabindex', '0')
  await expect(table).toHaveCSS('font-size', '14px')
  await expect(firstHead).toHaveCSS('padding-block-start', '10px')
  await expect(firstHead).toHaveCSS('padding-inline-start', '12px')
  await expect(firstCell).toHaveCSS('padding-block-start', '10px')
  await expect(firstCell).toHaveCSS('padding-inline-start', '12px')

  const codeScroller = page.locator('[aria-label="Scrollable adapter example code"]')
  await expect(codeScroller).toHaveAttribute('tabindex', '0')
  await expect(codeScroller).toHaveCSS('max-height', '300px')
  if (browserName === 'chromium') {
    await expect(codeScroller).toHaveCSS('scrollbar-width', 'thin')
  }
  await expect(page.getByRole('button', { name: 'Copy to clipboard' })).toBeVisible()
})

test('site-local code copying resolves the current DOM text and resets after two seconds', async ({
  page,
}) => {
  await page.goto('/test/docs-migration')
  await expect(page.getByTestId('dynamic-code-fixture')).toHaveAttribute('data-hydrated', 'true')
  await expect(page.getByRole('tab', { name: 'npm' })).toBeVisible()
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (value: string) => {
          const testWindow = window as typeof window & {
            __stylextrasCopiedText?: string
          }
          testWindow.__stylextrasCopiedText = value
          return Promise.resolve()
        },
      },
    })
  })

  const codeBlock = page.getByTestId('mdx-code-block')
  const codeValue = codeBlock.getByTestId('mdx-code-value')
  const copy = codeBlock.locator('button[aria-label]').first()
  const announcement = codeBlock.getByRole('status')
  const clipboardIcon = copy.locator('svg.lucide-clipboard')
  const checkIcon = copy.locator('svg.lucide-check')
  await expect(copy).toHaveAttribute('aria-label', 'Copy Text')
  await expect(clipboardIcon).toBeVisible()

  await page.getByRole('button', { name: 'Use current install command' }).click()
  await expect(codeValue).toHaveText('npm install @stylextras/ui@current')

  const clickedAt = Date.now()
  await copy.click()
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as typeof window & {
              __stylextrasCopiedText?: string
            }
          ).__stylextrasCopiedText,
      ),
    )
    .toBe('npm install @stylextras/ui@current')
  await expect(copy).toHaveAttribute('aria-label', 'Copy Text')
  await expect(announcement).toHaveText('Copied Text')
  await expect(checkIcon).toBeVisible()

  await page.waitForTimeout(1500)
  await expect(checkIcon).toBeVisible()
  await expect(clipboardIcon).toBeVisible({ timeout: 1200 })
  await expect(copy).toHaveAttribute('aria-label', 'Copy Text')
  expect(Date.now() - clickedAt).toBeGreaterThanOrEqual(1900)
})

test('package copy reports async and synchronous errors, then calls onCopy after success', async ({
  page,
}) => {
  await page.goto('/test/docs-migration')
  const fixture = page.getByTestId('copy-error-fixture')
  await expect(fixture).toHaveAttribute('data-hydrated', 'true')
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Clipboard permission denied')
        },
      },
    })
  })

  const copy = fixture.locator('button')
  await expect(copy).toHaveAttribute('aria-label', 'Copy error fixture')
  await expect(copy).toHaveText('Copy')
  await copy.click()
  await expect(fixture.getByTestId('copy-error-output')).toHaveText('Clipboard permission denied')
  await expect(fixture.getByRole('status')).toHaveText('Copy failed')
  await expect(copy).toHaveText('Copy')

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () => {
          throw new Error('Synchronous clipboard failure')
        },
      },
    })
  })
  await copy.click()
  await expect(fixture.getByTestId('copy-error-output')).toHaveText('Synchronous clipboard failure')
  await expect(fixture.getByRole('status')).toHaveText('Copy failed')
  await expect(copy).toHaveText('Copy')

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () => Promise.resolve(),
      },
    })
  })
  await copy.click()
  await expect(fixture.getByTestId('copy-success-output')).toHaveText('copy error value')
  await expect(copy).toHaveAttribute('aria-label', 'Copy error fixture')
  await expect(fixture.getByRole('status')).toHaveText('Copied to clipboard')

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Failure after success')
        },
      },
    })
  })
  await copy.click()
  await expect(fixture.getByTestId('copy-error-output')).toHaveText('Failure after success')
  await expect(copy).toHaveAttribute('aria-label', 'Copy error fixture')
  await expect(copy).toHaveText('Copy')
})

test('site-local disclosures preserve standalone, exclusive, and independent behavior', async ({
  page,
}) => {
  await page.goto('/test/docs-migration')

  const standalone = page.getByTestId('standalone-disclosure')
  await expect(standalone).not.toHaveAttribute('open', '')
  await standalone.getByText('Standalone details', { exact: true }).click()
  await expect(standalone).toHaveAttribute('open', '')
  await expect(standalone).toContainText('Standalone disclosure content.')

  const singleOne = page.getByTestId('single-disclosure-one')
  const singleTwo = page.getByTestId('single-disclosure-two')
  await expect(singleOne).toHaveAttribute('open', '')
  await expect(singleTwo).not.toHaveAttribute('open', '')
  expect(await singleOne.getAttribute('name')).toBe(await singleTwo.getAttribute('name'))
  await singleTwo.getByText('Single disclosure two', { exact: true }).click()
  await expect(singleOne).not.toHaveAttribute('open', '')
  await expect(singleTwo).toHaveAttribute('open', '')

  const multipleOne = page.getByTestId('multiple-disclosure-one')
  const multipleTwo = page.getByTestId('multiple-disclosure-two')
  await expect(multipleOne).not.toHaveAttribute('name')
  await expect(multipleTwo).not.toHaveAttribute('name')
  await multipleOne.getByText('Multiple disclosure one', { exact: true }).click()
  await multipleTwo.getByText('Multiple disclosure two', { exact: true }).click()
  await expect(multipleOne).toHaveAttribute('open', '')
  await expect(multipleTwo).toHaveAttribute('open', '')
})

test('package tabs remain keyboard complete inside documentation previews', async ({ page }) => {
  await page.goto('/docs/components/tabs')
  const preview = componentPreview(page, 'Tabs')

  const tabs = preview.getByRole('tablist', { name: 'Documentation sections' })
  const overview = tabs.getByRole('tab', { name: 'Overview' })
  const examples = tabs.getByRole('tab', { name: 'Examples' })
  const accessibility = tabs.getByRole('tab', { name: 'Accessibility' })
  await expect(overview).toHaveAttribute('aria-selected', 'true')
  await expect(preview.getByRole('tabpanel', { name: 'Overview' })).toContainText(
    'A compact native-first implementation.',
  )

  await overview.focus()
  await expect(async () => {
    await overview.press('End')
    await expect(accessibility).toBeFocused()
  }).toPass()
  await expect(accessibility).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Home')
  await expect(overview).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(examples).toBeFocused()
  await expect(examples).toHaveAttribute('aria-selected', 'true')
})

test('docs sidebar opens the active folder and toggles its mobile focusability', async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/docs/components/button')

  const sidebar = page.locator('aside[aria-label="Documentation"]')
  const activeLink = sidebar.locator('a[aria-current="page"][href="/docs/components/button"]')
  const activeFolder = activeLink.locator('xpath=ancestor::details[1]')
  const sidebarFrame = sidebar.locator('..')
  const toggle = page.getByRole('button', {
    name: 'Toggle documentation sidebar',
  })

  await expect(activeLink).toHaveAttribute('aria-current', 'page')
  await expect(activeFolder).toHaveAttribute('open', '')
  await expect(sidebarFrame).toHaveCSS('visibility', 'hidden')
  expect(
    await activeLink.evaluate((element) => {
      element.focus()
      return document.activeElement === element
    }),
  ).toBe(false)

  await toggle.click()
  await expect(sidebarFrame).toHaveCSS('visibility', 'visible')
  await expect
    .poll(async () => (await sidebarFrame.boundingBox())?.x ?? -1)
    .toBeGreaterThanOrEqual(0)
  expect(
    await activeLink.evaluate((element) => {
      element.focus()
      return document.activeElement === element
    }),
  ).toBe(true)

  await toggle.click()
  await expect(sidebarFrame).toHaveCSS('visibility', 'hidden')
  expect(
    await activeLink.evaluate((element) => {
      element.focus()
      return document.activeElement === element
    }),
  ).toBe(false)
})

test('docs table of contents follows the active anchor with location semantics', async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 })
  await page.goto('/docs/get-started')

  const toc = page.getByRole('navigation', { name: 'On this page' })
  const target = toc.getByRole('link', { name: 'Apply themes directly' })
  await expect(toc).toBeVisible()
  await expect(toc.getByRole('link')).toHaveCount(3)

  await target.click()
  await expect(page).toHaveURL(/#apply-themes-directly$/)
  await expect(target).toHaveAttribute('aria-current', 'location')
  await expect(toc.locator('[aria-current="location"]')).toHaveCount(1)
})
