import { type Page, expect, test } from '@playwright/test'
import { initAdvancedSearch } from 'fumadocs-core/search/server'

test.describe.configure({ mode: 'serial' })

type Appearance = 'light' | 'dark'
type VisualViewport = 'desktop' | 'mobile'

const visualViewports = {
  desktop: { height: 900, width: 1440 },
  mobile: { height: 844, width: 390 },
} as const

test.beforeEach(async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'Visual baselines are recorded in Chromium.')
  await page.setViewportSize({ height: 1400, width: 1280 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

async function prepareVisualPage(
  page: Page,
  {
    appearance,
    path,
    shell = true,
    viewport,
  }: {
    appearance: Appearance
    path: string
    shell?: boolean
    viewport: VisualViewport
  },
) {
  await page.setViewportSize(visualViewports[viewport])
  await page.emulateMedia({
    colorScheme: appearance,
    reducedMotion: 'reduce',
  })
  await page.addInitScript((theme) => {
    localStorage.setItem('theme', theme)
  }, appearance)
  await page.goto(path)

  await expect(page.locator('body')).toHaveAttribute('data-website-hydrated', 'true')
  await expect(page.locator('html')).toHaveCSS('color-scheme', appearance)
  if (shell) {
    await expect(page.locator('[data-theme-toggle] [aria-pressed="true"]')).toHaveCount(1)
  }

  await settleVisualPage(page)
}

async function settleVisualPage(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve())
      })
    })
  })
}

async function mockSearchResults(page: Page) {
  const index = await initAdvancedSearch({
    indexes: [
      {
        breadcrumbs: ['Components'],
        id: '/docs/components/button',
        structuredData: {
          contents: [
            {
              content:
                'Compose native anchor behavior with the same visual variants and sizes as Button.',
              heading: 'variants',
            },
          ],
          headings: [
            {
              content: 'Accessible icon-only links button',
              id: 'accessibility',
            },
          ],
        },
        title: 'Button and ButtonLink button',
        url: '/docs/components/button',
      },
    ],
  }).export()

  const documents = (
    index as typeof index & {
      docs: {
        docs: Record<
          string,
          { breadcrumbs?: string[]; content: string; type: 'heading' | 'page' | 'text' }
        >
      }
    }
  ).docs.docs
  for (const document of Object.values(documents)) {
    if (document.type === 'page') {
      document.content = 'Button and ButtonLink'
    } else if (document.type === 'heading') {
      document.breadcrumbs = ['Components', 'Button and ButtonLink']
      document.content = 'Accessible icon-only links'
    } else {
      document.breadcrumbs = ['Components', 'Button and ButtonLink', 'Variants and sizes']
    }
  }

  await page.route('**/api/search', async (route) => {
    await route.fulfill({
      body: JSON.stringify(index),
      contentType: 'application/json',
      status: 200,
    })
  })
}

async function openPopulatedSearch(page: Page) {
  await page.locator('[data-search-full]').click()
  const dialog = page.getByRole('dialog', { name: 'Search' })
  const input = dialog.getByRole('textbox', { name: 'Search' })
  await expect(dialog).toBeVisible()
  await expect(input).toBeFocused()

  await input.fill('button')
  const options = dialog.getByRole('option')
  await expect(options).toHaveCount(3)
  await expect(options.first()).toHaveAttribute('aria-selected', 'true')
  await expect(dialog.getByRole('progressbar')).toHaveCount(0)
  await expect
    .poll(async () => (await dialog.getByRole('listbox').boundingBox())?.height ?? 0)
    .toBeGreaterThan(100)
  await settleVisualPage(page)
}

