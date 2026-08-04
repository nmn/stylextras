import { type Locator, type Page, expect, test } from '@playwright/test'
import { searchToggle, typingWord } from './locators'
import { closeThemeSettings, openThemeSettings } from './theme'

async function waitForWebsiteHydration(page: Page) {
  await expect(page.locator('#nd-nav')).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1280 })
  await page.goto('/')
  await waitForWebsiteHydration(page)
  await expect(page.locator('#nd-nav')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Customize website theme' })).toBeVisible()
})

test('preserves the shell geometry and responsive visibility boundaries', async ({ page }) => {
  await expect(page.locator('#nd-nav')).toHaveCSS('height', '72px')
  await expect(page.locator('#nd-nav nav')).toHaveCSS('height', '56px')

  const searchButton = searchToggle(page)
  await expect.poll(() => searchButton.boundingBox()).toMatchObject({ height: 37, width: 240 })
  const searchShortcut = searchButton.locator('kbd')
  await expect(searchShortcut).toHaveCount(1)
  await expect(searchShortcut.locator('span')).toHaveCount(2)
  await expect(searchShortcut).toHaveText(/K/)
  await expect(searchShortcut).toHaveAttribute('aria-hidden', 'true')
  const themeButton = page.getByRole('button', { name: 'Customize website theme' })
  const themeButtonBox = await themeButton.boundingBox()
  expect(themeButtonBox).not.toBeNull()
  expect(themeButtonBox!.width).toBe(themeButtonBox!.height)

  const cta = page.locator('a[href="/docs"]').nth(1)
  await expect(cta).toHaveCSS('border-radius', '10px')
  await expect(cta).toHaveCSS('border-width', '2px')
  await expect(cta).toHaveCSS('height', '60px')

  await page.setViewportSize({ height: 844, width: 761 })
  await expect(page.locator('#nd-nav a[href="/docs"]')).toBeVisible()

  await page.setViewportSize({ height: 844, width: 760 })
  await expect(page.locator('#nd-nav a[href="/docs"]')).toBeHidden()

  await page.setViewportSize({ height: 844, width: 421 })
  await expect(themeButton).toBeVisible()

  await page.setViewportSize({ height: 844, width: 420 })
  await expect(themeButton).toBeVisible()

  await page.setViewportSize({ height: 844, width: 361 })
  await expect(page.locator('#nd-nav a[aria-label="GitHub"]')).toBeVisible()

  await page.setViewportSize({ height: 844, width: 360 })
  await expect(page.locator('#nd-nav a[aria-label="GitHub"]')).toBeHidden()

  await page.setViewportSize({ height: 844, width: 320 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

test('preserves docs and search geometry at their exact responsive boundaries', async ({
  page,
}) => {
  await page.goto('/docs/get-started')
  await waitForWebsiteHydration(page)

  const layout = page.locator('#nd-docs-layout')
  const sidebar = page.locator('aside[aria-label="Documentation"]')
  const sidebarFrame = sidebar.locator('..')
  const toc = page.getByRole('navigation', { name: 'On this page' })
  const headerToggle = page.getByRole('button', { name: 'Toggle documentation sidebar' })
  const homeLink = page.getByRole('link', { name: 'StyleXtras home' })

  const [navBox, toggleBox, homeLinkBox] = await Promise.all([
    page.locator('#nd-nav nav').boundingBox(),
    headerToggle.boundingBox(),
    homeLink.boundingBox(),
  ])
  expect(navBox).not.toBeNull()
  expect(toggleBox).not.toBeNull()
  expect(homeLinkBox).not.toBeNull()
  expect(toggleBox!.x - navBox!.x).toBeGreaterThanOrEqual(4)
  expect(homeLinkBox!.x - (toggleBox!.x + toggleBox!.width)).toBeGreaterThanOrEqual(4)

  const restingToggleStyles = await headerToggle.evaluate((element) => {
    const style = getComputedStyle(element)
    return { backgroundColor: style.backgroundColor, color: style.color }
  })
  await headerToggle.hover()
  await expect(headerToggle).toHaveCSS('background-color', restingToggleStyles.backgroundColor)
  await expect
    .poll(() => headerToggle.evaluate((element) => getComputedStyle(element).color))
    .not.toBe(restingToggleStyles.color)

  await page.setViewportSize({ height: 900, width: 768 })
  await expect(sidebarFrame).toHaveCSS('visibility', 'visible')
  await expect(sidebar).toHaveCSS('width', '280px')
  await expect(layout).toHaveCSS('padding-inline-start', '292px')

  await page.setViewportSize({ height: 900, width: 767 })
  await expect(sidebarFrame).toHaveCSS('visibility', 'hidden')
  await expect(layout).toHaveCSS('padding-inline-start', '0px')

  await page.setViewportSize({ height: 900, width: 1280 })
  await expect(toc).toBeHidden()
  await page.setViewportSize({ height: 900, width: 1281 })
  await expect(toc).toBeVisible()

  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/docs/get-started')
  await waitForWebsiteHydration(page)
  await searchToggle(page).click()
  const dialog = page.getByRole('dialog', { name: 'Search' })
  const listbox = dialog.locator('[role="listbox"]')
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveCSS('max-width', '640px')
  await expect(listbox).toHaveCSS('max-height', '460px')
  await expect.poll(async () => (await dialog.boundingBox())?.y).toBe(16)
  await page.keyboard.press('Escape')

  await page.setViewportSize({ height: 900, width: 1280 })
  await searchToggle(page).click()
  await expect(dialog).toBeVisible()
  await expect.poll(async () => (await dialog.boundingBox())?.width).toBe(640)
})

test('themes shell foregrounds and radii without recoloring shell surfaces', async ({ page }) => {
  await page.goto('/docs/get-started')
  await waitForWebsiteHydration(page)

  const headerBackdrop = page.locator('#nd-nav > div').nth(2)
  const sidebar = page.locator('aside[aria-label="Documentation"]')
  const headerLink = page.locator('#nd-nav a[href="/docs"]')
  const sidebarLink = sidebar.locator('a[href="/docs/themes"]')
  const searchButton = searchToggle(page)
  const homeLink = page.getByRole('link', { name: 'StyleXtras home' })
  const logoText = homeLink.locator('svg > path').last()

  const readPaint = (locator: Locator) =>
    locator.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
      }
    })
  const readColor = (locator: Locator) =>
    locator.evaluate((element) => getComputedStyle(element).color)
  const readSrgb = (locator: Locator) =>
    locator.evaluate((element) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Could not create a canvas context')
      context.fillStyle = getComputedStyle(element).color
      context.fillRect(0, 0, 1, 1)
      return Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3))
    })

  for (const control of [
    page.getByRole('button', { name: 'Toggle documentation sidebar' }),
    page.locator('#nd-nav').getByRole('link', { name: 'GitHub', exact: true }),
    page.getByRole('button', { name: 'Customize website theme' }),
  ]) {
    await page.mouse.move(640, 500)
    const restingPaint = await readPaint(control)
    const restingColor = await readColor(control)
    await control.hover()
    await expect(control).toHaveCSS('background-color', restingPaint.backgroundColor)
    await expect(control).toHaveCSS('border-color', restingPaint.borderColor)
    await expect.poll(() => readColor(control)).not.toBe(restingColor)
  }

  await page.mouse.move(640, 500)
  const initialSurfaces = {
    header: await readPaint(headerBackdrop),
    search: await readPaint(searchButton),
    sidebar: await readPaint(sidebar),
  }
  const initialForegrounds = {
    headerLink: await readColor(headerLink),
    searchButton: await readColor(searchButton),
    sidebarLink: await readColor(sidebarLink),
  }

  let themeDialog = await openThemeSettings(page)
  await themeDialog.getByLabel('Color theme').selectOption('ember')
  await closeThemeSettings(themeDialog)

  await expect.poll(() => readColor(headerLink)).not.toBe(initialForegrounds.headerLink)
  await expect.poll(() => readColor(searchButton)).not.toBe(initialForegrounds.searchButton)
  await expect.poll(() => readColor(sidebarLink)).not.toBe(initialForegrounds.sidebarLink)
  const activeLinkColor = await readColor(headerLink)
  const activeLinkRgb = await readSrgb(headerLink)
  expect(Math.max(...activeLinkRgb)).toBeGreaterThan(160)
  expect(Math.max(...activeLinkRgb) - Math.min(...activeLinkRgb)).toBeGreaterThan(140)
  await sidebarLink.hover()
  await expect.poll(() => readColor(sidebarLink)).toBe(activeLinkColor)
  expect(await readPaint(headerBackdrop)).toEqual(initialSurfaces.header)
  expect(await readPaint(searchButton)).toEqual(initialSurfaces.search)
  expect(await readPaint(sidebar)).toEqual(initialSurfaces.sidebar)
  const themedHeaderIcon = page
    .locator('#nd-nav')
    .getByRole('link', { name: 'GitHub', exact: true })
  const themedIconColor = await readColor(themedHeaderIcon)
  await themedHeaderIcon.hover()
  await expect.poll(() => readColor(themedHeaderIcon)).not.toBe(themedIconColor)
  await expect
    .poll(() => logoText.evaluate((element) => getComputedStyle(element).fill))
    .toBe(await page.locator('html').evaluate((element) => getComputedStyle(element).color))

  themeDialog = await openThemeSettings(page)
  await themeDialog.getByLabel('Radius theme').selectOption('sharp')
  await closeThemeSettings(themeDialog)

  await expect(headerBackdrop).toHaveCSS('border-radius', '0px')
  await expect(searchButton).toHaveCSS('border-radius', '0px')
  await expect(sidebar).toHaveCSS('border-radius', '0px')
  await expect(sidebarLink).toHaveCSS('border-radius', '0px')
})

