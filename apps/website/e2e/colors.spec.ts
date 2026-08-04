import { type Locator, expect, test } from '@playwright/test'
import { componentCanvas, componentPreview, referenceGallery } from './locators'
import { setWebsiteTheme } from './theme'

const websitePalette = {
  light: {
    '--color-code-green': 'hsl(146, 55%, 31%)',
    '--color-fd-accent': 'hsl(222, 16%, 83%)',
    '--color-fd-accent-foreground': 'hsl(222, 67%, 58%)',
    '--color-fd-background': 'hsl(0, 0%, 100%)',
    '--color-fd-border': 'hsla(0, 0%, 80%, 55%)',
    '--color-fd-card': 'hsl(0, 0%, 97%)',
    '--color-fd-card-foreground': 'hsl(0, 0%, 3.9%)',
    '--color-fd-error': 'oklch(63.7% 0.237 25.331)',
    '--color-fd-foreground': 'hsl(0, 0%, 3.9%)',
    '--color-fd-info': 'oklch(62.3% 0.214 259.815)',
    '--color-fd-muted': 'hsl(0, 0%, 96.1%)',
    '--color-fd-muted-foreground': 'hsl(0, 0%, 42%)',
    '--color-fd-overlay': 'transparent',
    '--color-fd-popover': 'hsl(0, 0%, 98%)',
    '--color-fd-popover-foreground': 'hsl(0, 0%, 15.1%)',
    '--color-fd-primary': 'hsl(266, 58%, 57%)',
    '--color-fd-primary-foreground': 'hsl(0, 0%, 100%)',
    '--color-fd-ring': 'hsl(267, 84%, 81%)',
    '--color-fd-secondary': 'hsl(0, 0%, 93.1%)',
    '--color-fd-secondary-foreground': 'hsl(0, 0%, 9%)',
    '--color-fd-success': 'oklch(72.3% 0.219 149.579)',
    '--color-fd-warning': 'oklch(76.9% 0.188 70.08)',
  },
  dark: {
    '--color-code-green': 'hsl(146, 52%, 68%)',
    '--color-fd-accent': 'hsl(222, 16%, 23%)',
    '--color-fd-accent-foreground': 'hsl(222, 87%, 78%)',
    '--color-fd-background': 'hsl(0, 0%, 7%)',
    '--color-fd-border': 'hsla(0, 0%, 30%, 25%)',
    '--color-fd-card': 'hsl(0, 0%, 8.5%)',
    '--color-fd-card-foreground': 'hsl(0, 0%, 98%)',
    '--color-fd-error': 'oklch(63.7% 0.237 25.331)',
    '--color-fd-foreground': 'hsl(0, 0%, 92%)',
    '--color-fd-info': 'oklch(62.3% 0.214 259.815)',
    '--color-fd-muted': 'hsl(0, 0%, 12.9%)',
    '--color-fd-muted-foreground': 'hsla(0, 0%, 70%, 0.8)',
    '--color-fd-overlay': 'hsla(0, 0%, 0%, 0.2)',
    '--color-fd-popover': 'hsl(0, 0%, 11.6%)',
    '--color-fd-popover-foreground': 'hsl(0, 0%, 86.9%)',
    '--color-fd-primary': 'hsl(270, 72%, 77%)',
    '--color-fd-primary-foreground': 'hsl(240, 23%, 9%)',
    '--color-fd-ring': 'hsl(267, 84%, 81%)',
    '--color-fd-secondary': 'hsl(0, 0%, 12.9%)',
    '--color-fd-secondary-foreground': 'hsl(0, 0%, 70%)',
    '--color-fd-success': 'oklch(72.3% 0.219 149.579)',
    '--color-fd-warning': 'oklch(76.9% 0.188 70.08)',
  },
} as const

