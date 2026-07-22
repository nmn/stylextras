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
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import {
  Button,
  type AccessibleButtonPropsWithout,
  type DistributiveOmit,
} from '../button'
import { showPopoverWithSource } from '../platform-polyfills/popover-source'
import { usePopoverPointerToggleGuard } from './pointer-toggle'

export type LazyPopoverContentProps = { id: string }
export type LazyPopoverInitialFocus = 'first' | 'last' | 'none'
export type LazyPopoverOpenOptions = {
  initialFocus?: LazyPopoverInitialFocus
  open?: (popover: HTMLElement) => void
  source?: HTMLElement
}
export type LazyPopoverModule<Props extends object = Record<string, never>> = {
  default: ComponentType<Props & LazyPopoverContentProps>
}
export type LazyPopoverProps<Props extends object = Record<string, never>> = {
  children: ReactNode
  contentProps: Props
  id: string
  initialFocus?: LazyPopoverInitialFocus
  load: () => Promise<LazyPopoverModule<Props>>
  loadErrorLabel: string
  loadingLabel?: string
  onLoadError?: (error: unknown) => void
  preload?: 'intent' | 'none'
}

export type LazyPopoverActions = {
  activate: (options?: LazyPopoverOpenOptions) => void
  busy: boolean
  expanded: boolean
  mounted: boolean
  preload: () => void
  target: string
}

const LazyPopoverContext = createContext<LazyPopoverActions | null>(null)

class InvalidLazyPopoverModuleError extends TypeError {}

function resolveLazyPopoverComponent<Props extends object>(module: unknown) {
  const candidate =
    typeof module === 'object' && module !== null && 'default' in module
      ? module.default
      : undefined
  const isComponent =
    typeof candidate === 'function' ||
    (typeof candidate === 'object' && candidate !== null && '$$typeof' in candidate)
  if (!isComponent) {
    throw new InvalidLazyPopoverModuleError('Lazy popover loader must resolve a component default')
  }
  return candidate as ComponentType<Props & LazyPopoverContentProps>
}

function isInitialFocusCandidate(item: HTMLElement) {
  if (
    item.hidden ||
    item.matches(':disabled, [aria-disabled="true"]') ||
    item.closest('[hidden], [aria-hidden="true"], [inert]')
  ) {
    return false
  }
  if (item.getClientRects().length === 0) return false
  const computed = getComputedStyle(item)
  return (
    computed.display !== 'none' &&
    computed.visibility !== 'hidden' &&
    computed.visibility !== 'collapse'
  )
}

/** Actions for specialized trigger components built on the lazy popover boundary. */
export function useLazyPopoverActions() {
  const context = use(LazyPopoverContext)
  if (!context) throw new Error('useLazyPopoverActions must be used inside LazyPopover')
  return context
}

export function LazyPopover<Props extends object = Record<string, never>>({
  children,
  contentProps,
  id,
  initialFocus = 'none',
  load,
  loadErrorLabel,
  loadingLabel,
  onLoadError,
  preload: preloadMode = 'intent',
}: LazyPopoverProps<Props>) {
  const aliveRef = useRef(true)
  const activationAttemptRef = useRef<symbol | null>(null)
  const activationOptionsRef = useRef<LazyPopoverOpenOptions>({ initialFocus })
  const loadedRef = useRef<ComponentType<Props & LazyPopoverContentProps> | null>(null)
  const loadRef = useRef<Promise<ComponentType<Props & LazyPopoverContentProps>> | null>(null)
  const [busy, setBusy] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [LoadedContent, setLoadedContent] = useState<
    ComponentType<Props & LazyPopoverContentProps> | null
  >(null)
  const [status, setStatus] = useState('')

  const focusInitialItem = useCallback(
    (popover: HTMLElement, focus: LazyPopoverInitialFocus) => {
      if (focus === 'none') return
      const items = Array.from(
        popover.querySelectorAll<HTMLElement>(
          '[role="menuitem"], [role="option"], [data-autofocus]',
        ),
      ).filter(isInitialFocusCandidate)
      const item = focus === 'last' ? items.at(-1) : items[0]
      item?.focus()
    },
    [],
  )

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
          const Content = resolveLazyPopoverComponent<Props>(module)
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

  const activate = useCallback(
    (options?: LazyPopoverOpenOptions) => {
      setStatus('')
      const activationAttempt = Symbol('lazy-popover-activation')
      activationAttemptRef.current = activationAttempt
      const activationOptions = {
        initialFocus: options?.initialFocus ?? initialFocus,
        ...(options?.open ? { open: options.open } : {}),
        ...(options?.source ? { source: options.source } : {}),
      }
      activationOptionsRef.current = activationOptions
      if (LoadedContent) {
        const popover = document.getElementById(id)
        if (!(popover instanceof HTMLElement) || !popover.hasAttribute('popover')) {
          resetAfterFailure(
            new TypeError(`Lazy popover content must render [popover]#${id}`),
            true,
          )
          return
        }
        activationAttemptRef.current = null
        setBusy(false)
        if (activationOptions.open) {
          activationOptions.open(popover)
        } else if (popover.matches(':popover-open')) {
          popover.hidePopover()
        } else {
          showPopoverWithSource(popover, activationOptions.source)
        }
        if (popover.matches(':popover-open')) {
          focusInitialItem(popover, activationOptions.initialFocus)
        }
        setExpanded(popover.matches(':popover-open'))
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
    },
    [
      LoadedContent,
      focusInitialItem,
      id,
      initialFocus,
      loadingLabel,
      requestModule,
      resetAfterFailure,
    ],
  )

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
    const popover = document.getElementById(id)
    if (!(popover instanceof HTMLElement) || !popover.hasAttribute('popover')) {
      resetAfterFailure(new TypeError(`Lazy popover content must render [popover]#${id}`), true)
      return
    }
    activationAttemptRef.current = null
    setBusy(false)
    setStatus('')
    const activationOptions = activationOptionsRef.current
    if (activationOptions.open) activationOptions.open(popover)
    else if (!popover.matches(':popover-open')) {
      showPopoverWithSource(popover, activationOptions.source)
    }
    if (popover.matches(':popover-open')) {
      focusInitialItem(popover, activationOptions.initialFocus ?? initialFocus)
    }
    setExpanded(popover.matches(':popover-open'))
  }, [LoadedContent, focusInitialItem, id, initialFocus, resetAfterFailure])

  useEffect(() => {
    if (!LoadedContent) return
    const popover = document.getElementById(id)
    if (!popover) return
    const handleToggle = () => setExpanded(popover.matches(':popover-open'))
    popover.addEventListener('toggle', handleToggle)
    return () => popover.removeEventListener('toggle', handleToggle)
  }, [LoadedContent, id])

  return (
    <LazyPopoverContext
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
      {LoadedContent ? <LoadedContent {...contentProps} id={id} /> : null}
    </LazyPopoverContext>
  )
}