test('shows one deterministic typing word when reduced motion is requested', async ({ page }) => {
  const word = typingWord(page)
  const staticWord = word.locator(':scope > span').first()
  const animatedWords = word.locator(':scope > span:not(:first-child)')
  await expect(animatedWords).toHaveCount(5)
  expect(
    await animatedWords.evaluateAll((words) =>
      words.map((word) => getComputedStyle(word).animationDelay),
    ),
  ).toEqual(['-40s', '-32s', '-24s', '-16s', '-8s'])

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(staticWord).toHaveText('expressive')
  await expect(staticWord).toBeVisible()
  for (let index = 0; index < 5; index += 1) {
    await expect(animatedWords.nth(index)).toBeHidden()
  }
  await expect(word).toHaveCSS('animation-name', 'none')
})

test('anchors and dismisses the docs sidebar on the logical side in RTL', async ({ page }) => {
  await page.goto('/docs/get-started')
  await waitForWebsiteHydration(page)
  await page.locator('html').evaluate((element) => {
    element.setAttribute('dir', 'rtl')
  })

  const layout = page.locator('#nd-docs-layout')
  const sidebarFrame = page.locator('aside[aria-label="Documentation"]').locator('..')
  const toggle = page.getByRole('button', { name: 'Toggle documentation sidebar' })
  await expect(layout).toHaveCSS('padding-left', '0px')
  await expect(layout).toHaveCSS('padding-right', '292px')
  await expect
    .poll(async () => {
      const box = await sidebarFrame.boundingBox()
      return box ? Math.round(box.x + box.width) : -1
    })
    .toBe(1280)

  await page.setViewportSize({ height: 844, width: 390 })
  await expect(layout).toHaveCSS('padding-right', '0px')
  await expect(sidebarFrame).toHaveCSS('visibility', 'hidden')
  await expect.poll(async () => Math.round((await sidebarFrame.boundingBox())?.x ?? -1)).toBe(390)

  await toggle.click()
  await expect(sidebarFrame).toHaveCSS('visibility', 'visible')
  await expect
    .poll(async () => {
      const box = await sidebarFrame.boundingBox()
      return box ? Math.round(box.x + box.width) : -1
    })
    .toBe(390)
})

