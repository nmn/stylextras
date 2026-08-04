import type { Locator, Page } from '@playwright/test'

export function componentPreview(page: Page, name?: string): Locator {
  return page.getByRole('region', {
    name: name ? `${name} live demo` : / live demo$/,
    exact: name !== undefined,
  })
}

export function componentCanvas(preview: Locator): Locator {
  return preview.locator(':scope > div')
}

export function referenceGallery(page: Page): Locator {
  return page.getByRole('region', { name: 'Reference slice', exact: true })
}

export function searchToggle(page: Page): Locator {
  return page.locator('#nd-nav').getByRole('button', { name: 'Search', exact: true })
}

export function typingWord(page: Page): Locator {
  return page
    .getByLabel(
      'The expressive, type-safe, composable, predictable, and themeable styling system for ambitious interfaces',
    )
    .locator(':scope > span[aria-hidden="true"] > span[aria-hidden="true"]')
}
