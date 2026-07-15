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

  await expect(input).toHaveValue('React')
  // A real pointer activation focuses on pointerdown. The list must open after
  // that gesture's native auto-popover light-dismiss processing has completed.
  await input.click()
  await page.waitForTimeout(150)
  await expect(content).toBeVisible()
  await page.waitForTimeout(150)
  await expect(content).toBeVisible()

  await input.fill('sv')
  await expect(content.getByRole('option', { name: 'Svelte' })).toBeVisible()
  await expect(content.getByRole('option', { name: 'React', exact: true })).toBeHidden()
  await page.keyboard.press('ArrowDown')
  const activeId = await input.getAttribute('aria-activedescendant')
  expect(activeId).toBeTruthy()
  await expect(page.locator(`#${activeId}`)).toHaveText('Svelte')
  await page.keyboard.press('Enter')
  await expect(input).toHaveValue('Svelte')
  await expect(content).toBeHidden()

  await page.getByTestId('combobox-form').getByRole('button', { name: 'Submit combobox' }).click()
  await expect(page.getByTestId('combobox-result')).toHaveText('svelte')

  await input.fill('does-not-exist')
  await expect(content.getByText('No results found.')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(content).toBeHidden()

  await page.getByTestId('combobox-form').getByRole('button', { name: 'Reset' }).click()
  await expect(input).toHaveValue('React')
})

test('DatePicker submits and resets its canonical form value', async ({ page }) => {
  const form = page.getByTestId('date-form')
  const input = page.locator('#test-due-date')
  await expect(input).toHaveValue(/Jul 11, 2026/)
  await form.getByRole('button', { name: 'Submit date' }).click()
  await expect(page.getByTestId('date-result')).toHaveText('2026-07-11')

  await input.click()
  const calendar = form.getByRole('grid', { name: /July 2026/ })
  await expect(calendar).toBeVisible()
  await calendar.getByRole('gridcell', { name: '12', exact: true }).click()
  await form.getByRole('button', { name: 'Submit date' }).click()
  await expect(page.getByTestId('date-result')).toHaveText('2026-07-12')

  await form.getByRole('button', { name: 'Reset' }).click()
  await expect(input).toHaveValue(/Jul 11, 2026/)
})
