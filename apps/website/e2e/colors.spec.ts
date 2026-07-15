import { type Locator, expect, test } from '@playwright/test'

const accentThemeNames = [
  'Amber',
  'Blue',
  'Cyan',
  'Emerald',
  'Fuchsia',
  'Green',
  'Indigo',
  'Lime',
  'Orange',
  'Pink',
  'Purple',
  'Red',
  'Rose',
  'Sky',
  'Teal',
  'Violet',
  'Yellow',
] as const

async function effectiveBackgroundLuminance(locator: Locator, rootSelector: string) {
  return locator.evaluate((element, selector) => {
    const root = element.closest(selector)
    if (!root) throw new Error(`Could not find color root ${selector}`)

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('Canvas 2D context is unavailable')

    const rgba = (node: Element) => {
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = getComputedStyle(node).backgroundColor
      context.fillRect(0, 0, 1, 1)
      const data = context.getImageData(0, 0, 1, 1).data
      return [data[0]!, data[1]!, data[2]!, data[3]! / 255] as const
    }

    const composite = (
      top: readonly [number, number, number, number],
      bottom: readonly [number, number, number, number],
    ) => {
      const alpha = top[3] + bottom[3] * (1 - top[3])
      if (alpha === 0) return [0, 0, 0, 0] as const
      return [
        (top[0] * top[3] + bottom[0] * bottom[3] * (1 - top[3])) / alpha,
        (top[1] * top[3] + bottom[1] * bottom[3] * (1 - top[3])) / alpha,
        (top[2] * top[3] + bottom[2] * bottom[3] * (1 - top[3])) / alpha,
        alpha,
      ] as const
    }

    const layers: Array<readonly [number, number, number, number]> = []
    for (let node: Element | null = element; node; node = node.parentElement) {
      layers.unshift(rgba(node))
      if (node === root) break
    }
    const [red, green, blue] = layers.reduce((background, layer) => composite(layer, background), [
      0, 0, 0, 0,
    ] as const)
    const linear = (channel: number) => {
      const value = channel / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue)
  }, rootSelector)
}

async function backgroundAlpha(locator: Locator, pseudoElement?: string) {
  return locator.evaluate((element, pseudo) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('Canvas 2D context is unavailable')
    context.fillStyle = getComputedStyle(element, pseudo).backgroundColor
    context.fillRect(0, 0, 1, 1)
    return context.getImageData(0, 0, 1, 1).data[3]!
  }, pseudoElement ?? null)
}

async function textChromas(locator: Locator, start = 0) {
  return locator.evaluateAll((elements, startIndex) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('Canvas 2D context is unavailable')

    return elements.slice(startIndex).map((element) => {
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = getComputedStyle(element).color
      context.fillRect(0, 0, 1, 1)
      const [red, green, blue] = context.getImageData(0, 0, 1, 1).data
      return Math.max(red!, green!, blue!) - Math.min(red!, green!, blue!)
    })
  }, start)
}

test('component previews resolve packaged color tokens in both appearances', async ({ page }) => {
  await page.goto('/docs/components/drawer')
  const preview = page.locator('[data-component-demo="Drawer"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')

  await preview.getByLabel('Appearance').selectOption('light')
  const light = await preview.evaluate((element) => {
    const style = getComputedStyle(element)
    return { background: style.backgroundColor, color: style.color }
  })
  expect(await backgroundAlpha(preview)).toBe(255)
  expect(light.background).not.toBe('rgba(0, 0, 0, 0)')

  await preview.getByLabel('Appearance').selectOption('dark')
  const dark = await preview.evaluate((element) => {
    const style = getComputedStyle(element)
    return { background: style.backgroundColor, color: style.color }
  })
  expect(await backgroundAlpha(preview)).toBe(255)
  expect(dark.background).not.toBe('rgba(0, 0, 0, 0)')
  expect(dark.background).not.toBe(light.background)
  expect(dark.color).not.toBe(light.color)
})

