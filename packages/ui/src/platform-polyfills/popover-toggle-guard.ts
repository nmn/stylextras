export type PopoverPointerToggleGuard = {
  capture: () => boolean
  clear: () => void
  consume: () => boolean
}

/** Preserves popover state across pointerdown light-dismiss and the later click. */
export function createPopoverPointerToggleGuard(
  getPopover: () => HTMLElement | null,
): PopoverPointerToggleGuard {
  let openAtPointerDown = false

  return {
    capture() {
      const popover = getPopover()
      openAtPointerDown =
        popover instanceof HTMLElement && popover.matches(':popover-open')
      return openAtPointerDown
    },
    clear() {
      openAtPointerDown = false
    },
    consume() {
      const wasOpen = openAtPointerDown
      openAtPointerDown = false
      return wasOpen
    },
  }
}
