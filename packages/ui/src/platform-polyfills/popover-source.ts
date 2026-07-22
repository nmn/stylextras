const popoverSources = new WeakMap<HTMLElement, HTMLElement>()

/** Calls the newer Popover API source option while remaining compatible with older DOM typings. */
export function showPopoverWithSource(popover: HTMLElement, source?: HTMLElement) {
  const showPopover = popover.showPopover as (options?: { source?: HTMLElement }) => void
  if (!source) {
    showPopover.call(popover)
    return
  }

  popoverSources.set(popover, source)
  try {
    showPopover.call(popover, { source })
  } catch {
    // Some engines support popovers but not yet the newer source option.
    showPopover.call(popover)
  }
}

/** Returns the last explicit invoker supplied through the compatibility helper. */
export function getPopoverSource(popover: HTMLElement) {
  return popoverSources.get(popover)
}