for (const appearance of ['light', 'dark'] as const) {
  test(`website system appearance preserves the ${appearance} legacy color bridge`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: appearance })
    await page.goto('/')

    await expect(page.locator('html')).toHaveCSS('color-scheme', 'light dark')
    await expect
      .poll(
        () =>
          page.locator('body').evaluate((body, palette) => {
            const probe = document.createElement('span')
            probe.hidden = true
            body.append(probe)
            const canvas = document.createElement('canvas')
            canvas.width = 1
            canvas.height = 1
            const context = canvas.getContext('2d', { willReadFrequently: true })
            if (!context) throw new Error('Canvas 2D context is unavailable')

            const resolve = (value: string) => {
              probe.style.color = value
              const css = getComputedStyle(probe).color
              context.clearRect(0, 0, 1, 1)
              context.fillStyle = css
              context.fillRect(0, 0, 1, 1)
              return {
                css,
                pixel: Array.from(context.getImageData(0, 0, 1, 1).data),
              }
            }

            const failures: string[] = []
            for (const [name, expected] of Object.entries(palette)) {
              const actualColor = resolve(`var(${name})`)
              const expectedColor = resolve(expected)
              if (actualColor.css === expectedColor.css) continue
              for (const [index, channel] of actualColor.pixel.entries()) {
                if (Math.abs(channel! - expectedColor.pixel[index]!) > 1) {
                  failures.push(`${name}[${index}]: ${actualColor.css} != ${expectedColor.css}`)
                }
              }
            }
            probe.remove()
            return failures
          }, websitePalette[appearance]),
        { message: `${appearance} website palette has loaded` },
      )
      .toEqual([])
  })
}

for (const appearance of ['light', 'dark'] as const) {
  test(`catalog previews default to system with a ${appearance} preference`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: appearance })

    await page.goto('/docs/components/button')
    const buttonPreview = componentPreview(page, 'Button')
    await expect(buttonPreview).toBeVisible()
    await expect(buttonPreview).toHaveCSS('color-scheme', 'light dark')

    await page.goto('/docs')
    const gallery = referenceGallery(page)
    await expect(gallery).toBeVisible()
    await expect(gallery).toHaveCSS('color-scheme', 'light dark')
  })
}

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

async function backgroundPixel(locator: Locator, pseudoElement?: string) {
  return locator.evaluate((element, pseudo) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('Canvas 2D context is unavailable')
    context.fillStyle = getComputedStyle(element, pseudo).backgroundColor
    context.fillRect(0, 0, 1, 1)
    return Array.from(context.getImageData(0, 0, 1, 1).data)
  }, pseudoElement ?? null)
}

async function backgroundAlpha(locator: Locator, pseudoElement?: string) {
  return (await backgroundPixel(locator, pseudoElement))[3]!
}

async function backgroundChroma(locator: Locator) {
  const [red, green, blue] = await backgroundPixel(locator)
  return Math.max(red!, green!, blue!) - Math.min(red!, green!, blue!)
}

async function expectPaintedBackground(locator: Locator, message: string) {
  await expect.poll(() => backgroundAlpha(locator), { message }).toBeGreaterThan(0)
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
  const preview = componentPreview(page, 'Drawer')
  await expect(preview).toBeVisible()

  await setWebsiteTheme(page, { Appearance: 'light' })
  const light = await preview.evaluate((element) => {
    const style = getComputedStyle(element)
    return { background: style.backgroundColor, color: style.color }
  })
  expect(await backgroundAlpha(preview)).toBe(255)
  expect(light.background).not.toBe('rgba(0, 0, 0, 0)')

  await setWebsiteTheme(page, { Appearance: 'dark' })
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
  const gallery = page.getByRole('region', { name: 'Color themes', exact: true }).locator('..')
  await expect(gallery).toBeVisible()
  await expect
    .poll(() => backgroundChroma(gallery.getByLabel('Amber light theme')))
    .toBeGreaterThan(1)
  const amberDark = gallery.getByLabel('Amber dark theme')
  await expect(amberDark).toHaveCSS('color-scheme', 'dark')
  if (browserName !== 'webkit') {
    await expect
      .poll(() =>
        backgroundAlpha(amberDark.getByRole('group', { name: 'Amber surface depth', exact: true })),
      )
      .toBeLessThan(255)
  }

  const samples = await gallery
    .getByRole('group', { name: / surface depth$/ })
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
  const preview = componentPreview(page, 'Alert')
  await expect(preview).toBeVisible()

  for (const appearance of ['light', 'dark'] as const) {
    await setWebsiteTheme(page, { Appearance: appearance })
    await expect(preview).toHaveCSS('color-scheme', appearance)
    const chromas = await textChromas(
      preview.getByRole('heading', { name: /^(info|success|warning|danger)$/ }),
    )

    expect(chromas, `Alert ${appearance} status count`).toHaveLength(4)
    for (const chroma of chromas) {
      expect(chroma, `Alert ${appearance} text should retain status hue`).toBeGreaterThan(0)
      expect(chroma, `Alert ${appearance} text tint should remain subtle`).toBeLessThanOrEqual(20)
    }
  }
})

