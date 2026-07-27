'use client'

import { type Ref, useEffect, useMemo, useRef } from 'react'
import { composeRefs } from '../internal/refs'

export type InterestOptions = {
  hideDelay?: number | undefined
  interactive?: boolean | undefined
  showDelay?: number | undefined
  target: string
}

/** Lazily installs the event bridge only when interest invokers are unavailable. */
export function useInterestInvoker<T extends HTMLElement>(
  externalRef: Ref<T> | undefined,
  { hideDelay = 120, interactive = false, showDelay = 500, target }: InterestOptions,
) {
  const ref = useRef<T>(null)

  const setRef = useMemo(() => composeRefs(ref, externalRef), [externalRef])

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
