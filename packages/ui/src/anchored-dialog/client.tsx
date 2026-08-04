'use client'

import { useEffect } from 'react'
import { useDialogCommandBridge } from '../dialog/use-command-bridge'
import { supportsDialogClosedBy } from '../internal/layer-support'

export type AnchoredDialogBridgeProps = {
  closedBy?: 'any' | 'closerequest' | 'none'
  target: string
}

/** Installs legacy behavior only when the browser lacks the corresponding native API. */
export function AnchoredDialogBridge({ closedBy = 'any', target }: AnchoredDialogBridgeProps) {
  useDialogCommandBridge(target)

  useEffect(() => {
    let cancelled = false
    let removeClosedByFallback: (() => void) | undefined

    if (closedBy === 'any' && !supportsDialogClosedBy()) {
      const dialog = document.getElementById(target)
      if (dialog instanceof HTMLDialogElement) {
        void import('@stylextras/ui/platform-polyfills/dialog-closedby-fallback').then(
          ({ installDialogClosedByFallback }) => {
            if (!cancelled) removeClosedByFallback = installDialogClosedByFallback(dialog)
          },
          () => undefined,
        )
      }
    }

    return () => {
      cancelled = true
      removeClosedByFallback?.()
    }
  }, [closedBy, target])

  return null
}
