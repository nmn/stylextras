'use client'

import { type Ref, useCallback, useEffect, useRef } from 'react'

export type InterestOptions = {
  hideDelay?: number | undefined
  interactive?: boolean | undefined
  showDelay?: number | undefined
  target: string
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

/** Lazily installs the event bridge only when interest invokers are unavailable. */
export function useInterestInvoker<T extends HTMLElement>(
  externalRef: Ref<T> | undefined,
  { hideDelay = 120, interactive = false, showDelay = 500, target }: InterestOptions,
) {
  const ref = useRef<T>(null)

  const setRef = useCallback(
    (node: T | null) => {
      ref.current = node
      assignRef(externalRef, node)
    },
    [externalRef],
  )

  useEffect(() => {
    const trigger = ref.current
    if (!trigger || 'interestForElement' in trigger) return
    const popover = document.getElementById(target)
    if (!(popover instanceof HTMLElement)) return
    let cancelled = false
    let removeFallback: (() => void) | undefined
    // A package self-import keeps this fallback as a consumer-owned async
    // chunk even though each published component subpath is built independently.
    void import('@stylextras/ui/platform-polyfills/interest-invoker-fallback').then(
      ({ installInterestInvokerFallback }) => {
        if (cancelled) return
        removeFallback = installInterestInvokerFallback(trigger, popover, {
          hideDelay,
          interactive,
          showDelay,
        })
      },
      () => {
        // Click activation remains native if the optional hover/focus bridge cannot load.
      },
    )
    return () => {
      cancelled = true
      removeFallback?.()
    }
  }, [hideDelay, interactive, showDelay, target])

  return setRef
}
