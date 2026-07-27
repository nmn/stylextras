export type RequestedMenuFocus = 'first' | 'last' | 'none'

const requestedMenuFocus = new WeakMap<HTMLElement, RequestedMenuFocus>()

export function requestMenuFocus(menu: HTMLElement, focus: RequestedMenuFocus) {
  requestedMenuFocus.set(menu, focus)
}

export function takeRequestedMenuFocus(menu: HTMLElement) {
  const focus = requestedMenuFocus.get(menu)
  requestedMenuFocus.delete(menu)
  return focus
}
