import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { componentCatalog } from '@stylextras/ui/catalog'

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
    const exampleCodeHeading = page.getByRole('heading', {
      name: 'Example code',
      exact: true,
    })
    await expect(exampleCodeHeading).toBeVisible()
    const exampleCode = exampleCodeHeading.locator('xpath=following-sibling::figure[1]')
    await expect(exampleCode.locator('pre')).toBeVisible()
    await expect(exampleCode).toContainText('export default function Example')
    await expect(page.getByRole('heading', { name: 'Anatomy', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'API reference', exact: true })).toBeVisible()
    await expect(page.getByText(`${entry.name}Props`, { exact: true }).first()).toBeVisible()
    await expect(page.locator('vite-error-overlay')).toHaveCount(0)

    const results = await new AxeBuilder({ page })
      .include(`[data-component-demo="${entry.name}"]`)
      .analyze()
    expect(results.violations, `${entry.export} axe results`).toEqual([])
  }

  expect(errors).toEqual([])
})

test('every component page fits a narrow viewport', async ({ browserName, page }) => {
  test.skip(
    browserName !== 'chromium',
    'The catalog layout crawl runs once; cross-engine narrow-layout behavior is covered on the verification route.',
  )
  test.setTimeout(180_000)
  await page.setViewportSize({ height: 844, width: 320 })

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

    const layout = await page.evaluate(() => {
      const viewportWidth = window.innerWidth
      const isClippedByAncestor = (element: HTMLElement) => {
        let ancestor = element.parentElement
        while (ancestor && ancestor !== document.body) {
          if (getComputedStyle(ancestor).overflowX !== 'visible') return true
          ancestor = ancestor.parentElement
        }
        return false
      }
      const offenders = Array.from(document.querySelectorAll<HTMLElement>('body *'))
        .map((element) => {
          const rect = element.getBoundingClientRect()
          const overflowX = getComputedStyle(element).overflowX
          return {
            clientWidth: element.clientWidth,
            clippedByAncestor: isClippedByAncestor(element),
            dataStyleSrc: element.dataset.styleSrc,
            left: Math.round(rect.left),
            overflowX,
            right: Math.round(rect.right),
            scrollWidth: element.scrollWidth,
            tagName: element.tagName,
            text: element.textContent?.trim().slice(0, 60),
          }
        })
        .filter(
          ({ clientWidth, clippedByAncestor, left, overflowX, right, scrollWidth }) =>
            !clippedByAncestor &&
            left >= -1 &&
            (right > viewportWidth + 1 ||
              (overflowX === 'visible' && scrollWidth > clientWidth + 1)),
        )
        .sort(
          (left, right) =>
            Math.max(right.right - viewportWidth, right.scrollWidth - right.clientWidth) -
            Math.max(left.right - viewportWidth, left.scrollWidth - left.clientWidth),
        )
        .slice(0, 8)
      return {
        offenders,
        overflow: document.documentElement.scrollWidth - viewportWidth,
      }
    })
    expect(
      layout.overflow,
      `${entry.export} horizontal overflow: ${JSON.stringify(layout)}`,
    ).toBeLessThanOrEqual(1)
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
  const items = carousel.locator('[role="group"][aria-roledescription="slide"]')
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

  const thumbLeft = (input: typeof checked) =>
    input.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element, '::after').left),
    )

  const ltrChecked = await thumbLeft(checked)
  const ltrUnchecked = await thumbLeft(unchecked)
  expect(ltrChecked).toBeGreaterThan(ltrUnchecked)
  await preview.evaluate((element) => element.setAttribute('dir', 'rtl'))
  const rtlChecked = await thumbLeft(checked)
  const rtlUnchecked = await thumbLeft(unchecked)
  expect(rtlChecked).toBeLessThan(rtlUnchecked)
})

test('Radio indicator follows the native checked state', async ({ page }) => {
  await page.goto('/docs/components/radio-group')
  const preview = page.locator('[data-component-demo="RadioGroup"]')
  const compact = preview.getByRole('radio', { name: 'Compact' })
  const defaultDensity = preview.getByRole('radio', { name: 'Default' })
  const indicatorOpacity = (radio: typeof compact) =>
    radio.evaluate((element) => getComputedStyle(element, '::after').opacity)

  await expect(defaultDensity).toBeChecked()
  expect(await indicatorOpacity(defaultDensity)).toBe('1')
  expect(await indicatorOpacity(compact)).toBe('0')

  await compact.check()
  await expect(compact).toBeChecked()
  expect(await indicatorOpacity(compact)).toBe('1')
  expect(await indicatorOpacity(defaultDensity)).toBe('0')
})