export type LazyPopoverTriggerProps = AccessibleButtonPropsWithout<
  'aria-busy' | 'aria-controls' | 'aria-expanded'
>

export type LazyPopoverMenuTriggerProps = DistributiveOmit<
  LazyPopoverTriggerProps,
  'aria-haspopup'
>

export function LazyPopoverTrigger({
  onClick,
  onFocus,
  onPointerCancel,
  onPointerDown,
  onPointerEnter,
  type = 'button',
  variant = 'outline',
  ...props
}: LazyPopoverTriggerProps) {
  const context = use(LazyPopoverContext)
  if (!context) throw new Error('LazyPopoverTrigger must be rendered inside LazyPopover')
  const pointerToggle = usePopoverPointerToggleGuard(() => {
    const popover = document.getElementById(context.target)
    return popover instanceof HTMLElement ? popover : null
  })
  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    onFocus?.(event)
    if (!event.defaultPrevented) context.preload()
  }
  const handlePointerIntent = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.type === 'pointerenter') onPointerEnter?.(event)
    else {
      pointerToggle.clear()
      onPointerDown?.(event)
      if (!event.defaultPrevented) pointerToggle.capture()
    }
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
      onFocus={handleFocus}
      onPointerCancel={(event) => {
        pointerToggle.clear()
        onPointerCancel?.(event)
      }}
      onPointerDown={handlePointerIntent}
      onPointerEnter={handlePointerIntent}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return

        // Moving focus out of a menu can dismiss its popover before the click
        // reaches the invoker. Preserve the pointer-down state so that clicking
        // an open trigger still means “close”, rather than immediately reopening.
        const wasOpen = pointerToggle.consume()
        if (wasOpen) {
          const popover = document.getElementById(context.target)
          if (popover instanceof HTMLElement && popover.matches(':popover-open')) {
            popover.hidePopover()
          }
          event.currentTarget.focus({ preventScroll: true })
          return
        }
        context.activate({ source: event.currentTarget })
      }}
    />
  )
}

/** A menu trigger that supports the APG ArrowDown/ArrowUp open gestures. */
export function LazyPopoverMenuTrigger({
  onKeyDown,
  ...props
}: LazyPopoverMenuTriggerProps) {
  const context = use(LazyPopoverContext)
  if (!context) throw new Error('LazyPopoverMenuTrigger must be rendered inside LazyPopover')

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return
    event.preventDefault()
    const source = event.currentTarget
    context.activate({
      initialFocus: event.key === 'ArrowUp' ? 'last' : 'first',
      source,
      open: (popover) => {
        if (!popover.matches(':popover-open')) showPopoverWithSource(popover, source)
      },
    })
  }

  return (
    <LazyPopoverTrigger
      {...props}
      aria-haspopup="menu"
      onKeyDown={handleKeyDown}
    />
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
