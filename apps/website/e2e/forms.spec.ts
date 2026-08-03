import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/ui')
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible()
})

test('native Select preserves forms, validity, options, keyboard, and reset', async ({
  browserName,
  page,
}) => {
  const select = page.getByTestId('native-select')
  const form = page.getByTestId('select-form')

  await expect(select).toHaveValue('')
  const supportsUserInvalid = await page.evaluate(() => CSS.supports('selector(:user-invalid)'))
  if (supportsUserInvalid) {
    expect(await select.evaluate((node) => node.matches(':user-invalid'))).toBe(false)
  }
  expect(await select.evaluate((node: HTMLSelectElement) => node.checkValidity())).toBe(false)
  await expect(select.locator('optgroup')).toHaveCount(2)
  await expect(select.locator('option[value="lhr"]')).toBeDisabled()

  await form.getByRole('button', { name: 'Submit select' }).click()
  await expect(page.getByTestId('select-result')).toHaveText('')
  if (supportsUserInvalid) {
    expect(await select.evaluate((node) => node.matches(':user-invalid'))).toBe(true)
  }

  await select.selectOption('pdx')
  await form.getByRole('button', { name: 'Submit select' }).click()
  await expect(page.getByTestId('select-result')).toHaveText('pdx')

  await form.getByRole('button', { name: 'Reset' }).click()
  await expect(select).toHaveValue('')

  await select.focus()
  await page.keyboard.press('p')
  await expect(select).toHaveValue('pdx')

  const supportsCustomizableSelect = await page.evaluate(() =>
    CSS.supports('appearance', 'base-select'),
  )
  if (browserName === 'chromium' && supportsCustomizableSelect) {
    await expect
      .poll(() => select.evaluate((node) => getComputedStyle(node).appearance))
      .toBe('base-select')
  }
})

test('Combobox filters, exposes active descendant, selects, submits, escapes, and resets', async ({
  page,
}) => {
  const input = page.getByTestId('combobox-input')
  const content = page.getByTestId('combobox-content')
  const listbox = content.locator('[role="listbox"]')
  const empty = content.getByText('No results found.')

  await expect(input).toHaveValue('React')
  await expect(content).toHaveAttribute('popover', 'auto')
  await expect(input).toHaveAttribute('aria-controls', (await listbox.getAttribute('id')) as string)
  await expect(input).not.toHaveAttribute('aria-activedescendant')
  await expect(listbox.locator('[aria-selected="true"]')).toHaveCount(1)
  await expect(listbox.getByText('No results found.')).toHaveCount(0)
  await expect(empty.locator('xpath=parent::*')).not.toHaveRole('listbox')
  // A real pointer activation focuses on pointerdown. The list must open after
  // that gesture's native auto-popover light-dismiss processing has completed.
  await input.click()
  await page.waitForTimeout(150)
  await expect(content).toBeVisible()
  await page.waitForTimeout(150)
  await expect(content).toBeVisible()

  await input.fill('sv')
  const svelte = content.getByRole('option', { name: 'Svelte' })
  await expect(svelte).toBeVisible()
  expect(
    await svelte.evaluate((node) =>
      node.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true })),
    ),
  ).toBe(false)
  await expect(content.getByRole('option', { name: 'React', exact: true })).toBeHidden()
  await page.keyboard.press('ArrowDown')
  const activeId = await input.getAttribute('aria-activedescendant')
  expect(activeId).toBeTruthy()
  await expect(page.locator(`#${activeId}`)).toHaveText('Svelte')
  await page.keyboard.press('Enter')
  await expect(input).toHaveValue('Svelte')
  await expect(content).toBeHidden()
  await expect(input).not.toHaveAttribute('aria-activedescendant')

  await page.getByTestId('combobox-form').getByRole('button', { name: 'Submit combobox' }).click()
  await expect(page.getByTestId('combobox-result')).toHaveText('svelte')

  await input.fill('does-not-exist')
  await expect(empty).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(content).toBeHidden()
  await expect(input).toHaveValue('Svelte')
  await expect(input).not.toHaveAttribute('aria-activedescendant')

  await page.getByTestId('combobox-form').getByRole('button', { name: 'Reset' }).click()
  await expect(input).toHaveValue('React')
})

