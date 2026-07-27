import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { componentCatalog } from '@stylextras/ui/catalog'

test('every component default state has valid semantics and named controls', async ({ page }) => {
  test.setTimeout(240_000)

  for (const entry of componentCatalog) {
    const slug = entry.export.replace('experimental/', '')
    const section = entry.status === 'experimental' ? 'experimental' : 'components'
    const response = await page.goto(`/docs/${section}/${slug}`)
    expect(response?.ok(), `${entry.export} response`).toBe(true)

    const preview = page.locator(`[data-component-demo="${entry.name}"]`)
    await expect(preview, `${entry.export} preview`).toBeVisible()
    await expect(preview, `${entry.export} hydrated preview`).toHaveAttribute(
      'data-preview-ready',
      'true',
    )
    await expect(
      preview.locator('[data-component-demo-canvas] > *').first(),
      `${entry.export} demo content`,
    ).toBeVisible()

    const axeResults = await new AxeBuilder({ page })
      .include(`[data-component-demo="${entry.name}"]`)
      // Color and other visual-only remediation are intentionally outside this gate.
      .disableRules(['color-contrast'])
      .analyze()
    expect(axeResults.violations, `${entry.export} axe results`).toEqual([])

    const potentiallyFocusable = preview.locator(
      ':is(a[href], button, input:not([type="hidden"]), select, summary, textarea, [contenteditable="true"], [tabindex]:not([tabindex="-1"])):not([disabled]):not([inert])',
    )
    for (let index = 0; index < (await potentiallyFocusable.count()); index += 1) {
      const control = potentiallyFocusable.nth(index)
      if (!(await control.isVisible())) continue
      await expect(
        control,
        `${entry.export} focusable control ${index + 1} accessible name`,
      ).toHaveAccessibleName(/\S/)
    }
  }
})