for (const viewport of ['desktop', 'mobile'] as const) {
  for (const appearance of ['light', 'dark'] as const) {
    test(`home ${viewport} ${appearance}`, async ({ page }) => {
      await prepareVisualPage(page, {
        appearance,
        path: '/',
        viewport,
      })

      await expect(page.locator('#nd-nav')).toBeVisible()
      await expect(
        page.getByLabel(
          'The expressive, type-safe, composable, predictable, and themeable styling system for ambitious interfaces',
        ),
      ).toBeVisible()
      await expect(page.locator('[data-static-typing-word]')).toHaveText('expressive')
      await expect(page.locator('[data-static-typing-word]')).toBeVisible()
      await expect(page.locator('footer')).toContainText('Meta Platforms, Inc.')

      await expect(page).toHaveScreenshot(`website-home-${viewport}-${appearance}.png`, {
        animations: 'allow',
        fullPage: true,
      })
    })
  }
}

for (const viewport of ['desktop', 'mobile'] as const) {
  for (const appearance of ['light', 'dark'] as const) {
    test(`docs ${viewport} ${appearance}`, async ({ page }) => {
      await prepareVisualPage(page, {
        appearance,
        path: '/docs/get-started',
        viewport,
      })

      await expect(page.getByRole('heading', { level: 1, name: 'Get started' })).toBeVisible()
      const sidebarFrame = page.locator('aside[aria-label="Documentation"]').locator('..')
      const toc = page.getByRole('navigation', { name: 'On this page' })
      if (viewport === 'desktop') {
        await expect(sidebarFrame).toHaveCSS('visibility', 'visible')
        await expect(toc).toBeVisible()
        await expect(toc.getByRole('link')).toHaveCount(3)
      } else {
        await expect(sidebarFrame).toHaveCSS('visibility', 'hidden')
        await expect(toc).toBeHidden()
      }

      await expect(page).toHaveScreenshot(`website-docs-${viewport}-${appearance}.png`)
    })
  }
}

test('docs desktop sidebar closed', async ({ page }) => {
  await prepareVisualPage(page, {
    appearance: 'light',
    path: '/docs/get-started',
    viewport: 'desktop',
  })

  const sidebarFrame = page.locator('aside[aria-label="Documentation"]').locator('..')
  await page.getByRole('button', { name: 'Toggle documentation sidebar' }).click()
  await expect(sidebarFrame).toHaveCSS('visibility', 'hidden')
  await expect
    .poll(async () => (await page.locator('#nd-docs-layout').boundingBox())?.x ?? -1)
    .toBe(0)
  await settleVisualPage(page)

  await expect(page).toHaveScreenshot('website-docs-desktop-light-sidebar-closed.png')
})

test('docs mobile sidebar open', async ({ page }) => {
  await prepareVisualPage(page, {
    appearance: 'dark',
    path: '/docs/get-started',
    viewport: 'mobile',
  })

  const sidebarFrame = page.locator('aside[aria-label="Documentation"]').locator('..')
  await expect(sidebarFrame).toHaveCSS('visibility', 'hidden')
  await page.getByRole('button', { name: 'Toggle documentation sidebar' }).click()
  await expect(sidebarFrame).toHaveCSS('visibility', 'visible')
  await expect
    .poll(async () => (await sidebarFrame.boundingBox())?.x ?? -1)
    .toBeGreaterThanOrEqual(0)
  await settleVisualPage(page)

  await expect(page).toHaveScreenshot('website-docs-mobile-dark-sidebar-open.png')
})

for (const viewport of ['desktop', 'mobile'] as const) {
  for (const appearance of ['light', 'dark'] as const) {
    test(`search open ${viewport} ${appearance}`, async ({ page }) => {
      await mockSearchResults(page)
      await prepareVisualPage(page, {
        appearance,
        path: '/docs/get-started',
        viewport,
      })
      await openPopulatedSearch(page)

      await expect(page).toHaveScreenshot(`website-search-${viewport}-${appearance}.png`)
    })
  }
}

