function isBackdropPointer(dialog: HTMLDialogElement, event: PointerEvent) {
  if (event.target !== dialog) return false
  const bounds = dialog.getBoundingClientRect()
  return (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
}

function requestDialogClose(dialog: HTMLDialogElement) {
  const requestClose = (dialog as HTMLDialogElement & { requestClose?: () => void }).requestClose
  if (typeof requestClose === 'function') {
    requestClose.call(dialog)
    return
  }
  const cancelEvent = new Event('cancel', { cancelable: true })
  if (dialog.dispatchEvent(cancelEvent)) dialog.close()
}

/** Adds `closedby="any"` backdrop dismissal only when the native attribute is unavailable. */
export function installDialogClosedByFallback(dialog: HTMLDialogElement) {
  let backdropPointer: number | null = null
  const handlePointerDown = (event: PointerEvent) => {
    backdropPointer =
      event.isPrimary && event.button === 0 && isBackdropPointer(dialog, event)
        ? event.pointerId
        : null
  }
  const handlePointerUp = (event: PointerEvent) => {
    const shouldClose = backdropPointer === event.pointerId && isBackdropPointer(dialog, event)
    backdropPointer = null
    if (!shouldClose) return
    if (event.cancelable) event.preventDefault()
    requestDialogClose(dialog)
  }
  const clearBackdropPointer = () => {
    backdropPointer = null
  }

  dialog.addEventListener('pointerdown', handlePointerDown)
  dialog.addEventListener('pointerup', handlePointerUp)
  dialog.addEventListener('pointercancel', clearBackdropPointer)
  return () => {
    dialog.removeEventListener('pointerdown', handlePointerDown)
    dialog.removeEventListener('pointerup', handlePointerUp)
    dialog.removeEventListener('pointercancel', clearBackdropPointer)
  }
}
