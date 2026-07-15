import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { componentCatalog } from '@stylextras/ui/catalog'
import componentPropsJson from '../src/generated/component-props.json' with { type: 'json' }

const componentProps = componentPropsJson as Record<
  string,
  { parts: Array<{ props: Array<{ name: string }>; typeName: string }> }
>

test.describe.configure({ mode: 'serial' })

test('every component page renders its live demo', async ({ browserName, page }) => {
  test.skip(
    browserName !== 'chromium',
    'The full catalog crawl runs once; cross-engine component behavior is covered separately.',
  )
  test.setTimeout(180_000)

  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

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
    await expect(preview, `${entry.export} styled preview`).toHaveCSS('display', 'grid')
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
      await expect(preview.getByLabel(label), `${entry.export} ${label}`).toHaveCount(1)
    }
    await expect(
      preview.locator('[data-component-demo-canvas] > *').first(),
      `${entry.export} demo content`,
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Examples', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Anatomy', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'API reference', exact: true })).toBeVisible()
    const reference = componentProps[entry.export]
    if (!reference) throw new Error(`Missing generated prop reference for ${entry.export}`)
    expect(reference.parts.length, `${entry.export} documented parts`).toBeGreaterThan(0)
    await expect(page.locator('[data-docs-anatomy-part]')).toHaveCount(reference.parts.length)
    await expect(page.locator('[data-docs-api-part]')).toHaveCount(reference.parts.length)
    for (const part of reference.parts) {
      const apiPart = page.locator(`[data-docs-api-part="${part.typeName}"]`)
      await expect(apiPart).toBeVisible()
      await expect(apiPart.locator('[data-docs-prop]')).toHaveCount(part.props.length)
    }
    await expect(page.locator('vite-error-overlay')).toHaveCount(0)

    if (entry.status === 'stable') {
      const results = await new AxeBuilder({ page })
        .include(`[data-component-demo="${entry.name}"]`)
        .analyze()
      const serious = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      )
      expect(serious, `${entry.export} axe results`).toEqual([])
    }
  }

  expect(errors).toEqual([])
})

test('every component page fits a narrow viewport', async ({ browserName, page }) => {
  test.skip(
    browserName !== 'chromium',
    'The catalog layout crawl runs once; cross-engine narrow-layout behavior is covered on the verification route.',
  )
  test.setTimeout(180_000)
  await page.setViewportSize({ height: 844, width: 390 })

  for (const entry of componentCatalog) {
    const slug = entry.export.replace('experimental/', '')
    const section = entry.status === 'experimental' ? 'experimental' : 'components'
    await page.goto(`/docs/${section}/${slug}`)
    const preview = page.locator(`[data-component-demo="${entry.name}"]`)
    await expect(preview, `${entry.export} preview`).toBeVisible()
    await expect(preview, `${entry.export} hydrated preview`).toHaveAttribute(
      'data-preview-ready',
      'true',
    )
    await expect(preview, `${entry.export} styled preview`).toHaveCSS('display', 'grid')

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow, `${entry.export} horizontal overflow`).toBeLessThanOrEqual(1)
  }
})

test('Accordion keeps a stable width as native details items toggle', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/accordion')
  const preview = page.locator('[data-component-demo="Accordion"]')
  await expect(preview).toBeVisible()
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  await expect(preview.locator('details')).toHaveCount(3)
  await expect(preview.locator('summary')).toHaveCount(3)
  await expect(preview.locator('summary').first()).toHaveCSS('display', 'grid')
  await expect(preview.locator('summary').first()).toHaveCSS('list-style-type', 'none')
  await expect(preview.locator('summary span[aria-hidden="true"]')).toHaveCount(3)

  const measure = () =>
    preview.locator('details').evaluateAll((items) => ({
      iconRotations: items.map(
        (item) => getComputedStyle(item.querySelector('span[aria-hidden="true"] > span')!).rotate,
      ),
      itemWidths: items.map((item) => item.getBoundingClientRect().width),
      rootWidth: items[0]?.parentElement?.getBoundingClientRect().width ?? 0,
      summaryWidths: items.map(
        (item) => item.querySelector('summary')?.getBoundingClientRect().width ?? 0,
      ),
    }))

  const before = await measure()
  await preview.locator('summary').nth(1).click()
  const after = await measure()
  expect(after.itemWidths).toEqual(before.itemWidths)
  expect(after.rootWidth).toBe(before.rootWidth)
  expect(after.summaryWidths).toEqual(before.summaryWidths)
  expect(after.iconRotations[0]).not.toBe(before.iconRotations[0])
  expect(after.iconRotations[1]).not.toBe(before.iconRotations[1])
})