for (const viewport of ['desktop', 'mobile'] as const) {
  for (const appearance of ['light', 'dark'] as const) {
    test(`MDX components ${viewport} ${appearance}`, async ({ page }) => {
      await prepareVisualPage(page, {
        appearance,
        path: '/test/docs-migration',
        shell: false,
        viewport,
      })

      const fixture = page.getByTestId('docs-migration-fixture')
      await expect(fixture).toBeVisible()
      await expect(page.getByTestId('copy-error-fixture')).toHaveAttribute('data-hydrated', 'true')

      const standalone = page.getByTestId('standalone-disclosure')
      const multipleOne = page.getByTestId('multiple-disclosure-one')
      const multipleTwo = page.getByTestId('multiple-disclosure-two')
      await standalone.getByText('Standalone details', { exact: true }).click()
      await multipleOne.getByText('Multiple disclosure one', { exact: true }).click()
      await multipleTwo.getByText('Multiple disclosure two', { exact: true }).click()
      await expect(standalone).toHaveAttribute('open', '')
      await expect(multipleOne).toHaveAttribute('open', '')
      await expect(multipleTwo).toHaveAttribute('open', '')
      await settleVisualPage(page)

      await expect(fixture).toHaveScreenshot(`website-mdx-${viewport}-${appearance}.png`)
    })
  }
}

test('reference gallery Docs and Zinc light/dark', async ({ page }) => {
  await page.goto('/docs')
  const gallery = page.getByTestId('reference-gallery')
  const color = gallery.getByLabel('Color theme')
  const appearance = gallery.getByLabel('Appearance')
  await expect(gallery).toBeVisible()
  await expect(gallery).toHaveAttribute('data-preview-ready', 'true')
  await expect(gallery).toHaveAttribute('data-preview-style', 'docs')
  await expect(gallery).toHaveAttribute('data-preview-color', 'docs')
  await expect(gallery).toHaveAttribute('data-preview-appearance', 'inherit')
  await appearance.selectOption('light')
  await expect(gallery).toHaveAttribute('data-preview-appearance', 'light')
  await page.locator('#nd-nav').evaluate((element) => {
    element.style.setProperty('display', 'none', 'important')
  })

  await expect(gallery).toHaveScreenshot('reference-docs-light.png')
  await appearance.selectOption('dark')
  await expect(gallery).toHaveAttribute('data-preview-appearance', 'dark')
  await expect(gallery).toHaveScreenshot('reference-docs-dark.png')
  await color.selectOption('zinc')
  await expect(gallery).toHaveAttribute('data-preview-color', 'zinc')
  await appearance.selectOption('light')
  await expect(gallery).toHaveAttribute('data-preview-appearance', 'light')
  await expect(gallery).toHaveScreenshot('reference-zinc-light.png')
  await appearance.selectOption('dark')
  await expect(gallery).toHaveAttribute('data-preview-appearance', 'dark')
  await expect(gallery).toHaveScreenshot('reference-zinc-dark.png')
})

test('all style presets and color theme objects render', async ({ page }) => {
  await page.goto('/docs/themes')
  const gallery = page.getByTestId('theme-gallery')
  await expect(gallery).toBeVisible()
  await expect(page.getByTestId('style-gallery').locator(':scope > section')).toHaveCount(14)
  await page.locator('#nd-nav').evaluate((element) => {
    element.style.setProperty('display', 'none', 'important')
  })
  await expect(gallery).toHaveScreenshot('all-color-themes.png')
})

test('individual component demos render with shared preview presets', async ({ page }) => {
  await page.goto('/docs/components/button')
  const demo = page.locator('[data-component-demo="Button"]')
  await expect(demo).toBeVisible()
  await expect(demo).toHaveAttribute('data-preview-ready', 'true')
  await expect(demo).toHaveAttribute('data-preview-appearance', 'inherit')
  await page.locator('#nd-nav').evaluate((element) => {
    element.style.setProperty('display', 'none', 'important')
  })

  await demo.getByLabel('Appearance').selectOption('light')
  await expect(demo).toHaveAttribute('data-preview-appearance', 'light')
  await expect(demo).toHaveScreenshot('component-demo-docs-light.png')
  await demo.getByLabel('Color theme').selectOption('zinc')
  await demo.getByLabel('Appearance').selectOption('dark')
  await expect(demo).toHaveAttribute('data-preview-color', 'zinc')
  await expect(demo).toHaveAttribute('data-preview-appearance', 'dark')
  await expect(demo).toHaveScreenshot('component-demo-zinc-dark.png')
})