test('accent themes tint their surfaces subtly in both appearances', async ({
  browserName,
  page,
}) => {
  await page.goto('/docs/themes')
  const gallery = page.getByTestId('theme-gallery')
  await expect(gallery).toBeVisible()
  const amberDark = gallery.getByLabel('Amber dark theme')
  await expect(amberDark).toHaveCSS('color-scheme', 'dark')
  if (browserName !== 'webkit') {
    await expect
      .poll(() => backgroundAlpha(amberDark.locator('[data-surface-depth="amber"]')))
      .toBeLessThan(255)
  }

  const samples = await gallery
    .locator('[aria-label$=" theme"] [data-surface-depth]')
    .evaluateAll((elements) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) throw new Error('Canvas 2D context is unavailable')

      return elements.map((element) => {
        const themeRoot = element.closest('section')
        if (!themeRoot) throw new Error('Could not find theme tile')

        context.clearRect(0, 0, 1, 1)
        context.fillStyle = getComputedStyle(element).backgroundColor
        context.fillRect(0, 0, 1, 1)
        const data = context.getImageData(0, 0, 1, 1).data
        const red = data[0]!
        const green = data[1]!
        const blue = data[2]!
        const alpha = data[3]!
        const chroma = Math.max(red, green, blue) - Math.min(red, green, blue)

        context.clearRect(0, 0, 1, 1)
        context.fillStyle = getComputedStyle(themeRoot).backgroundColor
        context.fillRect(0, 0, 1, 1)
        const rootData = context.getImageData(0, 0, 1, 1).data
        const rootChroma =
          Math.max(rootData[0]!, rootData[1]!, rootData[2]!) -
          Math.min(rootData[0]!, rootData[1]!, rootData[2]!)

        return {
          alpha,
          chroma,
          label: element.closest('section')?.getAttribute('aria-label'),
          perceivedChroma: chroma * (alpha / 255),
          rootChroma,
        }
      })
    })

  for (const name of accentThemeNames) {
    const light = samples.find((sample) => sample.label === `${name} light theme`)
    const dark = samples.find((sample) => sample.label === `${name} dark theme`)
    expect(light, `${name} should have a light surface sample`).toBeDefined()
    expect(dark, `${name} should have a dark surface sample`).toBeDefined()
    if (!light || !dark) throw new Error(`Missing ${name} surface samples`)
    expect(light.rootChroma, `${name} light canvas should retain its hue`).toBeGreaterThan(1)
    expect(light.rootChroma, `${name} light canvas tint should stay subtle`).toBeLessThan(10)
    expect(light.perceivedChroma, `${name} light surfaces should retain its hue`).toBeGreaterThan(1)
    expect(light.perceivedChroma, `${name} light surface tint should stay subtle`).toBeLessThan(12)
    expect(dark.perceivedChroma, `${name} dark tint should stay subtle`).toBeLessThan(6)
    // Firefox and WebKit quantize very subtle translucent OKLab canvas fills,
    // so a one-channel difference still proves the hue survived there.
    expect(dark.chroma, `${name} dark surfaces should retain its hue`).toBeGreaterThan(
      browserName === 'chromium' ? 4 : 0,
    )
    // WebKit flattens translucent OKLab canvas fills to an opaque pixel. The
    // lightness ordering test below verifies layering without relying on that
    // engine-specific serialization behavior.
    if (browserName !== 'webkit') {
      expect(dark.alpha, `${name} dark surfaces should remain layerable`).toBeLessThan(255)
    }
  }
})

test('alert status text keeps a subtle semantic tint', async ({ page }) => {
  await page.goto('/docs/components/alert')
  const preview = page.locator('[data-component-demo="Alert"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')

  for (const appearance of ['light', 'dark'] as const) {
    await preview.getByLabel('Appearance').selectOption(appearance)
    await expect(preview).toHaveCSS('color-scheme', appearance)
    const chromas = await textChromas(preview.locator('[role="status"] h5'), 1)

    expect(chromas, `Alert ${appearance} status count`).toHaveLength(4)
    for (const chroma of chromas) {
      expect(chroma, `Alert ${appearance} text should retain status hue`).toBeGreaterThan(0)
      expect(chroma, `Alert ${appearance} text tint should remain subtle`).toBeLessThanOrEqual(20)
    }
  }
})

