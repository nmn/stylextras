/** Calls the newer Popover API source option while remaining compatible with older DOM typings. */
export function showPopoverWithSource(popover: HTMLElement, source?: HTMLElement) {
  const showPopover = popover.showPopover as (options?: { source?: HTMLElement }) => void
  if (!source) {
    showPopover.call(popover)
    return
  }

  try {
    showPopover.call(popover, { source })
  } catch {
    // Some engines support popovers but not yet the newer source option.
    showPopover.call(popover)
  }
}