test('Carousel uses native scroll snap across an extended example', async ({ page }) => {
  await page.goto('/docs/components/carousel')
  const preview = page.locator('[data-component-demo="Carousel"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  const carousel = preview.getByRole('region', { name: 'Browser API highlights' })
  const items = carousel.locator('article')
  await expect(items).toHaveCount(10)
  await expect(carousel).toHaveCSS('scroll-snap-type', /mandatory/)
  await expect(items.first()).toHaveCSS('scroll-snap-align', /start/)
})

test('ButtonGroup action choices are equal-width inline-grid tracks', async ({ page }) => {
  await page.goto('/docs/components/button-group')
  const preview = page.locator('[data-component-demo="ButtonGroup"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  const group = preview.getByRole('group', { name: 'Confirm changes' })
  // Grid items are blockified by their grid parent, so inline-grid computes to grid.
  await expect(group).toHaveCSS('display', 'grid')
  const buttons = group.getByRole('button')
  await expect(buttons).toHaveCount(2)
  const widths = await buttons.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().width),
  )
  expect(Math.abs(widths[0]! - widths[1]!)).toBeLessThanOrEqual(1)
  const [groupBox, parentBox] = await Promise.all([
    group.boundingBox(),
    group.locator('..').boundingBox(),
  ])
  expect(groupBox).not.toBeNull()
  expect(parentBox).not.toBeNull()
  expect(groupBox!.width).toBeLessThan(parentBox!.width)
  expect(
    Math.abs(groupBox!.x + groupBox!.width - (parentBox!.x + parentBox!.width)),
  ).toBeLessThanOrEqual(2)
})

test('Collapsible keeps a stable inline-end disclosure icon', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/collapsible')
  const preview = page.locator('[data-component-demo="Collapsible"]')
  const details = preview.locator('details')
  const trigger = details.locator('summary')
  const label = trigger.locator('span').first()
  const icon = trigger.locator('span[aria-hidden="true"]')
  const iconGlyph = icon.locator('span')
  await expect(details).not.toHaveAttribute('open', '')
  await expect(trigger).toHaveCSS('display', 'grid')
  await expect(icon).toHaveCount(1)
  await expect(iconGlyph).toHaveCount(1)
  const closedRotation = await iconGlyph.evaluate((element) => getComputedStyle(element).rotate)
  const [closedDetailsBox, closedTriggerBox, labelBox, iconBox] = await Promise.all([
    details.boundingBox(),
    trigger.boundingBox(),
    label.boundingBox(),
    icon.boundingBox(),
  ])
  expect(closedDetailsBox).not.toBeNull()
  expect(closedTriggerBox).not.toBeNull()
  expect(labelBox).not.toBeNull()
  expect(iconBox).not.toBeNull()
  expect(iconBox!.x).toBeGreaterThan(labelBox!.x + labelBox!.width)
  await trigger.click()
  await expect(details).toHaveAttribute('open', '')
  expect(await iconGlyph.evaluate((element) => getComputedStyle(element).rotate)).not.toBe(
    closedRotation,
  )
  const [openDetailsBox, openTriggerBox] = await Promise.all([
    details.boundingBox(),
    trigger.boundingBox(),
  ])
  expect(Math.abs(openDetailsBox!.width - closedDetailsBox!.width)).toBeLessThanOrEqual(0.1)
  expect(Math.abs(openTriggerBox!.width - closedTriggerBox!.width)).toBeLessThanOrEqual(0.1)
  await details.evaluate((element) => {
    element.setAttribute('dir', 'rtl')
  })
  await expect
    .poll(() => icon.evaluate((element) => getComputedStyle(element).scale))
    .toMatch(/^-1(?: 1)?$/)
  expect(await iconGlyph.evaluate((element) => getComputedStyle(element).rotate)).not.toBe(
    closedRotation,
  )
  const [rtlLabelBox, rtlIconBox] = await Promise.all([label.boundingBox(), icon.boundingBox()])
  expect(rtlLabelBox).not.toBeNull()
  expect(rtlIconBox).not.toBeNull()
  expect(rtlIconBox!.x + rtlIconBox!.width).toBeLessThan(rtlLabelBox!.x)
})