test('Card action stays on the inline end edge', async ({ page }) => {
  await page.goto('/docs/components/card')
  const preview = page.locator('[data-component-demo="Card"]')
  const card = preview.getByRole('article', { name: 'Native popups', exact: true })
  const action = card.getByRole('button', { name: 'Options for Native popups' })

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
  const triggerBox = await trigger.boundingBox()
  expect(triggerBox).not.toBeNull()
  const clickPosition = {
    x: Math.min(120, triggerBox!.width / 2),
    y: triggerBox!.height / 2,
  }

  await trigger.click({ button: 'right', position: clickPosition })
  await expect(menu).toBeVisible()
  const ltrMenuBox = await menu.boundingBox()
  expect(ltrMenuBox).not.toBeNull()
  expect(Math.abs(ltrMenuBox!.x - (triggerBox!.x + clickPosition.x))).toBeLessThanOrEqual(2)
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()

  await preview.evaluate((element) => element.setAttribute('dir', 'rtl'))
  const rtlTriggerBox = await trigger.boundingBox()
  expect(rtlTriggerBox).not.toBeNull()
  await trigger.click({ button: 'right', position: clickPosition })
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

test('Menubar keeps a keyboard-opened menu anchored to its trigger', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'Programmatic popover source positioning is checked once.')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/menubar')
  const preview = page.locator('[data-component-demo="Menubar"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  const trigger = preview.getByRole('menuitem', { name: 'File', exact: true })
  const menu = preview.locator('#file-menu')

  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(menu).toBeVisible()
  await expect(menu.getByRole('menuitem').first()).toBeFocused()

  const [triggerBox, menuBox] = await Promise.all([trigger.boundingBox(), menu.boundingBox()])
  expect(triggerBox).not.toBeNull()
  expect(menuBox).not.toBeNull()
  const opensAbove = menuBox!.y + menuBox!.height <= triggerBox!.y + 1
  const opensBelow = menuBox!.y >= triggerBox!.y + triggerBox!.height - 1
  expect(opensAbove || opensBelow).toBe(true)
  expect(menuBox!.x).toBeLessThan(triggerBox!.x + triggerBox!.width)
  expect(menuBox!.x + menuBox!.width).toBeGreaterThan(triggerBox!.x)
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
  const readShadow = () =>
    selectedTab.evaluate((element) => getComputedStyle(element).boxShadow)
  const initialShadow = await readShadow()

  await preview.getByLabel('Elevation theme').selectOption('flat')
  await expect.poll(readShadow).not.toBe(initialShadow)
  const flatShadow = await readShadow()
  await preview.getByLabel('Elevation theme').selectOption('poster')
  await expect.poll(readShadow).not.toBe(flatShadow)
})

test('docs Option states use blue highlights without tinting the picker surface', async ({
  browserName,
  page,
}) => {
  test.skip(browserName !== 'chromium', 'Customizable-select styling is checked once in Chromium.')
  await page.goto('/docs/components/select')
  const preview = page.locator('[data-component-demo="Select"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  await preview.getByLabel('Style preset').selectOption('docs')

  const readOptionTheme = () =>
    preview
      .locator('[data-component-demo-canvas] option')
      .first()
      .evaluate((option) => {
        const classNames = Array.from(option.classList)
        const cssText: string[] = []
        const visit = (rules: CSSRuleList) => {
          for (const rule of rules) {
            cssText.push(rule.cssText)
            if ('cssRules' in rule) visit((rule as CSSGroupingRule).cssRules)
          }
        }
        for (const sheet of document.styleSheets) visit(sheet.cssRules)

        const previewRoot = option.closest<HTMLElement>('[data-component-demo="Select"]')!
        const probe = document.createElement('div')
        previewRoot.append(probe)
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        const context = canvas.getContext('2d')!
        const serializeColor = (variable: string) => {
          probe.style.backgroundColor = `var(${variable})`
          return getComputedStyle(probe).backgroundColor
        }
        const resolveColor = (variable: string) => {
          context.clearRect(0, 0, 1, 1)
          context.fillStyle = serializeColor(variable)
          context.fillRect(0, 0, 1, 1)
          return Array.from(context.getImageData(0, 0, 1, 1).data)
        }
        const palette = {
          accent: resolveColor('--x4dxi9b'),
          brand: resolveColor('--x1kcb9w4'),
          controlHover: resolveColor('--x1cugl89'),
          secondary: resolveColor('--xeg5xua'),
          selection: resolveColor('--x1k61mgv'),
        }
        const pickerBackground = getComputedStyle(
          option.closest('select')!,
          '::picker(select)',
        ).backgroundColor
        const controlHover = serializeColor('--x1cugl89')
        probe.remove()

        return {
          controlHover,
          palette,
          pickerBackground,
          hasChecked: cssText.some((rule) =>
            classNames.some((name) => rule.includes(`.${name}:checked`)),
          ),
          hasFocus: cssText.some((rule) =>
            classNames.some((name) => rule.includes(`.${name}:focus`)),
          ),
          hasHover: cssText.some((rule) =>
            classNames.some((name) => rule.includes(`.${name}:hover`)),
          ),
        }
      })

  const light = await readOptionTheme()
  await preview.getByLabel('Appearance').selectOption('dark')
  const dark = await readOptionTheme()

  expect(light.palette.accent).toEqual([76, 119, 220, 255])
  expect(dark.palette.accent).toEqual([150, 179, 248, 255])

  const chroma = ([red, green, blue]: number[]) =>
    Math.max(red!, green!, blue!) - Math.min(red!, green!, blue!)
  const distance = (left: number[], right: number[]) =>
    Math.hypot(left[0]! - right[0]!, left[1]! - right[1]!, left[2]! - right[2]!)

  for (const result of [light, dark]) {
    expect(result).toMatchObject({ hasChecked: true, hasFocus: true, hasHover: true })
    expect(chroma(result.palette.brand)).toBeGreaterThan(40)
    expect(chroma(result.palette.controlHover)).toBeLessThanOrEqual(2)
    expect(chroma(result.palette.secondary)).toBeLessThanOrEqual(2)
    expect(chroma(result.palette.accent)).toBeGreaterThan(60)
    expect(result.palette.accent[1]).toBeGreaterThan(result.palette.accent[0]! + 20)
    expect(result.palette.accent[2]).toBeGreaterThan(result.palette.accent[0]! + 20)
    expect(result.palette.brand[0]).toBeGreaterThan(result.palette.brand[1]! + 20)
    expect(result.palette.brand[2]).toBeGreaterThan(result.palette.brand[1]! + 20)
    expect(distance(result.palette.brand, result.palette.accent)).toBeGreaterThan(45)
    expect(result.palette.selection[0]).toBeGreaterThan(result.palette.selection[1]! + 35)
    expect(result.palette.selection[2]).toBeGreaterThan(result.palette.selection[1]! + 35)
    expect(result.pickerBackground).toBe(result.controlHover)
  }
})

test('DropdownMenu follows the menu button keyboard contract', async ({ browserName, page }) => {
  test.skip(
    browserName !== 'chromium',
    'Keyboard behavior is checked once with the focusgroup polyfill.',
  )
  await page.goto('/docs/components/dropdown-menu')
  const preview = page.locator('[data-component-demo="DropdownMenu"]')
  await expect(preview).toHaveAttribute('data-preview-ready', 'true')
  await preview.getByLabel('Style preset').selectOption('docs')

  const trigger = preview.getByRole('button', { name: 'Actions' })
  const menu = preview.locator('[role="menu"]')
  const items = menu.locator('[role="menuitem"]')
  await expect(items).toHaveCount(4)
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')

  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(menu).toBeVisible()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  const triggerId = await trigger.getAttribute('id')
  expect(triggerId).toBeTruthy()
  await expect(menu).toHaveAttribute('aria-labelledby', triggerId!)
  await expect(items.nth(0)).toBeFocused()
  const focusedColors = await items.nth(0).evaluate((item) => {
    const previewRoot = item.closest<HTMLElement>('[data-component-demo="DropdownMenu"]')!
    const probe = document.createElement('div')
    previewRoot.append(probe)
    probe.style.backgroundColor = 'var(--x4dxi9b)'
    probe.style.color = 'var(--x5dx901)'
    const result = {
      accent: getComputedStyle(probe).backgroundColor,
      accentForeground: getComputedStyle(probe).color,
      background: getComputedStyle(item).backgroundColor,
      foreground: getComputedStyle(item).color,
    }
    probe.remove()
    return result
  })
  expect(focusedColors.background).toBe(focusedColors.accent)
  expect(focusedColors.foreground).toBe(focusedColors.accentForeground)
  const seriousAccessibilityViolations = async () => {
    const accessibility = await new AxeBuilder({ page })
      .include('[data-component-demo="DropdownMenu"] [role="menu"]')
      .analyze()
    return accessibility.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    )
  }
  expect(await seriousAccessibilityViolations()).toEqual([])

  await page.keyboard.press('ArrowDown')
  await expect(items.nth(1)).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(items.nth(2)).toBeFocused()
  await expect(items.nth(2)).toHaveAttribute('aria-disabled', 'true')
  await page.keyboard.press('Enter')
  await expect(menu).toBeVisible()

  await page.keyboard.press('a')
  await expect(items.nth(3)).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')

  await page.keyboard.press('ArrowUp')
  await expect(items.nth(3)).toBeFocused()
  await page.keyboard.press('Home')
  await expect(items.nth(0)).toBeFocused()
  await page.keyboard.press('End')
  await expect(items.nth(3)).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(menu).toBeHidden()
  await expect(trigger).toBeFocused()

  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(items.nth(0)).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()

  await page.keyboard.press('Space')
  await expect(items.nth(0)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(menu).toBeHidden()
  await expect(menu.locator(':focus')).toHaveCount(0)

  await preview.getByLabel('Appearance').selectOption('dark')
  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(items.nth(0)).toBeFocused()
  expect(await seriousAccessibilityViolations()).toEqual([])
  await page.keyboard.press('Escape')
})
