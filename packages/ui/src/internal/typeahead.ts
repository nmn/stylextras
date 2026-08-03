import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

const state = new WeakMap<HTMLElement, { query: string; updatedAt: number }>()

export const menuItemSelector =
  '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'

export function isDiscoverable(element: HTMLElement) {
  if (
    element.matches(':disabled') ||
    element.closest('[hidden], [aria-hidden="true"], [inert]') ||
    element.getClientRects().length === 0
  ) {
    return false
  }
  const computed = getComputedStyle(element)
  return (
    computed.display !== 'none' &&
    computed.visibility !== 'hidden' &&
    computed.visibility !== 'collapse'
  )
}

export function getDiscoverableItems(root: HTMLElement, selector = menuItemSelector) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(isDiscoverable)
}

export function getTypeaheadMatch(owner: HTMLElement, items: readonly HTMLElement[], key: string) {
  if (items.length === 0) return undefined
  const normalizedKey = key.toLocaleLowerCase()
  const now = Date.now()
  const previous = state.get(owner)
  const combined =
    previous && now - previous.updatedAt < 500 ? previous.query + normalizedKey : normalizedKey
  const query = Array.from(combined).every((character) => character === normalizedKey)
    ? normalizedKey
    : combined
  state.set(owner, { query, updatedAt: now })

  const activeIndex = items.indexOf(document.activeElement as HTMLElement)
  const ordered = [...items.slice(activeIndex + 1), ...items.slice(0, activeIndex + 1)]
  return ordered.find((item) => item.textContent?.trim().toLocaleLowerCase().startsWith(query))
}

export function isTypeaheadKey(event: KeyboardEvent | ReactKeyboardEvent) {
  return (
    event.key.length === 1 && event.key !== ' ' && !event.altKey && !event.ctrlKey && !event.metaKey
  )
}