test('Switch thumb position follows the inline axis', async ({ page }) => {
  await page.goto('/docs/components/switch')
  const preview = page.locator('[data-component-demo="Switch"]')
  const checked = preview.locator('input[role="switch"]:checked').first()
  const unchecked = preview.locator('input[role="switch"]:not(:checked)').first()

  await expect(checked).toHaveCSS('background-position', '100% 50%')
  await expect(unchecked).toHaveCSS('background-position', '0% 50%')
  await preview.evaluate((element) => element.setAttribute('dir', 'rtl'))
  await expect(checked).toHaveCSS('background-position', '0% 50%')
  await expect(unchecked).toHaveCSS('background-position', '100% 50%')
})

test('Card action stays on the inline end edge', async ({ page }) => {
  await page.goto('/docs/components/card')
  const preview = page.locator('[data-component-demo="Card"]')
  const card = preview.getByLabel('Native popups card')
  const action = card.getByRole('button', { name: 'Card options' })

  const [ltrCardBox, ltrActionBox] = await Promise.all([card.boundingBox(), action.boundingBox()])
  expect(ltrCardBox).not.toBeNull()
  expect(ltrActionBox).not.toBeNull()
  expect(ltrCardBox!.x + ltrCardBox!.width - (ltrActionBox!.x + ltrActionBox!.width)).toBeLessThan(
    ltrActionBox!.x - ltrCardBox!.x,
  )

  await card.evaluate((element) => element.setAttribute('dir', 'rtl'))
  const rtlActionBox = await action.boundingBox()
  expect(rtlActionBox).not.toBeNull()
  expect(rtlActionBox!.x - ltrCardBox!.x).toBeLessThan(
    ltrCardBox!.x + ltrCardBox!.width - (rtlActionBox!.x + rtlActionBox!.width),
  )
})

test('Popover end placement follows the component direction', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/popover')
  const preview = page.locator('[data-component-demo="Popover"]')
  const trigger = preview.getByRole('button', { name: 'View activity' })
  const popover = preview.locator('#standard-details-popover')

  await trigger.click()
  await expect(popover).toBeVisible()
  const [ltrTriggerBox, ltrPopoverBox] = await Promise.all([
    trigger.boundingBox(),
    popover.boundingBox(),
  ])
  expect(ltrTriggerBox).not.toBeNull()
  expect(ltrPopoverBox).not.toBeNull()
  expect(ltrPopoverBox!.x).toBeGreaterThan(ltrTriggerBox!.x + ltrTriggerBox!.width / 2)
  await expect(popover).toHaveCSS('position-area', /self-x-end/)
  await page.keyboard.press('Escape')
  await expect(popover).toBeHidden()

  await preview.evaluate((element) => element.setAttribute('dir', 'rtl'))
  await trigger.click()
  await expect(popover).toBeVisible()
  const [rtlTriggerBox, rtlPopoverBox] = await Promise.all([
    trigger.boundingBox(),
    popover.boundingBox(),
  ])
  expect(rtlTriggerBox).not.toBeNull()
  expect(rtlPopoverBox).not.toBeNull()
  expect(rtlPopoverBox!.x + rtlPopoverBox!.width).toBeLessThan(
    rtlTriggerBox!.x + rtlTriggerBox!.width / 2,
  )
})

test('ContextMenu pointer placement follows inline start in RTL', async ({ page }) => {
  await page.goto('/docs/components/context-menu')
  const preview = page.locator('[data-component-demo="ContextMenu"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  const trigger = preview.getByText('Open the context menu anywhere in this area', { exact: true })
  const menu = preview.locator('#canvas-context-menu')
  const clickPosition = { x: 120, y: 40 }
  const triggerBox = await trigger.boundingBox()
  expect(triggerBox).not.toBeNull()

  await page.mouse.click(triggerBox!.x + clickPosition.x, triggerBox!.y + clickPosition.y, {
    button: 'right',
  })
  await expect(menu).toBeVisible()
  const ltrMenuBox = await menu.boundingBox()
  expect(ltrMenuBox).not.toBeNull()
  expect(Math.abs(ltrMenuBox!.x - (triggerBox!.x + clickPosition.x))).toBeLessThanOrEqual(2)
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()

  await preview.evaluate((element) => element.setAttribute('dir', 'rtl'))
  const rtlTriggerBox = await trigger.boundingBox()
  expect(rtlTriggerBox).not.toBeNull()
  await page.mouse.click(rtlTriggerBox!.x + clickPosition.x, rtlTriggerBox!.y + clickPosition.y, {
    button: 'right',
  })
  await expect(menu).toBeVisible()
  const rtlMenuBox = await menu.boundingBox()
  expect(rtlMenuBox).not.toBeNull()
  expect(
    Math.abs(rtlMenuBox!.x + rtlMenuBox!.width - (rtlTriggerBox!.x + clickPosition.x)),
  ).toBeLessThanOrEqual(2)
})

test('Dialog actions shrink-wrap at the footer end', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/dialog')
  const preview = page.locator('[data-component-demo="Dialog"]')
  await preview.getByRole('button', { name: 'Open medium dialog' }).click()
  const dialog = preview.locator('#rename-medium-dialog')
  await expect(dialog).toBeVisible()
  const footer = dialog.locator('footer')
  const group = footer.getByRole('group', { name: 'Rename component actions' })
  const [footerBox, groupBox] = await Promise.all([footer.boundingBox(), group.boundingBox()])
  expect(footerBox).not.toBeNull()
  expect(groupBox).not.toBeNull()
  expect(groupBox!.width).toBeLessThan(footerBox!.width)
  expect(Math.abs(groupBox!.x + groupBox!.width - (footerBox!.x + footerBox!.width))).toBeLessThan(
    24,
  )
  const widths = await group
    .getByRole('button')
    .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().width))
  expect(Math.abs(widths[0]! - widths[1]!)).toBeLessThanOrEqual(1)
})

