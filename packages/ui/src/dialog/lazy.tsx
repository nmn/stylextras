'use client'

import * as stylex from '@stylexjs/stylex'
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { Button, type AccessibleButtonPropsWithout } from '../button'
import {
  rememberDialogReturnFocus,
  restoreDialogReturnFocus,
} from './restore-focus'

export type LazyDialogContentProps = AccessibleAriaNameProps & {
  'aria-describedby'?: string
  id: string
}

export type LazyDialogModule<Props extends object = Record<string, never>> = {
  default: ComponentType<Props & LazyDialogContentProps>
}

export type LazyDialogProps<Props extends object = Record<string, never>> =
  AccessibleAriaNameProps & {
    'aria-describedby'?: string
    children: ReactNode
    contentProps: Props
    id: string
    load: () => Promise<LazyDialogModule<Props>>
    loadErrorLabel: string
    loadingLabel?: string
    onLoadError?: (error: unknown) => void
    preload?: 'intent' | 'none'
  }

type LazyDialogContextValue = {
  activate: (invoker: HTMLButtonElement) => void
  busy: boolean
  expanded: boolean
  mounted: boolean
  preload: () => void
  target: string
}

const LazyDialogContext = createContext<LazyDialogContextValue | null>(null)

class InvalidLazyDialogModuleError extends TypeError {}

function resolveLazyDialogComponent<Props extends object>(module: unknown) {
  const candidate =
    typeof module === 'object' && module !== null && 'default' in module
      ? module.default
      : undefined
  const isComponent =
    typeof candidate === 'function' ||
    (typeof candidate === 'object' && candidate !== null && '$$typeof' in candidate)
  if (!isComponent) {
    throw new InvalidLazyDialogModuleError('Lazy dialog loader must resolve a component default')
  }
  return candidate as ComponentType<Props & LazyDialogContentProps>
}

/**
 * A trigger-first dialog boundary. The loader and dialog DOM are both absent
 * from the initial render; intent fetches the module and activation mounts it.
 */