test('badge status text keeps a subtle semantic tint', async ({ page }) => {
  await page.goto('/docs/components/badge')
  const preview = page.locator('[data-component-demo="Badge"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')

  for (const appearance of ['light', 'dark'] as const) {
    await preview.getByLabel('Appearance').selectOption(appearance)
    await expect(preview).toHaveCSS('color-scheme', appearance)
    const chromas = await textChromas(
      preview.getByText(/^(Info|Success|Warning|Danger)$/, { exact: true }),
    )

    expect(chromas, `Badge ${appearance} status count`).toHaveLength(4)
    for (const chroma of chromas) {
      expect(chroma, `Badge ${appearance} text should retain status hue`).toBeGreaterThan(0)
      expect(chroma, `Badge ${appearance} text tint should remain subtle`).toBeLessThanOrEqual(20)
    }
  }
})

test('native select trigger and customizable picker stay opaque', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'Customizable select is currently a Chromium enhancement.')
  await page.goto('/docs/components/select')
  const preview = page.locator('[data-component-demo="Select"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  await preview.getByLabel('Color theme').selectOption('blue')
  await preview.getByLabel('Appearance').selectOption('dark')
  await expect(preview).toHaveCSS('color-scheme', 'dark')
  const select = preview.locator('[data-component-demo-canvas] select').first()
  await expect(select).toBeVisible()
  expect(await backgroundAlpha(select)).toBe(255)
  expect(await backgroundAlpha(select, '::picker(select)')).toBe(255)
})

test('top-layer component surfaces stay opaque in dark accent themes', async ({ page }) => {
  const cases = [
    ['sheet', 'dialog'],
    ['popover', '[popover]'],
    ['dropdown-menu', '[popover]'],
    ['hover-card', '[popover]'],
    ['drawer', 'dialog'],
    ['dialog', 'dialog'],
    ['date-picker', '[popover]'],
    ['context-menu', '[popover]'],
    ['command', 'dialog'],
    ['combobox', '[role="listbox"]'],
  ] as const

  for (const [slug, selector] of cases) {
    await page.goto(`/docs/components/${slug}`)
    const preview = page.locator('[data-component-demo]').first()
    await expect(preview, `${slug} preview`).toHaveAttribute('data-preview-ready', 'true')
    await preview.getByLabel('Color theme').selectOption('blue')
    await preview.getByLabel('Appearance').selectOption('dark')
    await expect(preview).toHaveCSS('color-scheme', 'dark')
    const layer = preview.locator(`[data-component-demo-canvas] ${selector}`).first()
    await expect(layer, `${slug} layer`).toHaveCount(1)
    expect(await backgroundAlpha(layer), `${slug} background alpha`).toBe(255)
  }
})

