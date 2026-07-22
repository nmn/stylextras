import { showPopoverWithSource } from '../platform-polyfills/popover-source'

const viewportBoundary = 8

/** Opens a context popover at logical, viewport-contained pointer coordinates. */
export function showContextMenuAt(
  menu: HTMLElement,
  source: HTMLElement,
  clientX: number,
  clientY: number,
) {
  const viewportWidth = document.documentElement.clientWidth
  const viewportHeight = document.documentElement.clientHeight
  const isRtl = source.matches(':dir(rtl)')
  const sourceBounds = source.getBoundingClientRect()
  const safeClientX = Number.isFinite(clientX)
    ? clientX
    : isRtl
      ? sourceBounds.right
      : sourceBounds.left
  const safeClientY = Number.isFinite(clientY) ? clientY : sourceBounds.bottom
  const desiredInlineStart = isRtl ? viewportWidth - safeClientX : safeClientX

  menu.style.setProperty('--context-menu-inline-start', `${desiredInlineStart}px`)
  menu.style.setProperty('--context-menu-block-start', `${safeClientY}px`)
  if (menu.matches(':popover-open')) menu.hidePopover()
  showPopoverWithSource(menu, source)

  const bounds = menu.getBoundingClientRect()
  const inlineStart = Math.min(
    Math.max(viewportBoundary, desiredInlineStart),
    Math.max(viewportBoundary, viewportWidth - bounds.width - viewportBoundary),
  )
  const blockStart = Math.min(
    Math.max(viewportBoundary, safeClientY),
    Math.max(viewportBoundary, viewportHeight - bounds.height - viewportBoundary),
  )
  menu.style.setProperty('--context-menu-inline-start', `${inlineStart}px`)
  menu.style.setProperty('--context-menu-block-start', `${blockStart}px`)
}