test('uses client navigation for eligible internal links', async ({ page }) => {
  const defaultPrevented = await page.locator('#nd-nav a[href="/docs"]').evaluate((link) => {
    const event = new MouseEvent('click', {
      bubbles: true,
      button: 0,
      cancelable: true,
    })
    return !link.dispatchEvent(event)
  })

  expect(defaultPrevented).toBe(true)
  await expect(page).toHaveURL(/\/docs$/)
  await expect(page.locator('#nd-docs-layout')).toBeVisible()
})

test('preserves native target and modifier-key link behavior', async ({ page }) => {
  const external = page.locator('#nd-nav a[aria-label="GitHub"]')
  await expect(external).toHaveAttribute('target', '_blank')
  await expect(external).toHaveAttribute('rel', 'noreferrer noopener')

  const docs = page.locator('#nd-nav a[href="/docs"]')
  await docs.evaluate((link) => link.setAttribute('target', '_blank'))

  const targetPopupPromise = page.waitForEvent('popup')
  await docs.click()
  const targetPopup = await targetPopupPromise
  await expect(targetPopup).toHaveURL(/\/docs$/)
  await expect(page).toHaveURL(/\/$/)
  await targetPopup.close()

  const selfTargetPrevented = await docs.evaluate(
    (link) =>
      new Promise<boolean>((resolve) => {
        link.setAttribute('target', '_self')
        window.addEventListener(
          'click',
          (event) => {
            resolve(event.defaultPrevented)
            event.preventDefault()
          },
          { once: true },
        )
        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            button: 0,
            cancelable: true,
          }),
        )
      }),
  )
  expect(selfTargetPrevented).toBe(false)

  await docs.evaluate((link) => link.removeAttribute('target'))
  const modifierPrevented = await docs.evaluate(
    (link) =>
      new Promise<boolean>((resolve) => {
        window.addEventListener(
          'click',
          (event) => {
            resolve(event.defaultPrevented)
            event.preventDefault()
          },
          { once: true },
        )
        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            button: 0,
            cancelable: true,
            metaKey: true,
          }),
        )
      }),
  )
  expect(modifierPrevented).toBe(false)
  await expect(page).toHaveURL(/\/$/)
})