test('badge status text keeps a subtle semantic tint', async ({ page }) => {
  await page.goto('/docs/components/badge')
  const preview = componentPreview(page, 'Badge')
  await expect(preview).toBeVisible()

  for (const appearance of ['light', 'dark'] as const) {
    await setWebsiteTheme(page, { Appearance: appearance })
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
  const preview = componentPreview(page, 'Select')
  await expect(preview).toBeVisible()
  await setWebsiteTheme(page, { Appearance: 'dark', 'Color theme': 'blue' })
  await expect(preview).toHaveCSS('color-scheme', 'dark')
  const select = componentCanvas(preview).locator('select').first()
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
    ['anchored-dialog', 'dialog'],
    ['context-menu', '[popover]'],
    ['command', 'dialog'],
    ['combobox', '[popover]'],
  ] as const

  for (const [slug, selector] of cases) {
    await page.goto(`/docs/components/${slug}`)
    const preview = componentPreview(page).first()
    await expect(preview, `${slug} preview`).toBeVisible()
    await setWebsiteTheme(page, { Appearance: 'dark', 'Color theme': 'blue' })
    await expect(preview).toHaveCSS('color-scheme', 'dark')
    const layer = componentCanvas(preview).locator(selector).first()
    await expect(layer, `${slug} layer`).toHaveCount(1)
    expect(await backgroundAlpha(layer), `${slug} background alpha`).toBe(255)
  }
})

test('dark checkbox indicator follows its foreground token', async ({ page }) => {
  await page.goto('/docs/components/checkbox')
  const preview = componentPreview(page, 'Checkbox')
  await expect(preview).toBeVisible()
  await setWebsiteTheme(page, { 'Color theme': 'neutral' })
  await setWebsiteTheme(page, { Appearance: 'dark' })
  await expect(preview).toHaveCSS('color-scheme', 'dark')
  const checkbox = preview.locator('input[type="checkbox"]:checked').first()
  await expect(checkbox).toBeVisible()
  await expect
    .poll(() =>
      checkbox.evaluate((element) => {
        const indicator = getComputedStyle(element, '::after')
        return (
          indicator.backgroundColor === getComputedStyle(element).color && indicator.opacity === '1'
        )
      }),
    )
    .toBe(true)
})

