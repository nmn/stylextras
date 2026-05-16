'use client'

import * as React from 'react'

export type ReactComponent<Props = Record<string, never>> = React.ComponentType<Props>
export type LazyComponentLoader<Props = Record<string, never>> = () => Promise<
  ReactComponent<Props>
>

type LazyState<Props> = {
  loader: LazyComponentLoader<Props>
  promise: Promise<{ default: ReactComponent<Props> }> | null
}

export function useLazyComponent<Props>(loader: LazyComponentLoader<Props>) {
  const stateRef = React.useRef<LazyState<Props>>({ loader, promise: null })

  const load = React.useCallback(() => {
    if (stateRef.current.loader !== loader) {
      stateRef.current = { loader, promise: null }
    }

    stateRef.current.promise ??= loader().then((component) => ({ default: component }))
    return stateRef.current.promise
  }, [loader])

  const LazyContent = React.useMemo(() => React.lazy(load), [load])

  return {
    LazyContent,
    preload: load,
  }
}

export function showPopoverWithSource(element: HTMLElement, source: HTMLElement | null) {
  const showPopover = element.showPopover as (options?: { source?: HTMLElement }) => void
  showPopover.call(element, source ? { source } : undefined)
}
