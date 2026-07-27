import type { Ref, RefCallback } from 'react'

/** Assigns a ref and returns the React 19 cleanup for that assignment. */
export function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') {
    const cleanup = ref(node)
    if (typeof cleanup === 'function') return cleanup
    return node === null ? undefined : () => ref(null)
  }

  if (!ref) return undefined
  ref.current = node
  return node === null
    ? undefined
    : () => {
        if (ref.current === node) ref.current = null
      }
}

/** Composes object and callback refs while preserving React 19 callback cleanups. */
export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => assignRef(ref, node))
    return () => {
      for (let index = cleanups.length - 1; index >= 0; index -= 1) cleanups[index]?.()
    }
  }
}
