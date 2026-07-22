import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const route of ['/test/ui', '/docs', '/docs/themes']) {
  test(`has no accessibility violations on ${route}`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(route)
    if (route === '/test/ui') {
      await expect(page.locator('main[data-hydrated="true"]')).toBeVisible()
    } else {
      await expect(page.locator('#nd-docs-layout')).toBeVisible()
    }
    if (route === '/docs/themes') {
      const darkTheme = page.getByLabel('Neutral dark theme')
      const darkInput = darkTheme.getByLabel('Neutral sample input')
      await expect(darkTheme).toHaveCSS('color-scheme', 'dark')
      await expect
        .poll(() =>
          darkInput.evaluate((element) => {
            const canvas = document.createElement('canvas')
            canvas.width = 1
            canvas.height = 1
            const context = canvas.getContext('2d', { willReadFrequently: true })
            if (!context) return 0
            context.fillStyle = getComputedStyle(element).color
            context.fillRect(0, 0, 1, 1)
            const color = context.getImageData(0, 0, 1, 1).data
            return color[0]! + color[1]! + color[2]!
          }),
        )
        .toBeGreaterThan(600)
    }
    const results = await new AxeBuilder({ page }).analyze()
    // Waku's development RSC renderer emits `as="stylesheet"` preloads.
    // Production HTML is corrected by fix-rsc-stylesheet-preloads.mjs.
    const actionableErrors = errors.filter(
      (error) => error !== '<link rel=preload> must have a valid `as` value',
    )
    expect(results.violations).toEqual([])
    expect(actionableErrors).toEqual([])
  })
}
