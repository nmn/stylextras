'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, type DialogProps } from './index'

export type DialogClientProps = Omit<DialogProps, 'open'> & {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

/** Optional controlled adapter. The default dialog entry remains server-renderable. */
export function DialogClient({
  defaultOpen = false,
  onClose,
  onKeyDownCapture,
  onOpenChange,
  open,
  ref,
  ...props
}: DialogClientProps) {
  const controlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = controlled ? open : internalOpen
  const dialogRef = useRef<HTMLDialogElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const setRefs = useCallback(
    (node: HTMLDialogElement | null) => {
      dialogRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const rememberInvoker = (event: Event) => {
      if (dialog.open) return
      const source = (event as Event & { source?: Element | null }).source
      const invoker = source instanceof HTMLElement ? source : document.activeElement
      if (invoker instanceof HTMLElement) restoreFocusRef.current = invoker
    }
    dialog.addEventListener('beforetoggle', rememberInvoker)
    return () => dialog.removeEventListener('beforetoggle', rememberInvoker)
  }, [])

  return (
    <Dialog
      ref={setRefs}
      onClose={(event) => {
        onClose?.(event)
        if (!controlled) setInternalOpen(false)
        onOpenChange?.(false)
        restoreFocusRef.current?.focus()
      }}
      onKeyDownCapture={(event) => {
        onKeyDownCapture?.(event)
        if (event.defaultPrevented || event.key !== 'Escape') return
        const nestedPopover = event.currentTarget.querySelector<HTMLElement>(
          '[popover]:popover-open',
        )
        if (!nestedPopover) return
        event.preventDefault()
        nestedPopover.hidePopover()
      }}
      {...props}
    />
  )
}