test('Sheet sides follow the requested logical viewport edges', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/sheet')
  const preview = page.locator('[data-component-demo="Sheet"]')
  const viewportWidth = page.viewportSize()!.width

  await preview.getByRole('button', { name: 'Open end sheet' }).click()
  const endSheet = preview.locator('#end-settings-sheet')
  await expect(endSheet).toBeVisible()
  const ltrEndBox = await endSheet.boundingBox()
  expect(ltrEndBox).not.toBeNull()
  expect(Math.abs(ltrEndBox!.x + ltrEndBox!.width - viewportWidth)).toBeLessThanOrEqual(1)
  expect(ltrEndBox!.x).toBeGreaterThan(0)
  await page.keyboard.press('Escape')
  await expect(endSheet).toBeHidden()

  await preview.getByRole('button', { name: 'Open start sheet' }).click()
  const startSheet = preview.locator('#start-settings-sheet')
  await expect(startSheet).toBeVisible()
  const ltrStartBox = await startSheet.boundingBox()
  expect(ltrStartBox).not.toBeNull()
  expect(Math.abs(ltrStartBox!.x)).toBeLessThanOrEqual(1)
  expect(ltrStartBox!.x + ltrStartBox!.width).toBeLessThan(viewportWidth)
  await page.keyboard.press('Escape')
  await expect(startSheet).toBeHidden()

  await preview.evaluate((element) => element.setAttribute('dir', 'rtl'))

  await preview.getByRole('button', { name: 'Open start sheet' }).click()
  await expect(startSheet).toBeVisible()
  const rtlStartBox = await startSheet.boundingBox()
  expect(rtlStartBox).not.toBeNull()
  expect(Math.abs(rtlStartBox!.x + rtlStartBox!.width - viewportWidth)).toBeLessThanOrEqual(1)
  await page.keyboard.press('Escape')
  await expect(startSheet).toBeHidden()

  await preview.getByRole('button', { name: 'Open end sheet' }).click()
  await expect(endSheet).toBeVisible()
  const rtlEndBox = await endSheet.boundingBox()
  expect(rtlEndBox).not.toBeNull()
  expect(Math.abs(rtlEndBox!.x)).toBeLessThanOrEqual(1)
})

test('Bottom Drawer is pinned to the viewport bottom', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/drawer')
  const preview = page.locator('[data-component-demo="Drawer"]')
  await preview.getByRole('button', { name: 'Open bottom drawer' }).click()
  const drawer = preview.locator('#bottom-page-drawer')
  await expect(drawer).toBeVisible()
  await expect
    .poll(async () => {
      const box = await drawer.boundingBox()
      return box ? Math.abs(box.y + box.height - page.viewportSize()!.height) : Infinity
    })
    .toBeLessThanOrEqual(1)
  const box = await drawer.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.y).toBeGreaterThan(0)
})

test('Command stays out of layout while closed and reports empty results accurately', async ({
  page,
}) => {
  await page.goto('/docs/components/command')
  const preview = page.locator('[data-component-demo="Command"]')
  const dialog = preview.locator('dialog')
  const input = dialog.getByPlaceholder('Search commands…')

  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  await expect(dialog).toBeHidden()
  await preview.getByRole('button', { name: 'Open command menu' }).click()
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('option')).toHaveCount(3)
  await expect(dialog.getByText('No results.', { exact: true })).toBeHidden()

  await input.fill('does-not-exist')
  await expect(dialog.getByRole('option')).toHaveCount(0)
  await expect(dialog.getByText('No results.', { exact: true })).toBeVisible()
})