test('Combobox follows live DOM order and handles duplicate and disabled-only results', async ({
  page,
}) => {
  const input = page.getByTestId('combobox-input')
  const content = page.getByTestId('combobox-content')
  const listbox = content.getByRole('listbox')

  await input.click()
  await expect(content).toBeVisible()
  await expect(listbox.locator('[aria-selected="true"]')).toHaveCount(1)

  await listbox.evaluate((element) => {
    const last = element.lastElementChild
    if (last) element.prepend(last)
  })
  await input.press('Home')
  const reorderedActiveId = await input.getAttribute('aria-activedescendant')
  expect(reorderedActiveId).toBeTruthy()
  await expect(page.locator(`#${reorderedActiveId}`)).toHaveText('React legacy')

  await input.fill('ang')
  await expect(listbox.getByRole('option', { name: 'Angular' })).toBeVisible()
  await input.press('ArrowDown')
  await expect(input).not.toHaveAttribute('aria-activedescendant')
  await expect(content.getByText('No results found.')).toBeHidden()
  await expect(content.getByRole('status')).toHaveText('1 framework available.')
})

test('controlled Combobox preserves typing and resolves a value registered later', async ({
  page,
}) => {
  const input = page.getByTestId('controlled-combobox-input')
  await expect(input).toHaveValue('React')

  await input.fill('custom query')
  await expect(input).toHaveValue('custom query')
  // WebKit centers the popover when CSS anchor positioning is unavailable,
  // so the open empty state can legitimately cover these external fixture
  // controls. Dismiss the listbox before testing programmatic value changes.
  await input.press('Escape')
  await expect(input).toHaveAttribute('aria-expanded', 'false')
  await page.getByRole('button', { name: 'Select controlled React' }).click()
  await expect(input).toHaveValue('React')

  await page.getByRole('button', { name: 'Select deferred Vue' }).click()
  await expect(input).toHaveValue('')
  await page.getByRole('button', { name: 'Mount deferred Vue' }).click()
  await expect(input).toHaveValue('Vue')
})

test('Combobox closes and blocks programmatic selection when its root becomes disabled', async ({
  page,
}) => {
  const input = page.getByTestId('combobox-input')
  const content = page.getByTestId('combobox-content')
  const svelte = content.locator('[role="option"]').filter({ hasText: 'Svelte' })

  await input.click()
  await expect(content).toBeVisible()
  await page
    .getByTestId('toggle-combobox-disabled')
    .evaluate((button: HTMLButtonElement) => button.click())
  await expect(input).toBeDisabled()
  await expect(input).toHaveAttribute('aria-expanded', 'false')
  await expect(input).not.toHaveAttribute('aria-activedescendant')
  await expect(content).toBeHidden()

  await svelte.evaluate((option: HTMLElement) => option.click())
  await expect(input).toHaveValue('React')
  await expect(page.getByTestId('combobox-form').locator('input[name="framework"]')).toBeDisabled()

  await page.getByTestId('toggle-combobox-disabled').click()
  await expect(input).toBeEnabled()
  await expect(input).toHaveValue('React')
})

test('ColorSwatchPicker preserves per-option disabled state and defaults to the first enabled radio', async ({
  page,
}) => {
  const group = page.getByRole('group', { name: 'Harness accent color' })
  const disabled = group.getByRole('radio', { name: 'Unavailable gray' })
  const enabled = group.getByRole('radio', { name: 'Blue' })

  await expect(group).toBeVisible()
  await expect(disabled).toBeDisabled()
  await expect(disabled).not.toBeChecked()
  await expect(enabled).toBeEnabled()
  await expect(enabled).toBeChecked()
  await expect(enabled).toHaveAttribute('name', 'harnessAccent')
})

test('DatePicker submits and resets its canonical form value', async ({ page }) => {
  const form = page.getByTestId('date-form')
  const input = page.locator('#test-due-date')
  await expect(input).toHaveAttribute('type', 'date')
  await expect(input).toHaveAttribute('min', '2026-07-01')
  await expect(input).toHaveAttribute('max', '2026-08-31')
  await expect(input).toHaveValue('2026-07-11')
  await form.getByRole('button', { name: 'Submit date' }).click()
  await expect(page.getByTestId('date-result')).toHaveText('2026-07-11')

  await input.fill('2026-08-12')
  await form.getByRole('button', { name: 'Submit date' }).click()
  await expect(page.getByTestId('date-result')).toHaveText('2026-08-12')

  await input.fill('2026-06-30')
  expect(await input.evaluate((node: HTMLInputElement) => node.checkValidity())).toBe(false)

  await form.getByRole('button', { name: 'Reset' }).click()
  await expect(input).toHaveValue('2026-07-11')
  expect(await input.evaluate((node: HTMLInputElement) => node.checkValidity())).toBe(true)
})

