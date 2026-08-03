import type { Ref, RefCallback } from 'react'
import { assignRef as assignReactRef, type RefCleanup } from '../internal/refs'

export type FocusgroupValue =
  | 'menu'
  | 'menubar'
  | 'radiogroup'
  | 'tablist'
  | 'toolbar'
  | 'tree'
  | `${'menu' | 'menubar' | 'radiogroup' | 'tablist' | 'toolbar' | 'tree'} ${string}`

type FocusgroupAttributes = { focusgroup: string }
type FallbackRecord = {
  cleanup?: () => void
  persistent: boolean
  promise: Promise<void>
  refs: number
}

const fallbacks = new WeakMap<HTMLElement, FallbackRecord>()

function supportsFocusgroup() {
  return (
    typeof HTMLElement !== 'undefined' &&
    ('focusgroup' in HTMLElement.prototype || 'focusGroup' in HTMLElement.prototype)
  )
}

function loadFocusgroupFallback(node: HTMLElement, persistent: boolean) {
  const existing = fallbacks.get(node)
  if (existing) {
    if (persistent) existing.persistent = true
    return existing
  }

  const record: FallbackRecord = {
    persistent,
    refs: 0,
    promise: Promise.resolve(),
  }
  record.promise = import('@stylextras/ui/platform-polyfills/focusgroup-fallback').then(
    ({ installFocusgroupFallback }) => {
      if (record.persistent || record.refs > 0) {
        record.cleanup = installFocusgroupFallback(node)
      }
    },
    () => {
      fallbacks.delete(node)
    },
  )
  fallbacks.set(node, record)
  return record
}

export function focusgroupAttributes(value: FocusgroupValue): FocusgroupAttributes {
  return { focusgroup: value }
}

export function focusgroupProps<T extends HTMLElement = HTMLElement>(value: FocusgroupValue) {
  return {
    focusgroup: value,
    ref: attachFocusgroupPolyfill,
  } as { focusgroup: string; ref: Ref<T> }
}

export function focusgroupStartProps(isStart: boolean) {
  return isStart ? ({ focusgroupstart: '' } as Record<string, string>) : {}
}

export function focusgroupRef<T extends HTMLElement>(ref: Ref<T> | undefined): RefCallback<T> {
  return function setFocusgroupRef(node: T | null) {
    const cleanupRef = assignRef(ref, node)
    const detachFallback = attachFocusgroupPolyfill(node)
    return () => {
      detachFallback?.()
      cleanupRef?.()
    }
  }
}

/** Loads roving focus only in browsers that do not implement `focusgroup`. */
export function attachFocusgroupPolyfill(node: HTMLElement | null): (() => void) | undefined {
  if (!node || supportsFocusgroup()) return
  const record = loadFocusgroupFallback(node, false)
  record.refs += 1

  return () => {
    record.refs = Math.max(0, record.refs - 1)
    if (record.refs > 0 || record.persistent) return
    record.cleanup?.()
    fallbacks.delete(node)
  }
}

/** Resolves after the conditionally imported fallback is ready. */
export function ensureFocusgroupPolyfill(node: HTMLElement): Promise<void> | undefined {
  if (supportsFocusgroup()) return undefined
  const record = loadFocusgroupFallback(node, true)
  return record.promise
}

export function assignRef<T>(ref: Ref<T> | undefined, node: T | null): RefCleanup | undefined {
  return assignReactRef(ref, node)
}
