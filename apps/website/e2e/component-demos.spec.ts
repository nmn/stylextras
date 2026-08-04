import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { componentCatalog } from '@stylextras/ui/catalog'
import { componentCanvas, componentPreview } from './locators'
import { closeThemeSettings, openThemeSettings, setWebsiteTheme } from './theme'

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

    const preview = componentPreview(page, entry.name)
    await expect(preview, `${entry.export} preview`).toBeVisible()
    await expect(preview, `${entry.export} inherited appearance`).toHaveCSS(
      'color-scheme',
      'light dark',
    )
    await expect(preview, `${entry.export} styled preview`).toHaveCSS('display', 'grid')
    await expect(
      preview.getByLabel('Style preset'),
      `${entry.export} local theme controls`,
    ).toHaveCount(0)
    await expect(
      componentCanvas(preview).locator(':scope > *').first(),
      `${entry.export} demo content`,
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Examples', exact: true })).toBeVisible()
    const exampleCode = page
      .getByRole('figure')
      .filter({ hasText: `${entry.name} example.tsx` })
      .first()
    await expect(exampleCode).toBeVisible()
    await expect(exampleCode.locator('pre')).toBeVisible()
    await expect(exampleCode).toContainText('export default function Example')
    await expect(exampleCode.locator('code > .line > span').first()).toHaveAttribute(
      'style',
      /--shiki-light:.+--shiki-dark:/,
    )
    await expect(page.getByRole('heading', { name: 'Anatomy', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'API reference', exact: true })).toBeVisible()
    await expect(page.getByText(`${entry.name}Props`, { exact: true }).first()).toBeVisible()
    await expect(page.locator('vite-error-overlay')).toHaveCount(0)

    const results = await new AxeBuilder({ page })
      .include(`section[aria-label="${entry.name} live demo"]`)
      .analyze()
    expect(results.violations, `${entry.export} axe results`).toEqual([])

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
    const preview = componentPreview(page, entry.name)
    await expect(preview, `${entry.export} preview`).toBeVisible()
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
  const preview = componentPreview(page, 'Accordion')
  const exclusiveItems = preview.locator('details[name="component-docs-accordion"]')
  const independentItem = preview.locator('details:not([name])')
  await expect(preview).toBeVisible()
  await expect(exclusiveItems).toHaveCount(3)
  await expect(independentItem).toHaveCount(1)
  await expect(preview.locator('summary')).toHaveCount(4)
  await expect(preview.locator('summary').first()).toHaveCSS('display', 'grid')
  await expect(preview.locator('summary').first()).toHaveCSS('list-style-type', 'none')
  await expect(preview.locator('summary span[aria-hidden="true"]')).toHaveCount(3)
  await expect(independentItem.locator('summary span[aria-hidden="true"]')).toHaveCount(0)

  const measure = () =>
    exclusiveItems.evaluateAll((items) => ({
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

test('Carousel uses real controls and native scroll snap across an extended example', async ({
  page,
}) => {
  await page.goto('/docs/components/carousel')
  const preview = componentPreview(page, 'Carousel')
  const carousel = preview.getByRole('region', { name: 'Browser API highlights' })
  const items = carousel.locator('[role="group"][aria-roledescription="slide"]')
  const previous = preview.getByRole('button', { name: 'Previous slide' })
  const next = preview.getByRole('button', { name: 'Next slide' })
  await expect(items).toHaveCount(10)
  const carouselId = await carousel.getAttribute('id')
  expect(carouselId).toBeTruthy()
  await expect(previous).toHaveAttribute('aria-controls', carouselId!)
  await expect(next).toHaveAttribute('aria-controls', carouselId!)
  await expect(previous).toBeDisabled()
  await expect(next).toBeEnabled()
  await expect(items.first()).toHaveAccessibleName('1 of 10: Native controls')
  await expect(items.last()).toHaveAccessibleName('10 of 10: StyleX themes')
  await expect(carousel).toHaveCSS('scroll-snap-type', /mandatory/)
  await expect(items.first()).toHaveCSS('scroll-snap-align', /start/)

  const initialScroll = await carousel.evaluate((element) => element.scrollLeft)
  await next.click()
  await expect
    .poll(() => carousel.evaluate((element) => element.scrollLeft))
    .not.toBe(initialScroll)
  await expect(previous).toBeEnabled()
})

test('ButtonGroup action choices are equal-width inline-grid tracks', async ({ page }) => {
  await page.goto('/docs/components/button-group')
  const preview = componentPreview(page, 'ButtonGroup')
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

test('Collapsible keeps a stable custom inline-start indicator', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/collapsible')
  const preview = componentPreview(page, 'Collapsible')
  const details = preview.locator('details')
  const trigger = details.locator('summary')
  const label = trigger.locator(':scope > span:not([aria-hidden])')
  const icon = trigger.locator(':scope > span[aria-hidden="true"]')
  await expect(details).not.toHaveAttribute('open', '')
  await expect(trigger).toHaveCSS('display', 'grid')
  await expect(icon).toHaveCount(1)
  await expect(icon).toHaveText('＋')
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
  expect(iconBox!.x + iconBox!.width).toBeLessThanOrEqual(labelBox!.x)
  await trigger.click()
  await expect(details).toHaveAttribute('open', '')
  const [openDetailsBox, openTriggerBox] = await Promise.all([
    details.boundingBox(),
    trigger.boundingBox(),
  ])
  expect(Math.abs(openDetailsBox!.width - closedDetailsBox!.width)).toBeLessThanOrEqual(0.1)
  expect(Math.abs(openTriggerBox!.width - closedTriggerBox!.width)).toBeLessThanOrEqual(0.1)
  await details.evaluate((element) => {
    element.setAttribute('dir', 'rtl')
  })
  const [rtlLabelBox, rtlIconBox] = await Promise.all([label.boundingBox(), icon.boundingBox()])
  expect(rtlLabelBox).not.toBeNull()
  expect(rtlIconBox).not.toBeNull()
  expect(rtlIconBox!.x).toBeGreaterThanOrEqual(rtlLabelBox!.x + rtlLabelBox!.width)
})

test('ScrollArea exposes stable and thin overlay scrollbar modes', async ({
  browserName,
  page,
}) => {
  await page.goto('/docs/components/scroll-area')
  const preview = componentPreview(page, 'ScrollArea')
  const stable = preview.getByLabel('Stable release history')
  const overlay = preview.getByLabel('Overlay release history')

  await expect(stable).toHaveCSS('scrollbar-gutter', 'stable')
  await expect(overlay).toHaveCSS('scrollbar-gutter', 'auto')

  if (browserName === 'chromium') {
    await expect(overlay).toHaveCSS('scrollbar-width', 'thin')
    const scrollbarWidths = await Promise.all(
      [stable, overlay].map((area) =>
        area.evaluate((element) => getComputedStyle(element, '::-webkit-scrollbar').width),
      ),
    )
    expect(scrollbarWidths).toEqual(['14px', '6px'])
  }
})

test('TableOfContents renders real outline nesting and active location semantics', async ({
  page,
}) => {
  await page.goto('/docs/components/table-of-contents')
  const preview = componentPreview(page, 'TableOfContents')
  const toc = preview.getByRole('navigation', { name: 'On this page' })
  const topLevelList = toc.locator(':scope > ol')
  const active = toc.getByRole('link', { name: 'Overview' })

  await expect(topLevelList.locator(':scope > li')).toHaveCount(3)
  await expect(toc.locator('ol')).toHaveCount(2)
  await expect(active).toHaveAttribute('aria-current', 'location')
  await expect(
    toc.getByRole('link', { name: 'Examples' }).locator('xpath=../parent::ol/parent::li'),
  ).toContainText('Usage')
})

test('Switch thumb position follows the inline axis', async ({ page }) => {
  await page.goto('/docs/components/switch')
  const preview = componentPreview(page, 'Switch')
  const checked = preview.locator('input[role="switch"]:checked').first()
  const unchecked = preview.locator('input[role="switch"]:not(:checked)').first()

  const thumbLeft = (input: typeof checked) =>
    input.evaluate((element) => Number.parseFloat(getComputedStyle(element, '::after').left))

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
  const preview = componentPreview(page, 'RadioGroup')
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
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/card')
  const preview = componentPreview(page, 'Card')
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
  const preview = componentPreview(page, 'Popover')
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
  const preview = componentPreview(page, 'ContextMenu')
  const trigger = preview.getByText('Open the context menu anywhere in this area', { exact: true })
  const menu = preview.locator('#canvas-context-menu')
  const triggerBox = await trigger.boundingBox()
  expect(triggerBox).not.toBeNull()
  const clickPosition = {
    x: Math.min(120, triggerBox!.width / 2),
    y: triggerBox!.height / 2,
  }
  const openAt = () => trigger.click({ button: 'right', position: clickPosition })

  await openAt()
  await expect(menu).toBeVisible()
  const ltrMenuBox = await menu.boundingBox()
  expect(ltrMenuBox).not.toBeNull()
  expect(Math.abs(ltrMenuBox!.x - (triggerBox!.x + clickPosition.x))).toBeLessThanOrEqual(2)
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()

  await preview.evaluate((element) => element.setAttribute('dir', 'rtl'))
  const rtlTriggerBox = await trigger.boundingBox()
  expect(rtlTriggerBox).not.toBeNull()
  await openAt()
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
  const preview = componentPreview(page, 'Dialog')
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

test('AnchoredDialog keeps native modal behavior while following its trigger', async ({
  browserName,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/anchored-dialog')
  const preview = componentPreview(page, 'AnchoredDialog')
  const trigger = preview.getByRole('button', { name: 'View options' })
  const dialog = page.getByRole('dialog', { name: 'View options' })

  await trigger.focus()
  await trigger.click()
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveJSProperty('open', true)
  await expect(dialog).toMatchAriaSnapshot(`
    - dialog "View options":
      - heading "View options" [level=2]
      - paragraph: Adjust how this project is displayed.
      - text: Density
      - combobox "Density":
        - option "Compact"
        - option "Comfortable" [selected]
        - option "Spacious"
      - paragraph: The setting applies to every project view.
      - group "View option actions":
        - button "Cancel"
        - button "Apply"
  `)
  await expect.poll(() => dialog.evaluate((element) => element.matches(':modal'))).toBe(true)

  const [triggerBox, dialogBox] = await Promise.all([trigger.boundingBox(), dialog.boundingBox()])
  expect(triggerBox).not.toBeNull()
  expect(dialogBox).not.toBeNull()
  const placedBelowTrigger = dialogBox!.y >= triggerBox!.y + triggerBox!.height - 1
  const placedAboveTrigger = dialogBox!.y + dialogBox!.height <= triggerBox!.y + 1
  const overlapsTriggerInline =
    dialogBox!.x <= triggerBox!.x + triggerBox!.width &&
    dialogBox!.x + dialogBox!.width >= triggerBox!.x
  const placedAgainstTrigger = (placedBelowTrigger || placedAboveTrigger) && overlapsTriggerInline
  if (browserName === 'chromium') expect(placedAgainstTrigger).toBe(true)
  if (placedAgainstTrigger) {
    const triggerInlineEnd = triggerBox!.x + triggerBox!.width
    const dialogInlineEnd = dialogBox!.x + dialogBox!.width
    expect(Math.abs(dialogInlineEnd - triggerInlineEnd)).toBeLessThanOrEqual(2)
  } else {
    const viewport = page.viewportSize()!
    expect(Math.abs(dialogBox!.x + dialogBox!.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(
      2,
    )
    expect(
      Math.abs(dialogBox!.y + dialogBox!.height / 2 - viewport.height / 2),
    ).toBeLessThanOrEqual(2)
  }

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('Sheet sides follow the requested logical viewport edges', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/sheet')
  const preview = componentPreview(page, 'Sheet')
  await expect(preview).toHaveCSS('display', 'grid')
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
  const preview = componentPreview(page, 'Drawer')
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
  const preview = componentPreview(page, 'Command')
  const dialog = preview.locator('dialog')
  const input = dialog.getByPlaceholder('Search commands…')

  await expect(dialog).toBeHidden()
  await preview.getByRole('button', { name: 'Open command menu' }).click()
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('option')).toHaveCount(3)
  await expect(dialog.getByText('No results.', { exact: true })).toBeHidden()

  await input.fill('does-not-exist')
  await expect(dialog.getByRole('option')).toHaveCount(0)
  await expect(dialog.getByText('No results.', { exact: true })).toBeVisible()
})

test('Resizable exposes separator relationships and supports every input axis', async ({
  page,
}) => {
  await page.goto('/docs/components/resizable')
  const preview = componentPreview(page, 'Resizable')

  const horizontalRoot = preview.locator('#horizontal-resizable')
  const horizontalHandle = horizontalRoot.getByRole('separator', {
    name: 'Resize editor panels',
  })
  await expect(horizontalHandle).toHaveAttribute(
    'aria-controls',
    'editor-navigation editor-preview',
  )
  await expect(horizontalRoot.locator('#editor-navigation')).toHaveCount(1)
  await expect(horizontalRoot.locator('#editor-preview')).toHaveCount(1)
  await expect(horizontalHandle).toHaveAttribute('aria-orientation', 'vertical')
  await expect(horizontalHandle).toHaveAttribute('aria-valuemin', '10')
  await expect(horizontalHandle).toHaveAttribute('aria-valuemax', '90')
  await expect(horizontalHandle).toHaveAttribute('aria-valuenow', '38')
  await expect(horizontalHandle).toHaveAttribute('aria-valuetext', 'Navigation panel 38%')

  await horizontalHandle.focus()
  await page.keyboard.press('ArrowRight')
  await expect(horizontalHandle).toHaveAttribute('aria-valuenow', '40')
  await page.keyboard.press('Shift+ArrowRight')
  await expect(horizontalHandle).toHaveAttribute('aria-valuenow', '50')
  await page.keyboard.press('ArrowLeft')
  await expect(horizontalHandle).toHaveAttribute('aria-valuenow', '48')
  await page.keyboard.press('Shift+ArrowLeft')
  await expect(horizontalHandle).toHaveAttribute('aria-valuenow', '38')
  await page.keyboard.press('Home')
  await expect(horizontalHandle).toHaveAttribute('aria-valuenow', '10')
  await page.keyboard.press('End')
  await expect(horizontalHandle).toHaveAttribute('aria-valuenow', '90')

  const dragTo = async (
    handle: typeof horizontalHandle,
    root: typeof horizontalRoot,
    ratio: number,
    axis: 'horizontal' | 'vertical',
  ) => {
    await handle.scrollIntoViewIfNeeded()
    const [handleBox, rootBox] = await Promise.all([handle.boundingBox(), root.boundingBox()])
    expect(handleBox).not.toBeNull()
    expect(rootBox).not.toBeNull()
    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2)
    await page.mouse.down()
    await page.mouse.move(
      axis === 'horizontal' ? rootBox!.x + rootBox!.width * ratio : rootBox!.x + rootBox!.width / 2,
      axis === 'vertical' ? rootBox!.y + rootBox!.height * ratio : rootBox!.y + rootBox!.height / 2,
      { steps: 3 },
    )
    await page.mouse.up()
  }

  await dragTo(horizontalHandle, horizontalRoot, 0.64, 'horizontal')
  await expect(horizontalHandle).toHaveAttribute('aria-valuenow', '64')
  await expect(horizontalHandle).toHaveAttribute('aria-valuetext', 'Navigation panel 64%')

  const rtlRoot = preview.locator('#rtl-resizable')
  const rtlHandle = rtlRoot.getByRole('separator', { name: 'Resize RTL panels' })
  await expect(rtlHandle).toHaveAttribute('aria-orientation', 'vertical')
  await expect(rtlHandle).toHaveAttribute('aria-valuemin', '20')
  await expect(rtlHandle).toHaveAttribute('aria-valuemax', '80')
  await expect(rtlHandle).toHaveAttribute('aria-valuenow', '50')
  await expect(rtlHandle).toHaveAttribute('aria-valuetext', '50%')

  await rtlHandle.focus()
  await page.keyboard.press('ArrowLeft')
  await expect(rtlHandle).toHaveAttribute('aria-valuenow', '52')
  await page.keyboard.press('ArrowRight')
  await expect(rtlHandle).toHaveAttribute('aria-valuenow', '50')
  await dragTo(rtlHandle, rtlRoot, 0.25, 'horizontal')
  await expect(rtlHandle).toHaveAttribute('aria-valuenow', '75')

  const verticalRoot = preview.locator('#vertical-resizable')
  const verticalHandle = verticalRoot.getByRole('separator', {
    name: 'Resize stacked panels',
  })
  await expect(verticalHandle).toHaveAttribute('aria-controls', 'stacked-editor stacked-preview')
  await expect(verticalRoot.locator('#stacked-editor')).toHaveCount(1)
  await expect(verticalRoot.locator('#stacked-preview')).toHaveCount(1)
  await expect(verticalHandle).toHaveAttribute('aria-orientation', 'horizontal')
  await expect(verticalHandle).toHaveAttribute('aria-valuemin', '10')
  await expect(verticalHandle).toHaveAttribute('aria-valuemax', '90')
  await expect(verticalHandle).toHaveAttribute('aria-valuenow', '50')
  await expect(verticalHandle).toHaveAttribute('aria-valuetext', 'Top panel 50 percent')

  await verticalHandle.focus()
  await page.keyboard.press('ArrowUp')
  await expect(verticalHandle).toHaveAttribute('aria-valuenow', '48')
  await page.keyboard.press('Shift+ArrowDown')
  await expect(verticalHandle).toHaveAttribute('aria-valuenow', '58')
  await page.keyboard.press('Home')
  await expect(verticalHandle).toHaveAttribute('aria-valuenow', '10')
  await page.keyboard.press('End')
  await expect(verticalHandle).toHaveAttribute('aria-valuenow', '90')
  await dragTo(verticalHandle, verticalRoot, 0.35, 'vertical')
  await expect(verticalHandle).toHaveAttribute('aria-valuenow', '35')
  await expect(verticalHandle).toHaveAttribute('aria-valuetext', 'Top panel 35 percent')
})

test('NavigationMenu anchors its native popover to the trigger', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/navigation-menu')
  const preview = componentPreview(page, 'NavigationMenu')
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

  await content.getByRole('link', { name: 'Form controls' }).click()
  await expect(content).toBeHidden()
  await expect(page).toHaveURL(/#forms$/)
})

test('Menubar keeps a keyboard-opened menu anchored to its trigger', async ({
  browserName,
  page,
}) => {
  test.skip(browserName !== 'chromium', 'Programmatic popover source positioning is checked once.')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/docs/components/menubar')
  const preview = componentPreview(page, 'Menubar')
  const trigger = preview.getByRole('menuitem', { name: 'File', exact: true })
  const menu = preview.locator('#file-menu')

  await trigger.focus()
  await expect(async () => {
    await trigger.press('ArrowDown')
    await expect(menu).toBeVisible()
  }).toPass()
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

test('Menubar switches menus with wrapped, directional, typeahead, and pointer input', async ({
  page,
}) => {
  await page.goto('/docs/components/menubar')
  const preview = componentPreview(page, 'Menubar')
  const menubar = preview.getByRole('menubar', { name: 'Application menu' })
  const fileTrigger = menubar.getByRole('menuitem', { name: 'File', exact: true })
  const editTrigger = menubar.getByRole('menuitem', { name: 'Edit', exact: true })
  const viewTrigger = menubar.getByRole('menuitem', { name: 'View', exact: true })
  const fileMenu = preview.locator('#file-menu')
  const editMenu = preview.locator('#edit-menu')
  const viewMenu = preview.locator('#view-menu')

  await fileTrigger.focus()
  await expect(async () => {
    await fileTrigger.press('ArrowRight')
    await expect(editTrigger).toBeFocused()
  }).toPass()
  await page.keyboard.press('ArrowRight')
  await expect(viewTrigger).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(fileTrigger).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(viewTrigger).toBeFocused()

  await fileTrigger.focus()
  await page.keyboard.press('v')
  await expect(viewTrigger).toBeFocused()

  await menubar.evaluate((element) => element.setAttribute('dir', 'rtl'))
  await fileTrigger.focus()
  await page.keyboard.press('ArrowLeft')
  await expect(editTrigger).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(fileTrigger).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(viewTrigger).toBeFocused()
  await menubar.evaluate((element) => element.removeAttribute('dir'))

  await fileTrigger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(fileMenu).toBeVisible()
  await expect(fileMenu.getByRole('menuitem').first()).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(fileMenu).toBeHidden()
  await expect(editMenu).toBeVisible()
  await expect(editMenu.getByRole('menuitem').first()).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(editMenu).toBeHidden()
  await expect(viewMenu).toBeVisible()
  await expect(viewMenu.getByRole('menuitem').first()).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(viewMenu).toBeHidden()
  await expect(fileMenu).toBeVisible()
  await expect(fileMenu.getByRole('menuitem').first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(fileMenu).toBeHidden()
  await expect(fileTrigger).toBeFocused()

  await menubar.evaluate((element) => element.setAttribute('dir', 'rtl'))
  await page.keyboard.press('ArrowDown')
  await expect(fileMenu.getByRole('menuitem').first()).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(fileMenu).toBeHidden()
  await expect(editMenu).toBeVisible()
  await expect(editMenu.getByRole('menuitem').first()).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(editMenu).toBeHidden()
  await expect(fileMenu).toBeVisible()
  await expect(fileMenu.getByRole('menuitem').first()).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(fileMenu).toBeHidden()
  await expect(viewMenu).toBeVisible()
  await expect(viewMenu.getByRole('menuitem').first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(viewMenu).toBeHidden()
  await expect(viewTrigger).toBeFocused()
  await menubar.evaluate((element) => element.removeAttribute('dir'))

  await fileTrigger.click()
  await expect(fileMenu).toBeVisible()
  await fileTrigger.focus()
  await expect(fileTrigger).toBeFocused()
  await editTrigger.evaluate((element) => {
    document.documentElement.dataset.menubarEditClicks = '0'
    element.addEventListener('click', () => {
      const previous = Number(document.documentElement.dataset.menubarEditClicks ?? 0)
      document.documentElement.dataset.menubarEditClicks = String(previous + 1)
    })
  })
  await editTrigger.hover()
  await expect(fileMenu).toBeHidden()
  await expect(editMenu).toBeVisible()
  await expect(fileTrigger).toBeFocused()
  await expect(editTrigger).toHaveAttribute('aria-expanded', 'true')
  await expect(fileTrigger).toHaveAttribute('aria-expanded', 'false')
  await expect
    .poll(() =>
      page.evaluate(() => Number(document.documentElement.dataset.menubarEditClicks ?? 0)),
    )
    .toBe(0)
})

test('header theme dialog controls every variable group globally', async ({
  browserName,
  page,
}) => {
  test.skip(browserName !== 'chromium', 'Computed-style regression runs once.')
  await page.goto('/docs/components/button')
  const preview = componentPreview(page, 'Button')
  const button = componentCanvas(preview).locator('button').filter({ hasText: 'Primary' }).first()
  await expect(button).toBeVisible()

  const themeDialog = await openThemeSettings(page)
  await themeDialog.getByLabel('Style preset').selectOption('brutalist')
  await expect(themeDialog.getByLabel('Style preset')).toHaveValue('brutalist')
  for (const [label, value] of [
    ['Spacing theme', 'poster'],
    ['Radius theme', 'sharp'],
    ['Typography theme', 'industrial'],
    ['Stroke theme', 'block'],
    ['Elevation theme', 'poster'],
    ['Blur theme', 'crisp'],
    ['Motion theme', 'instant'],
  ] as const) {
    await expect(themeDialog.getByLabel(label)).toHaveValue(value)
  }
  await themeDialog.getByLabel('Style preset').selectOption('docs')
  await expect(themeDialog.getByLabel('Style preset')).toHaveValue('docs')
  await closeThemeSettings(themeDialog)

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
  await setWebsiteTheme(page, { 'Color theme': 'violet' })
  await expect
    .poll(() => read().then((value) => value.backgroundColor))
    .not.toBe(initial.backgroundColor)
  await setWebsiteTheme(page, { 'Spacing theme': 'poster' })
  await expect.poll(() => read().then((value) => value.height)).not.toBe(initial.height)
  await setWebsiteTheme(page, { 'Radius theme': 'sharp' })
  await expect.poll(() => read().then((value) => value.borderRadius)).not.toBe(initial.borderRadius)
  await setWebsiteTheme(page, { 'Typography theme': 'mono' })
  await expect.poll(() => read().then((value) => value.fontFamily)).not.toBe(initial.fontFamily)
  await setWebsiteTheme(page, { 'Stroke theme': 'brutal' })
  await expect.poll(() => read().then((value) => value.borderWidth)).not.toBe(initial.borderWidth)
  await setWebsiteTheme(page, { 'Motion theme': 'instant' })
  await expect
    .poll(() => read().then((value) => value.transitionDuration))
    .not.toBe(initial.transitionDuration)

  const initialShadow = await preview.evaluate((element) => getComputedStyle(element).boxShadow)
  await setWebsiteTheme(page, { 'Elevation theme': 'poster' })
  await expect
    .poll(() => preview.evaluate((element) => getComputedStyle(element).boxShadow))
    .not.toBe(initialShadow)

  await page.goto('/docs/components/dialog')
  const dialogPreview = componentPreview(page, 'Dialog')
  const dialog = dialogPreview.locator('dialog').first()
  const initialBlur = await dialog.evaluate(
    (element) => getComputedStyle(element, '::backdrop').backdropFilter,
  )
  await setWebsiteTheme(page, { 'Blur theme': 'hazy' })
  await expect
    .poll(() =>
      dialog.evaluate((element) => getComputedStyle(element, '::backdrop').backdropFilter),
    )
    .not.toBe(initialBlur)
})

test('selected tabs use the active elevation theme', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'Computed-style regression runs once.')
  await page.goto('/docs/components/tabs')
  const preview = componentPreview(page, 'Tabs')
  const selectedTab = preview.getByRole('tab', { name: 'Overview' })
  await expect(selectedTab).toHaveAttribute('aria-selected', 'true')
  const readShadow = () => selectedTab.evaluate((element) => getComputedStyle(element).boxShadow)
  const initialShadow = await readShadow()

  await setWebsiteTheme(page, { 'Elevation theme': 'flat' })
  await expect.poll(readShadow).not.toBe(initialShadow)
  const flatShadow = await readShadow()
  await setWebsiteTheme(page, { 'Elevation theme': 'poster' })
  await expect.poll(readShadow).not.toBe(flatShadow)
})

test('docs Option states use blue highlights without tinting the picker surface', async ({
  browserName,
  page,
}) => {
  test.skip(browserName !== 'chromium', 'Customizable-select styling is checked once in Chromium.')
  await page.goto('/docs/components/select')
  const preview = componentPreview(page, 'Select')
  await setWebsiteTheme(page, { 'Style preset': 'docs' })

  const readOptionTheme = () =>
    componentCanvas(preview)
      .locator('option')
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

        const previewRoot = option.closest<HTMLElement>('section[aria-label="Select live demo"]')!
        const probe = document.createElement('div')
        previewRoot.append(probe)
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        const context = canvas.getContext('2d')!
        const serializeColor = (value: string) => {
          probe.style.backgroundColor = value
          return getComputedStyle(probe).backgroundColor
        }
        const resolveColor = (value: string) => {
          context.clearRect(0, 0, 1, 1)
          context.fillStyle = serializeColor(value)
          context.fillRect(0, 0, 1, 1)
          return Array.from(context.getImageData(0, 0, 1, 1).data)
        }
        const palette = {
          accent: resolveColor('var(--color-fd-accent-foreground)'),
          brand: resolveColor('var(--color-fd-primary)'),
          controlHover: resolveColor('var(--color-fd-muted)'),
          secondary: resolveColor('var(--color-fd-secondary)'),
          selection: resolveColor('color-mix(in oklab, var(--color-fd-primary) 18%, transparent)'),
        }
        const pickerBackground = getComputedStyle(
          option.closest('select')!,
          '::picker(select)',
        ).backgroundColor
        const picker = resolveColor(pickerBackground)
        probe.remove()

        return {
          palette,
          picker,
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

  await setWebsiteTheme(page, { Appearance: 'light' })
  const light = await readOptionTheme()
  await setWebsiteTheme(page, { Appearance: 'dark' })
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
    expect(result.pickerBackground).not.toBe('rgba(0, 0, 0, 0)')
    expect(result.picker[3]).toBe(255)
    expect(chroma(result.picker)).toBeLessThanOrEqual(2)
  }
  expect(light.picker).not.toEqual(dark.picker)
})

test('DropdownMenu follows the menu button keyboard contract', async ({ browserName, page }) => {
  test.skip(
    browserName !== 'chromium',
    'Keyboard behavior is checked once with the focusgroup polyfill.',
  )
  await page.goto('/docs/components/dropdown-menu')
  const preview = componentPreview(page, 'DropdownMenu')
  await setWebsiteTheme(page, { 'Style preset': 'docs' })

  const trigger = preview.getByRole('button', { name: 'Actions' })
  const menu = preview.locator('[role="menu"]')
  const items = menu.locator('[role="menuitem"]')
  await expect(items).toHaveCount(4)
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')

  await trigger.focus()
  await expect(async () => {
    await trigger.press('ArrowDown')
    await expect(menu).toBeVisible()
  }).toPass()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  const triggerId = await trigger.getAttribute('id')
  expect(triggerId).toBeTruthy()
  await expect(menu).toHaveAttribute('aria-labelledby', triggerId!)
  await expect(items.nth(0)).toBeFocused()
  const focusedColors = await items.nth(0).evaluate((item) => {
    const previewRoot = item.closest<HTMLElement>('section[aria-label="DropdownMenu live demo"]')!
    const probe = document.createElement('div')
    previewRoot.append(probe)
    probe.style.backgroundColor = 'var(--color-fd-accent)'
    probe.style.color =
      'color-mix(in oklab, var(--color-fd-accent-foreground) 72%, var(--color-fd-foreground))'
    const result = {
      accent: getComputedStyle(probe).backgroundColor,
      accentText: getComputedStyle(probe).color,
      background: getComputedStyle(item).backgroundColor,
      foreground: getComputedStyle(item).color,
    }
    probe.remove()
    return result
  })
  expect(focusedColors.background).toBe(focusedColors.accent)
  expect(focusedColors.foreground).toBe(focusedColors.accentText)
  const seriousAccessibilityViolations = async () => {
    const accessibility = await new AxeBuilder({ page })
      .include('section[aria-label="DropdownMenu live demo"] [role="menu"]')
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

  await setWebsiteTheme(page, { Appearance: 'dark' })
  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(items.nth(0)).toBeFocused()
  expect(await seriousAccessibilityViolations()).toEqual([])
  await page.keyboard.press('Escape')
})
