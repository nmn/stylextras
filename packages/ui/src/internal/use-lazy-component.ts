'use client'

import { type ComponentType, useCallback, useEffect, useRef, useState } from 'react'

/** Caches a dynamic component request without mounting it until activation. */
export function useLazyComponent<Props extends object>(
  load: () => Promise<unknown>,
  invalidModuleMessage: string,
) {
  const alive = useRef(true)
  const loaded = useRef<ComponentType<Props> | null>(null)
  const pending = useRef<Promise<ComponentType<Props>> | null>(null)
  const [Component, setComponent] = useState<ComponentType<Props> | null>(null)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const request = useCallback(() => {
    if (loaded.current) return Promise.resolve(loaded.current)
    if (!pending.current) {
      const request = Promise.resolve()
        .then(load)
        .then((module) => {
          const candidate =
            typeof module === 'object' && module !== null && 'default' in module
              ? module.default
              : undefined
          const isComponent =
            typeof candidate === 'function' ||
            (typeof candidate === 'object' && candidate !== null && '$$typeof' in candidate)
          if (!isComponent) throw new TypeError(invalidModuleMessage)
          loaded.current = candidate as ComponentType<Props>
          return loaded.current
        })
      pending.current = request
      void request.catch(() => {
        if (pending.current !== request) return
        pending.current = null
        loaded.current = null
      })
    }
    return pending.current
  }, [invalidModuleMessage, load])

  const mount = useCallback((component: ComponentType<Props>) => {
    if (alive.current) setComponent(() => component)
  }, [])

  const reset = useCallback(() => {
    pending.current = null
    loaded.current = null
    if (alive.current) {
      setComponent(null)
      return true
    }
    return false
  }, [])

  const getLoaded = useCallback(() => loaded.current, [])

  return { Component, getLoaded, mount, request, reset }
}
