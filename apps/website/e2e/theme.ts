import { type Locator, type Page, expect } from '@playwright/test'

export async function openThemeSettings(page: Page): Promise<Locator> {
  const trigger = page.getByRole('button', { name: 'Customize website theme' })
  await expect(trigger).toBeVisible()
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Theme', exact: true })
  await expect(dialog).toBeVisible()
  return dialog
}

export async function closeThemeSettings(dialog: Locator) {
  await dialog.getByRole('button', { name: 'Close theme settings' }).click()
  await expect(dialog).toBeHidden()
}

export async function setWebsiteTheme(
  page: Page,
  selections: Partial<
    Record<
      | 'Appearance'
      | 'Blur theme'
      | 'Color theme'
      | 'Elevation theme'
      | 'Motion theme'
      | 'Radius theme'
      | 'Spacing theme'
      | 'Stroke theme'
      | 'Style preset'
      | 'Typography theme',
      string
    >
  >,
) {
  const dialog = await openThemeSettings(page)
  const appearance = dialog.getByLabel('Appearance')
  const setAppearance = async (value: string) => {
    const colorScheme = value === 'system' ? 'light dark' : value
    await expect(async () => {
      await appearance.selectOption(value)
      await expect(page.locator('html')).toHaveCSS('color-scheme', colorScheme)
    }).toPass()
  }

  if (selections.Appearance !== undefined) {
    await setAppearance(selections.Appearance)
  } else {
    const initialAppearance = await appearance.inputValue()
    await setAppearance(initialAppearance === 'light' ? 'dark' : 'light')
    await setAppearance(initialAppearance)
  }

  for (const [label, value] of Object.entries(selections)) {
    if (label === 'Appearance') continue
    if (value !== undefined) {
      const control = dialog.getByLabel(label)
      await control.selectOption(value)
      await expect(control).toHaveValue(value)
    }
  }
  await closeThemeSettings(dialog)
}