test('preserves native hash and download link behavior', async ({ page }) => {
  await page.goto('/test/router-links')
  await expect(page.getByTestId('router-link-fixture')).toHaveAttribute('data-hydrated', 'true')

  const nativeClickWasPrevented = async (testId: string) =>
    page.getByTestId(testId).evaluate(
      (link) =>
        new Promise<boolean>((resolve) => {
          window.addEventListener(
            'click',
            (event) => {
              resolve(event.defaultPrevented)
              event.preventDefault()
            },
            { once: true },
          )
          link.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              button: 0,
              cancelable: true,
            }),
          )
        }),
    )

  expect(await nativeClickWasPrevented('router-link-hash')).toBe(false)
  expect(await nativeClickWasPrevented('router-link-download')).toBe(false)
  expect(await nativeClickWasPrevented('router-link-target')).toBe(false)
  expect(await nativeClickWasPrevented('router-link-prevented')).toBe(true)

  const external = page.getByTestId('router-link-external')
  await expect(external).toHaveAttribute('target', '_blank')
  await expect(external).toHaveAttribute('rel', 'noreferrer noopener')

  for (const testId of ['package-link', 'package-button-link']) {
    const link = page.getByTestId(testId)
    await expect(link).toHaveJSProperty('tagName', 'A')
    await expect(link).toHaveAttribute('href', `#${testId}`)
  }
  await expect(page).toHaveURL(/\/test\/router-links$/)
})

