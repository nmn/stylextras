import type { RefObject } from 'react'

export type DialogReturnFocusRef = RefObject<HTMLElement | null>

export function rememberDialogReturnFocus(
  returnFocusRef: DialogReturnFocusRef,
  target: EventTarget | null = document.activeElement,
) {
  if (target instanceof HTMLElement) returnFocusRef.current = target
}

export function restoreDialogReturnFocus(
  dialog: HTMLDialogElement,
  returnFocusRef: DialogReturnFocusRef,
) {
  const target = returnFocusRef.current
  returnFocusRef.current = null
  if (!target) return

  // WebKit keeps the closed dialog in the top layer through close-event microtasks.
  setTimeout(() => {
    if (dialog.open || !target.isConnected) return
    const ownerDocument = dialog.ownerDocument
    const activeElement = ownerDocument.activeElement
    const focusWasLost =
      activeElement === null ||
      activeElement === ownerDocument.body ||
      activeElement === ownerDocument.documentElement
    if (focusWasLost || activeElement === dialog || dialog.contains(activeElement)) {
      target.focus()
    }
  })
}