export function LazyDialog<Props extends object = Record<string, never>>({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  contentProps,
  id,
  load,
  loadErrorLabel,
  loadingLabel,
  onLoadError,
  preload: preloadMode = 'intent',
}: LazyDialogProps<Props>) {
  const aliveRef = useRef(true)
  const activationAttemptRef = useRef<symbol | null>(null)
  const loadedRef = useRef<ComponentType<Props & LazyDialogContentProps> | null>(null)
  const loadRef = useRef<Promise<ComponentType<Props & LazyDialogContentProps>> | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const [busy, setBusy] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [LoadedContent, setLoadedContent] = useState<
    ComponentType<Props & LazyDialogContentProps> | null
  >(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
    }
  }, [])

  const resetAfterFailure = useCallback(
    (error: unknown, announce: boolean) => {
      activationAttemptRef.current = null
      loadRef.current = null
      loadedRef.current = null
      if (!aliveRef.current) return
      setBusy(false)
      setExpanded(false)
      setLoadedContent(null)
      if (!announce) return
      setStatus(loadErrorLabel)
      onLoadError?.(error)
    },
    [loadErrorLabel, onLoadError],
  )

  const requestModule = useCallback(() => {
    if (loadedRef.current) return Promise.resolve(loadedRef.current)
    if (!loadRef.current) {
      const request = Promise.resolve()
        .then(load)
        .then((module) => {
          const Content = resolveLazyDialogComponent<Props>(module)
          loadedRef.current = Content
          return Content
        })
      loadRef.current = request
      void request.catch(() => {
        if (loadRef.current !== request) return
        loadRef.current = null
        loadedRef.current = null
      })
    }
    return loadRef.current
  }, [load])

  const preload = useCallback(() => {
    if (preloadMode === 'intent' && !LoadedContent) void requestModule().catch(() => undefined)
  }, [LoadedContent, preloadMode, requestModule])

  const activate = useCallback((invoker: HTMLButtonElement) => {
    rememberDialogReturnFocus(returnFocusRef, invoker)
    setStatus('')
    const activationAttempt = Symbol('lazy-dialog-activation')
    activationAttemptRef.current = activationAttempt
    if (LoadedContent) {
      const dialog = document.getElementById(id)
      if (!(dialog instanceof HTMLDialogElement)) {
        resetAfterFailure(
          new TypeError(`Lazy dialog content must render <dialog id="${id}">`),
          true,
        )
        return
      }
      activationAttemptRef.current = null
      setBusy(false)
      if (!dialog.open) dialog.showModal()
      setExpanded(dialog.open)
      return
    }
    setBusy(true)
    if (loadingLabel) setStatus(loadingLabel)
    if (loadedRef.current) {
      setLoadedContent(() => loadedRef.current)
      return
    }
    void requestModule()
      .then((Content) => {
        if (aliveRef.current && activationAttemptRef.current === activationAttempt) {
          setLoadedContent(() => Content)
        }
      })
      .catch((error: unknown) => {
        if (activationAttemptRef.current === activationAttempt) {
          resetAfterFailure(error, true)
        }
      })
  }, [LoadedContent, id, loadingLabel, requestModule, resetAfterFailure])

  useEffect(() => {
    if (!busy) return
    const cancelPendingOpen = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      activationAttemptRef.current = null
      setBusy(false)
      setStatus('')
    }
    document.addEventListener('keydown', cancelPendingOpen)
    return () => document.removeEventListener('keydown', cancelPendingOpen)
  }, [busy])

  useLayoutEffect(() => {
    if (!LoadedContent || activationAttemptRef.current === null) return
    const dialog = document.getElementById(id)
    if (!(dialog instanceof HTMLDialogElement)) {
      resetAfterFailure(
        new TypeError(`Lazy dialog content must render <dialog id="${id}">`),
        true,
      )
      return
    }
    activationAttemptRef.current = null
    setBusy(false)
    setStatus('')
    if (!dialog.open) dialog.showModal()
    setExpanded(dialog.open)
  }, [LoadedContent, id, resetAfterFailure])

  useEffect(() => {
    if (!LoadedContent) return
    const dialog = document.getElementById(id)
    if (!(dialog instanceof HTMLDialogElement)) return
    const handleClose = () => {
      setExpanded(false)
      restoreDialogReturnFocus(dialog, returnFocusRef)
    }
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [LoadedContent, id])

  const contentAccessibilityProps: LazyDialogContentProps =
    ariaLabel !== undefined
      ? {
          id,
          'aria-label': ariaLabel,
          ...(ariaDescribedBy === undefined ? {} : { 'aria-describedby': ariaDescribedBy }),
        }
      : {
          id,
          'aria-labelledby': ariaLabelledBy as string,
          ...(ariaDescribedBy === undefined ? {} : { 'aria-describedby': ariaDescribedBy }),
        }

  return (
    <LazyDialogContext
      value={{ activate, busy, expanded, mounted: LoadedContent !== null, preload, target: id }}
    >
      {children}
      <span
        id={`${id}-status`}
        aria-atomic="true"
        aria-live="polite"
        role="status"
        {...stylex.props(styles.status)}
      >
        {status}
      </span>
      {LoadedContent ? (
        <LoadedContent {...contentProps} {...contentAccessibilityProps} />
      ) : null}
    </LazyDialogContext>
  )
}

const styles = stylex.create({
  status: {
    borderWidth: 0,
    clipPath: 'inset(50%)',
    margin: -1,
    height: 1,
    padding: 0,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
})

export type LazyDialogTriggerProps = AccessibleButtonPropsWithout<
  'aria-busy' | 'aria-controls' | 'aria-expanded' | 'aria-haspopup'
>

export function LazyDialogTrigger({
  onClick,
  onFocus,
  onPointerDown,
  onPointerEnter,
  type = 'button',
  variant = 'outline',
  ...props
}: LazyDialogTriggerProps) {
  const context = use(LazyDialogContext)
  if (!context) throw new Error('LazyDialogTrigger must be rendered inside LazyDialog')

  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    onFocus?.(event)
    if (!event.defaultPrevented) context.preload()
  }
  const handlePointerIntent = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.type === 'pointerenter') onPointerEnter?.(event)
    else onPointerDown?.(event)
    if (!event.defaultPrevented) context.preload()
  }

  return (
    <Button
      {...props}
      type={type}
      variant={variant}
      aria-busy={context.busy || undefined}
      aria-controls={context.mounted ? context.target : undefined}
      aria-expanded={context.expanded}
      aria-haspopup="dialog"
      onFocus={handleFocus}
      onPointerDown={handlePointerIntent}
      onPointerEnter={handlePointerIntent}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.activate(event.currentTarget)
      }}
    />
  )
}
