'use client'

import { useEffect } from 'react'
import { supportsInvokerCommands } from '../internal/layer-support'
import { rememberDialogReturnFocus, restoreDialogReturnFocus } from './restore-focus'

type DialogCommandEvent = Event & {
  command?: unknown
  source?: unknown
}

/** Loads declarative invoker support only for browsers that do not provide it natively. */
export function useInvokerCommandFallback(target: string | undefined) {
  useEffect(() => {
    if (!target || supportsInvokerCommands()) return

    let cancelled = false
    let removeFallback: (() => void) | undefined
    void import('@stylextras/ui/platform-polyfills/invoker-command-fallback').then(
      ({ installInvokerCommandFallback }) => {
        if (!cancelled) removeFallback = installInvokerCommandFallback(target)
      },
      () => undefined,
    )

    return () => {
      cancelled = true
      removeFallback?.()
    }
  }, [target])
}

/** Adds legacy invoker behavior and consistent return-focus handling without rendering DOM. */
export function useDialogCommandBridge(target: string) {
  useInvokerCommandFallback(target)

  useEffect(() => {
    const dialog = document.getElementById(target)
    if (!(dialog instanceof HTMLDialogElement)) return

    const returnFocusRef: { current: HTMLElement | null } = { current: null }
    const handleCommand = (event: Event) => {
      const commandEvent = event as DialogCommandEvent
      if (commandEvent.command === 'show-modal') {
        rememberDialogReturnFocus(returnFocusRef, commandEvent.source as EventTarget | null)
      }
    }
    const handleClose = () => restoreDialogReturnFocus(dialog, returnFocusRef)

    dialog.addEventListener('command', handleCommand)
    dialog.addEventListener('close', handleClose)

    return () => {
      dialog.removeEventListener('command', handleCommand)
      dialog.removeEventListener('close', handleClose)
    }
  }, [target])
}