test('opens the native search dialog and restores trigger focus', async ({ page }) => {
  const trigger = searchToggle(page)
  await trigger.focus()
  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog', { name: 'Search' })
  const input = dialog.getByRole('textbox', { name: 'Search' })
  await expect(dialog).toBeVisible()
  await expect(input).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('loads the static site index and wraps the active option', async ({ page }) => {
  let requestCount = 0
  await page.route('**/api/search', async (route) => {
    requestCount += 1
    await new Promise((resolve) => setTimeout(resolve, 150))
    await route.continue()
  })

  const trigger = searchToggle(page)
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Search' })
  const input = dialog.getByRole('textbox', { name: 'Search' })
  await input.fill('clipboard')
  await expect(dialog.getByRole('progressbar')).toHaveCount(0)

  const options = dialog.getByRole('option')
  await expect(options.first()).toContainText('CopyToClipboardButton')
  const optionCount = await options.count()
  expect(optionCount).toBeGreaterThan(1)
  expect(requestCount).toBe(1)
  await expect(options.nth(0)).toHaveAttribute('aria-selected', 'true')

  await input.press('ArrowUp')
  await expect(options.nth(optionCount - 1)).toHaveAttribute('aria-selected', 'true')
  await input.press('ArrowDown')
  await expect(options.nth(0)).toHaveAttribute('aria-selected', 'true')
  await expect(input).toBeFocused()

  await input.press('Enter')
  await expect(page).toHaveURL(/\/docs\/components\/copy-to-clipboard-button$/)
  await expect(dialog).toBeHidden()
})

test('opens one anchored theme dialog and resets appearance on reload', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Customize website theme' })
  await trigger.focus()
  const dialog = await openThemeSettings(page)
  const usesAnchorPositioning = await dialog.evaluate(
    () =>
      CSS.supports('position-anchor: --stylextras-test') &&
      CSS.supports('anchor-scope: --stylextras-test'),
  )
  if (usesAnchorPositioning) {
    const [triggerBox, dialogBox] = await Promise.all([trigger.boundingBox(), dialog.boundingBox()])
    expect(triggerBox).not.toBeNull()
    expect(dialogBox).not.toBeNull()
    expect(
      Math.abs(dialogBox!.x + dialogBox!.width - (triggerBox!.x + triggerBox!.width)),
    ).toBeLessThanOrEqual(2)
  }

  for (const label of [
    'Style preset',
    'Appearance',
    'Color theme',
    'Spacing theme',
    'Radius theme',
    'Typography theme',
    'Stroke theme',
    'Elevation theme',
    'Blur theme',
    'Motion theme',
  ]) {
    await expect(dialog.getByLabel(label), label).toHaveCount(1)
  }

  await dialog.getByLabel('Appearance').selectOption('dark')
  const classesBeforeColorChange = await page.locator('html').getAttribute('class')
  await dialog.getByLabel('Color theme').selectOption('blue')

  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect
    .poll(() => page.locator('html').getAttribute('class'))
    .not.toBe(classesBeforeColorChange)
  const selectedThemeClasses = await page.locator('html').getAttribute('class')
  await closeThemeSettings(dialog)
  await expect(trigger).toBeFocused()

  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Docs', exact: true })
    .click()
  await expect(page).toHaveURL(/\/docs$/)
  await expect(page.locator('html')).toHaveAttribute('class', selectedThemeClasses!)

  await page.reload()
  await waitForWebsiteHydration(page)
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light dark')
  const reloadedDialog = await openThemeSettings(page)
  await expect(reloadedDialog.getByLabel('Appearance')).toHaveValue('system')
})

test('keeps legacy website colors unchanged across style presets', async ({ page }) => {
  const dialog = await openThemeSettings(page)
  const appearance = dialog.getByLabel('Appearance')
  const stylePreset = dialog.getByLabel('Style preset')
  const readLegacyPalette = () =>
    page.evaluate(() => {
      const rootStyles = getComputedStyle(document.documentElement)
      const tokens = Array.from(rootStyles)
        .filter((name) => name === '--color-code-green' || name.startsWith('--color-fd-'))
        .sort()
        .map((name) => [name, rootStyles.getPropertyValue(name)])

      return {
        background: getComputedStyle(document.body).backgroundColor,
        tokens,
      }
    })
  const presets = await stylePreset
    .locator('option')
    .evaluateAll((options) =>
      options
        .map((option) => (option as HTMLOptionElement).value)
        .filter((value) => value !== 'custom'),
    )

  for (const colorScheme of ['light', 'dark']) {
    await appearance.selectOption(colorScheme)
    const initialPalette = await readLegacyPalette()

    for (const preset of presets) {
      await stylePreset.selectOption(preset)
      await expect.poll(readLegacyPalette).toEqual(initialPalette)
    }
  }
})