test('every theme keeps nested cards and overlays lighter than their containers', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/themes')
  const labels = await page
    .locator('section[aria-label$=" theme"]:has([role="group"][aria-label$=" surface depth"])')
    .evaluateAll((themes) =>
      themes.map((theme) => theme.getAttribute('aria-label')).filter(Boolean),
    )

  for (const label of labels) {
    const theme = page.getByRole('region', { name: label!, exact: true })
    const surface = theme.getByRole('group', { name: / surface depth$/ })
    const raised = surface.locator(':scope > div')
    const overlay = raised.locator(':scope > span').last()
    const themeRoot = `[aria-label="${label}"]`
    await expect(theme).toHaveCSS('color-scheme', label!.endsWith(' dark theme') ? 'dark' : 'light')
    await Promise.all([
      expectPaintedBackground(theme, `${label} base has loaded`),
      expectPaintedBackground(surface, `${label} surface has loaded`),
      expectPaintedBackground(raised, `${label} card has loaded`),
      expectPaintedBackground(overlay, `${label} popover has loaded`),
    ])
    const [themeBaseLuminance, surfaceLuminance, raisedLuminance, overlayLuminance] =
      await Promise.all([
        effectiveBackgroundLuminance(theme, themeRoot),
        effectiveBackgroundLuminance(surface, themeRoot),
        effectiveBackgroundLuminance(raised, themeRoot),
        effectiveBackgroundLuminance(overlay, themeRoot),
      ])
    if (label!.endsWith(' dark theme')) {
      expect(surfaceLuminance, `${label} surface`).toBeGreaterThan(themeBaseLuminance)
    }
    expect(raisedLuminance, `${label} card`).toBeGreaterThan(surfaceLuminance)
    expect(overlayLuminance, `${label} popover`).toBeGreaterThan(raisedLuminance)
  }

  await page.goto('/docs/components/card')
  const cardPreview = componentPreview(page, 'Card')
  await expect(cardPreview).toBeVisible()
  await setWebsiteTheme(page, { 'Color theme': 'blue' })
  await setWebsiteTheme(page, { Appearance: 'dark' })
  await expect(cardPreview).toHaveCSS('color-scheme', 'dark')
  const outerCard = cardPreview
    .getByRole('heading', { exact: true, name: 'Token-driven surface' })
    .locator('xpath=ancestor::article[1]')
  const nestedCard = cardPreview
    .getByRole('heading', { exact: true, name: 'Nested layer' })
    .locator('xpath=ancestor::article[1]')
  const [outerCardLuminance, nestedCardLuminance] = await Promise.all([
    effectiveBackgroundLuminance(outerCard, 'section[aria-label="Card live demo"]'),
    effectiveBackgroundLuminance(nestedCard, 'section[aria-label="Card live demo"]'),
  ])
  expect(nestedCardLuminance).toBeGreaterThan(outerCardLuminance)

  await page.goto('/docs/components/tabs')
  const tabsPreview = componentPreview(page, 'Tabs')
  await expect(tabsPreview).toBeVisible()
  await setWebsiteTheme(page, { 'Color theme': 'blue' })
  await setWebsiteTheme(page, { Appearance: 'dark' })
  await expect(tabsPreview).toHaveCSS('color-scheme', 'dark')
  const selectedTab = tabsPreview.getByRole('tab', { selected: true }).first()
  const tabList = tabsPreview.getByRole('tablist').first()
  const tabsCanvas = componentCanvas(tabsPreview)
  const tabsCanvasRoot = 'section[aria-label="Tabs live demo"] > div'
  await Promise.all([
    expectPaintedBackground(tabsCanvas, 'Tabs canvas has loaded'),
    expectPaintedBackground(tabList, 'Tabs list has loaded'),
    expectPaintedBackground(selectedTab, 'Selected tab has loaded'),
  ])
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

test('light tabs clearly distinguish the active surface', async ({ browserName, page }) => {
  await page.goto('/docs/components/tabs')
  const preview = componentPreview(page, 'Tabs')
  await expect(preview).toBeVisible()
  await setWebsiteTheme(page, { 'Color theme': 'neutral' })
  await setWebsiteTheme(page, { Appearance: 'light' })
  await expect(preview).toHaveCSS('color-scheme', 'light')
  const canvasRoot = 'section[aria-label="Tabs live demo"] > div'
  const tabList = preview.getByRole('tablist').first()
  const selectedTab = preview.getByRole('tab', { selected: true }).first()
  await Promise.all([
    expectPaintedBackground(componentCanvas(preview), 'Tabs canvas has loaded'),
    expectPaintedBackground(tabList, 'Tabs list has loaded'),
    expectPaintedBackground(selectedTab, 'Selected tab has loaded'),
  ])
  const [canvasLuminance, tabListLuminance, selectedTabLuminance] = await Promise.all([
    effectiveBackgroundLuminance(componentCanvas(preview), canvasRoot),
    effectiveBackgroundLuminance(tabList, canvasRoot),
    effectiveBackgroundLuminance(selectedTab, canvasRoot),
  ])
  const selectedTreatment = await selectedTab.evaluate((element) => {
    const style = getComputedStyle(element)
    return { borderColor: style.borderColor }
  })

  expect(canvasLuminance - tabListLuminance).toBeGreaterThan(0.04)
  // WebKit quantizes the OKLab canvas probe more aggressively. The selected
  // tab also has an explicit border, so luminance is not its only cue.
  expect(selectedTabLuminance - tabListLuminance).toBeGreaterThan(
    browserName === 'webkit' ? 0.02 : 0.04,
  )
  expect(selectedTreatment.borderColor).not.toBe('rgba(0, 0, 0, 0)')
})