test('NavigationMenu anchors its native popover to the trigger', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/navigation-menu')
  const preview = page.locator('[data-component-demo="NavigationMenu"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  const trigger = preview.getByRole('button', { name: 'Components' })
  const content = preview.locator('[popover]')
  await trigger.click()
  await expect(content).toBeVisible()

  const [triggerBox, contentBox] = await Promise.all([trigger.boundingBox(), content.boundingBox()])
  expect(triggerBox).not.toBeNull()
  expect(contentBox).not.toBeNull()
  const contentBottom = contentBox!.y + contentBox!.height
  const triggerBottom = triggerBox!.y + triggerBox!.height
  expect(contentBottom <= triggerBox!.y + 1 || contentBox!.y >= triggerBottom - 1).toBe(true)
  expect(Math.abs(contentBox!.x - triggerBox!.x)).toBeLessThan(24)
})

test('preview controls theme each variable group independently', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'Computed-style regression runs once.')
  await page.goto('/docs/components/button')
  const preview = page.locator('[data-component-demo="Button"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  const button = preview
    .locator('[data-component-demo-canvas] button')
    .filter({ hasText: 'Primary' })
    .first()
  await expect(button).toBeVisible()

  await preview.getByLabel('Style preset').selectOption('rhea')
  for (const [label, value] of [
    ['Spacing theme', 'poster'],
    ['Radius theme', 'pill'],
    ['Typography theme', 'industrial'],
    ['Stroke theme', 'poster'],
    ['Elevation theme', 'poster'],
    ['Blur theme', 'hazy'],
    ['Motion theme', 'expressive'],
  ] as const) {
    await expect(preview.getByLabel(label)).toHaveValue(value)
  }
  await preview.getByLabel('Style preset').selectOption('vega')

  const read = () =>
    button.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        borderWidth: style.borderTopWidth,
        fontFamily: style.fontFamily,
        height: style.height,
        transitionDuration: style.transitionDuration,
      }
    })

  const initial = await read()
  await preview.getByLabel('Color theme').selectOption('violet')
  expect((await read()).backgroundColor).not.toBe(initial.backgroundColor)
  await preview.getByLabel('Spacing theme').selectOption('poster')
  expect((await read()).height).not.toBe(initial.height)
  await preview.getByLabel('Radius theme').selectOption('sharp')
  expect((await read()).borderRadius).not.toBe(initial.borderRadius)
  await preview.getByLabel('Typography theme').selectOption('mono')
  expect((await read()).fontFamily).not.toBe(initial.fontFamily)
  await preview.getByLabel('Stroke theme').selectOption('brutal')
  expect((await read()).borderWidth).not.toBe(initial.borderWidth)
  await preview.getByLabel('Motion theme').selectOption('instant')
  expect((await read()).transitionDuration).not.toBe(initial.transitionDuration)

  const initialShadow = await preview.evaluate((element) => getComputedStyle(element).boxShadow)
  await preview.getByLabel('Elevation theme').selectOption('poster')
  expect(await preview.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(
    initialShadow,
  )

  await page.goto('/docs/components/dialog')
  const dialogPreview = page.locator('[data-component-demo="Dialog"]')
  await expect(dialogPreview).toHaveAttribute('data-preview-ready', 'true')
  const dialog = dialogPreview.locator('dialog').first()
  const initialBlur = await dialog.evaluate(
    (element) => getComputedStyle(element, '::backdrop').backdropFilter,
  )
  await dialogPreview.getByLabel('Blur theme').selectOption('hazy')
  expect(
    await dialog.evaluate((element) => getComputedStyle(element, '::backdrop').backdropFilter),
  ).not.toBe(initialBlur)
})

test('selected tabs use the active elevation theme', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'Computed-style regression runs once.')
  await page.goto('/docs/components/tabs')
  const preview = page.locator('[data-component-demo="Tabs"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  const selectedTab = preview.getByRole('tab', { name: 'Overview' })
  await expect(selectedTab).toHaveAttribute('aria-selected', 'true')

  await preview.getByLabel('Elevation theme').selectOption('flat')
  const flatShadow = await selectedTab.evaluate((element) => getComputedStyle(element).boxShadow)
  await preview.getByLabel('Elevation theme').selectOption('poster')
  const posterShadow = await selectedTab.evaluate((element) => getComputedStyle(element).boxShadow)

  expect(posterShadow).not.toBe(flatShadow)
})
