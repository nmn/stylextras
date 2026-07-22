'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, type DialogProps } from './index'
import {
  rememberDialogReturnFocus,
  restoreDialogReturnFocus,
} from './restore-focus'

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

export type DialogClientProps = DistributiveOmit<DialogProps, 'open'> & {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export type DialogCommandBridgeProps = { target: string }

type PendingDialogCommand = {
  command: 'request-close' | 'show-modal'
  invoker: HTMLButtonElement
}

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

/** Opt-in legacy bridge; supported browsers stay on the native command/commandfor path. */
export function DialogCommandBridge({ target }: DialogCommandBridgeProps) {
  useEffect(() => {
    if (supportsInvokerCommands()) return
    let cancelled = false
    let removeFallback: (() => void) | undefined
    const pending: PendingDialogCommand[] = []
    const handlePendingClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      const eventTarget = event.target
      if (!(eventTarget instanceof Element)) return
      const invoker = eventTarget.closest<HTMLButtonElement>('button[command][commandfor]')
      if (!invoker || invoker.disabled || invoker.getAttribute('commandfor') !== target) return
      const command = invoker.getAttribute('command')
      if (command !== 'show-modal' && command !== 'request-close') return
      event.preventDefault()
      pending.push({ command, invoker })
    }

    document.addEventListener('click', handlePendingClick)
    void import('@stylextras/ui/platform-polyfills/invoker-command-fallback').then(
      ({ installInvokerCommandFallback, invokeDialogCommandFallback }) => {
        document.removeEventListener('click', handlePendingClick)
        if (cancelled) return
        removeFallback = installInvokerCommandFallback(target)
        for (const request of pending) {
          invokeDialogCommandFallback(target, request.invoker, request.command)
        }
      },
      () => document.removeEventListener('click', handlePendingClick),
    )

    return () => {
      cancelled = true
      document.removeEventListener('click', handlePendingClick)
      removeFallback?.()
    }
  }, [target])

  return null
}

/** Optional controlled adapter. The default dialog entry remains server-renderable. */
export function DialogClient({
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

  const setRefs = useCallback(
    (node: HTMLDialogElement | null) => {
      dialogRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

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
    dialog.addEventListener('toggle', handleToggle)
    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('cancel', handleCancel)
    dialog.addEventListener('command', handleCommand)
    return () => {
      dialog.removeEventListener('toggle', handleToggle)
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('cancel', handleCancel)
      dialog.removeEventListener('command', handleCommand)
    }
  }, [reconcileNativeState])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || isOpen === dialog.open) return
    expectedNativeStateRef.current = isOpen
    if (isOpen) {
      rememberDialogReturnFocus(returnFocusRef)
      dialog.showModal()
    }
    else dialog.close()
    queueMicrotask(() => {
      if (dialogRef.current === dialog) reconcileNativeState(dialog.open)
    })
  }, [isOpen, nativeOpen, reconcileNativeState])

  return (
    <Fragment>
      <Dialog
        ref={setRefs}
        id={id}
        onClose={(event) => {
          onClose?.(event)
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
      {id ? <DialogCommandBridge target={id} /> : null}
    </Fragment>
  )
}