test('dark checkbox indicator follows its foreground token', async ({ page }) => {
  await page.goto('/docs/components/checkbox')
  const preview = page.locator('[data-component-demo="Checkbox"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  await preview.getByLabel('Color theme').selectOption('neutral')
  await preview.getByLabel('Appearance').selectOption('dark')
  const checkbox = preview.locator('input[type="checkbox"]:checked').first()
  await expect(checkbox).toBeVisible()
  const indicator = await checkbox.evaluate((element) => ({
    color: getComputedStyle(element).color,
    indicator: getComputedStyle(element, '::before').backgroundColor,
    opacity: getComputedStyle(element, '::before').opacity,
  }))
  expect(indicator.indicator).toBe(indicator.color)
  expect(indicator.opacity).toBe('1')
})

test('dark surface, card, and selected-tab depth is monotonically lighter', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/themes')
  const theme = page.getByLabel('Blue dark theme')
  const surface = theme.locator('[data-surface-depth="blue"]')
  const raised = surface.locator(':scope > div')
  const overlay = raised.locator(':scope > span').last()
  const themeRoot = '[aria-label="Blue dark theme"]'
  const [themeBaseLuminance, surfaceLuminance, raisedLuminance, overlayLuminance] =
    await Promise.all([
      effectiveBackgroundLuminance(theme, themeRoot),
      effectiveBackgroundLuminance(surface, themeRoot),
      effectiveBackgroundLuminance(raised, themeRoot),
      effectiveBackgroundLuminance(overlay, themeRoot),
    ])
  expect(surfaceLuminance).toBeGreaterThan(themeBaseLuminance)
  expect(raisedLuminance).toBeGreaterThan(surfaceLuminance)
  expect(overlayLuminance).toBeGreaterThan(raisedLuminance)

  await page.goto('/docs/components/card')
  const cardPreview = page.locator('[data-component-demo="Card"]')
  await expect(cardPreview).toHaveAttribute('data-preview-ready', 'true')
  await cardPreview.getByLabel('Color theme').selectOption('blue')
  await expect(cardPreview).toHaveAttribute('data-preview-color', 'blue')
  await cardPreview.getByLabel('Appearance').selectOption('dark')
  await expect(cardPreview).toHaveAttribute('data-preview-appearance', 'dark')
  await expect(cardPreview).toHaveCSS('color-scheme', 'dark')
  const outerCard = cardPreview.getByLabel('Token-driven surface card')
  const nestedCard = cardPreview.getByLabel('Nested layer card')
  const [outerCardLuminance, nestedCardLuminance] = await Promise.all([
    effectiveBackgroundLuminance(outerCard, '[data-component-demo="Card"]'),
    effectiveBackgroundLuminance(nestedCard, '[data-component-demo="Card"]'),
  ])
  expect(nestedCardLuminance).toBeGreaterThan(outerCardLuminance)

  await page.goto('/docs/components/tabs')
  const tabsPreview = page.locator('[data-component-demo="Tabs"]')
  await expect(tabsPreview).toHaveAttribute('data-preview-ready', 'true')
  await tabsPreview.getByLabel('Color theme').selectOption('blue')
  await expect(tabsPreview).toHaveAttribute('data-preview-color', 'blue')
  await tabsPreview.getByLabel('Appearance').selectOption('dark')
  await expect(tabsPreview).toHaveAttribute('data-preview-appearance', 'dark')
  await expect(tabsPreview).toHaveCSS('color-scheme', 'dark')
  const selectedTab = tabsPreview.getByRole('tab', { selected: true }).first()
  const tabList = tabsPreview.getByRole('tablist').first()
  const tabsCanvas = tabsPreview.locator('[data-component-demo-canvas]')
  const tabsCanvasRoot = '[data-component-demo-canvas]'
  const [tabsCanvasLuminance, tabListLuminance, selectedTabLuminance] = await Promise.all([
    effectiveBackgroundLuminance(tabsCanvas, tabsCanvasRoot),
    effectiveBackgroundLuminance(tabList, tabsCanvasRoot),
    effectiveBackgroundLuminance(selectedTab, tabsCanvasRoot),
  ])
  expect(tabListLuminance).toBeGreaterThan(tabsCanvasLuminance)
  expect(tabListLuminance - tabsCanvasLuminance).toBeLessThan(0.015)
  expect(selectedTabLuminance).toBeGreaterThan(tabListLuminance)
  expect(selectedTabLuminance - tabListLuminance).toBeLessThan(0.04)
})

test('light tabs clearly distinguish the active surface', async ({ page }) => {
  await page.goto('/docs/components/tabs')
  const preview = page.locator('[data-component-demo="Tabs"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  await preview.getByLabel('Color theme').selectOption('neutral')
  await preview.getByLabel('Appearance').selectOption('light')
  const canvasRoot = '[data-component-demo-canvas]'
  const tabList = preview.getByRole('tablist').first()
  const selectedTab = preview.getByRole('tab', { selected: true }).first()
  const [canvasLuminance, tabListLuminance, selectedTabLuminance] = await Promise.all([
    effectiveBackgroundLuminance(preview.locator(canvasRoot), canvasRoot),
    effectiveBackgroundLuminance(tabList, canvasRoot),
    effectiveBackgroundLuminance(selectedTab, canvasRoot),
  ])

  expect(canvasLuminance - tabListLuminance).toBeGreaterThan(0.04)
  expect(selectedTabLuminance - tabListLuminance).toBeGreaterThan(0.04)
})
