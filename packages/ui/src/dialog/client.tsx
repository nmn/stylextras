'use client'

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { composeRefs } from '../internal/refs'
import { Dialog, type DialogProps } from './index'
import { rememberDialogReturnFocus, restoreDialogReturnFocus } from './restore-focus'

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

export type DialogClientProps = DistributiveOmit<DialogProps, 'open'> & {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export type DialogCommandBridgeProps = { target: string }

type DialogCommandEvent = Event & {
  command?: unknown
  source?: unknown
}

function supportsInvokerCommands() {
  if (typeof document === 'undefined') return true
  const button = document.createElement('button') as HTMLButtonElement & {
    command?: unknown
    commandForElement?: unknown
  }
  return typeof button.command === 'string' && button.commandForElement === null
}

function supportsDialogClosedBy() {
  return typeof HTMLDialogElement === 'undefined' || 'closedBy' in HTMLDialogElement.prototype
}

function getTopmostNestedPopover(dialog: HTMLDialogElement, openPopovers: HTMLElement[]) {
  for (let index = openPopovers.length - 1; index >= 0; index -= 1) {
    const popover = openPopovers[index]
    if (popover?.isConnected && dialog.contains(popover) && popover.matches(':popover-open')) {
      return popover
    }
  }

  const openInDomOrder = dialog.querySelectorAll<HTMLElement>('[popover]:popover-open')
  return openInDomOrder[openInDomOrder.length - 1]
}

/** Opt-in legacy bridge; supported browsers stay on the native command/commandfor path. */
export function DialogCommandBridge({ target }: DialogCommandBridgeProps) {
  useEffect(() => {
    if (supportsInvokerCommands()) return
    let cancelled = false
    let removeFallback: (() => void) | undefined
    void import('@stylextras/ui/platform-polyfills/invoker-command-fallback').then(
      ({ installInvokerCommandFallback }) => {
        if (cancelled) return
        removeFallback = installInvokerCommandFallback(target)
      },
      () => undefined,
    )

    return () => {
      cancelled = true
      removeFallback?.()
    }
  }, [target])

  return null
}

/** Optional controlled adapter. The default dialog entry remains server-renderable. */
export function DialogClient({
  closedBy = 'any',
  defaultOpen = false,
  onClose,
  onKeyDownCapture,
  onOpenChange,
  open,
  ref,
  id,
  ...props
}: DialogClientProps) {
  const controlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [nativeOpen, setNativeOpen] = useState(false)
  const isOpen = controlled ? open : internalOpen
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const lastReportedOpenRef = useRef(false)
  const expectedNativeStateRef = useRef<boolean | null>(null)
  const openPopoversRef = useRef<HTMLElement[]>([])

  const setRefs = useMemo(() => composeRefs(dialogRef, ref), [ref])

  const reconcileNativeState = useCallback(
    (nextOpen: boolean) => {
      if (expectedNativeStateRef.current === nextOpen) {
        expectedNativeStateRef.current = null
        lastReportedOpenRef.current = nextOpen
        setNativeOpen(nextOpen)
        return
      }
      if (lastReportedOpenRef.current === nextOpen) return
      lastReportedOpenRef.current = nextOpen
      setNativeOpen(nextOpen)
      if (!controlled) setInternalOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [controlled, onOpenChange],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    lastReportedOpenRef.current = dialog.open
    const handleToggle = () => reconcileNativeState(dialog.open)
    const handleClose = () => {
      reconcileNativeState(false)
      restoreDialogReturnFocus(dialog, returnFocusRef)
    }
    const handleCommand = (event: Event) => {
      const commandEvent = event as DialogCommandEvent
      if (commandEvent.command === 'show-modal') {
        rememberDialogReturnFocus(returnFocusRef, commandEvent.source as EventTarget | null)
      }
    }
    const handleCancel = (event: Event) => {
      queueMicrotask(() => {
        if (!event.defaultPrevented && dialogRef.current === dialog) {
          reconcileNativeState(dialog.open)
        }
      })
    }
    const handlePopoverBeforeToggle = (event: Event) => {
      const popover = event.target
      if (!(popover instanceof HTMLElement) || !popover.hasAttribute('popover')) return
      openPopoversRef.current = openPopoversRef.current.filter((item) => item !== popover)
      if ((event as ToggleEvent).newState === 'open') openPopoversRef.current.push(popover)
    }
    const handlePopoverToggle = (event: Event) => {
      const popover = event.target
      if (!(popover instanceof HTMLElement) || !popover.hasAttribute('popover')) return
      if ((event as ToggleEvent).newState === 'closed') {
        openPopoversRef.current = openPopoversRef.current.filter((item) => item !== popover)
      } else if (!openPopoversRef.current.includes(popover)) {
        openPopoversRef.current.push(popover)
      }
    }
    dialog.addEventListener('toggle', handleToggle)
    dialog.addEventListener('beforetoggle', handlePopoverBeforeToggle, true)
    dialog.addEventListener('toggle', handlePopoverToggle, true)
    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('cancel', handleCancel)
    dialog.addEventListener('command', handleCommand)
    return () => {
      dialog.removeEventListener('toggle', handleToggle)
      dialog.removeEventListener('beforetoggle', handlePopoverBeforeToggle, true)
      dialog.removeEventListener('toggle', handlePopoverToggle, true)
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('cancel', handleCancel)
      dialog.removeEventListener('command', handleCommand)
      openPopoversRef.current = []
    }
  }, [reconcileNativeState])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || closedBy !== 'any' || supportsDialogClosedBy()) return
    let cancelled = false
    let removeFallback: (() => void) | undefined
    void import('@stylextras/ui/platform-polyfills/dialog-closedby-fallback').then(
      ({ installDialogClosedByFallback }) => {
        if (!cancelled) removeFallback = installDialogClosedByFallback(dialog)
      },
      () => undefined,
    )
    return () => {
      cancelled = true
      removeFallback?.()
    }
  }, [closedBy])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || isOpen === dialog.open) return
    expectedNativeStateRef.current = isOpen
    if (isOpen) {
      rememberDialogReturnFocus(returnFocusRef)
      dialog.showModal()
    } else dialog.close()
    queueMicrotask(() => {
      if (dialogRef.current === dialog) reconcileNativeState(dialog.open)
    })
  }, [isOpen, nativeOpen, reconcileNativeState])

  return (
    <Fragment>
      <Dialog
        ref={setRefs}
        id={id}
        closedBy={closedBy}
        onClose={(event) => {
          onClose?.(event)
        }}
        onKeyDownCapture={(event) => {
          onKeyDownCapture?.(event)
          if (event.defaultPrevented || event.key !== 'Escape') return
          const nestedPopover = getTopmostNestedPopover(
            event.currentTarget,
            openPopoversRef.current,
          )
          if (!nestedPopover) return
          event.preventDefault()
          nestedPopover.hidePopover()
        }}
        {...props}
      />
      {id ? <DialogCommandBridge target={id} /> : null}
    </Fragment>
  )
}