test('DateRangePicker validates order, external form association, reset, and control refs', async ({
  page,
}) => {
  const form = page.getByTestId('date-range-form')
  const start = page.locator('#test-date-range-start')
  const end = page.locator('#test-date-range-end')
  const result = page.getByTestId('date-range-result')

  await expect(start).toHaveValue('2026-07-11')
  await expect(end).toHaveValue('2026-07-18')
  await expect(start).toHaveAttribute('form', 'test-date-range-form')
  await expect(end).toHaveAttribute('form', 'test-date-range-form')
  await expect(end).not.toHaveAttribute('aria-invalid')

  await form.getByRole('button', { name: 'Submit date range' }).click()
  await expect(result).toHaveText('2026-07-11|2026-07-18')

  await start.fill('2026-07-24')
  await expect(end).toHaveAttribute('aria-invalid', 'true')
  const errorId = await end.getAttribute('aria-errormessage')
  expect(errorId).toBeTruthy()
  await expect(page.locator(`#${errorId}`)).toHaveText(
    'Return date must be on or after departure date.',
  )
  expect(await end.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false)

  await end.fill('2026-07-25')
  await expect(end).not.toHaveAttribute('aria-invalid')
  await expect(end).not.toHaveAttribute('aria-errormessage')
  expect(await end.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(true)

  await form.getByRole('button', { name: 'Focus departure date' }).click()
  await expect(start).toBeFocused()

  await start.fill('')
  expect(await start.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false)
  await form.getByRole('button', { name: 'Reset date range' }).click()
  await expect(start).toHaveValue('2026-07-11')
  await expect(end).toHaveValue('2026-07-18')
  await expect(end).not.toHaveAttribute('aria-invalid')
  expect(await end.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(true)
})

test('FileTrigger keeps its labelled native input focusable, submittable, and resettable', async ({
  page,
}) => {
  const form = page.getByTestId('file-trigger-form')
  const input = page.getByLabel('Upload attachment')

  await expect(input).toHaveAttribute('type', 'file')
  await expect(input).toHaveAttribute('name', 'attachment')
  await expect(input).toBeVisible()
  const focusButton = form.getByRole('button', { name: 'Focus file input' })
  await focusButton.focus()
  await focusButton.press('Enter')
  await expect(input).toBeFocused()

  await input.setInputFiles({
    buffer: Buffer.from('native file input fixture'),
    mimeType: 'text/plain',
    name: 'fixture.txt',
  })
  await form.getByRole('button', { name: 'Submit attachment' }).click()
  await expect(page.getByTestId('file-trigger-result')).toHaveText('fixture.txt')

  await form.getByRole('button', { name: 'Reset attachment' }).click()
  expect(await input.evaluate((element: HTMLInputElement) => element.files?.length ?? -1)).toBe(0)
})

test('internal field wrappers merge descriptions, gate error relationships, and forward refs', async ({
  page,
}) => {
  const text = page.getByLabel('Project slug')
  const describedBy = (await text.getAttribute('aria-describedby'))?.split(/\s+/) ?? []
  const errorMessage = (await text.getAttribute('aria-errormessage'))?.split(/\s+/) ?? []
  expect(describedBy).toContain('external-text-help')
  expect(describedBy.some((id) => id.endsWith('-description'))).toBe(true)
  expect(errorMessage).toContain('external-text-error')
  expect(errorMessage.some((id) => id.endsWith('-error'))).toBe(true)
  await expect(text).toHaveAttribute('aria-invalid', 'true')

  const number = page.getByLabel('Retry count')
  await expect(number).toHaveAttribute('type', 'number')
  await expect(number).toHaveAttribute('aria-invalid', 'true')
  await expect(number).toHaveAttribute('aria-describedby', /-description/)
  await expect(number).toHaveAttribute('aria-errormessage', /-error/)
  await page.getByRole('button', { name: 'Focus retry count' }).click()
  await expect(number).toBeFocused()

  const search = page.getByLabel('Search documentation')
  await expect(search).toHaveAttribute('type', 'search')
  await expect(search).toHaveAttribute('aria-describedby', /-description/)
  await expect(search).not.toHaveAttribute('aria-errormessage')
})
