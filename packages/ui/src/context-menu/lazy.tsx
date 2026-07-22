'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  useRef,
} from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { Button, type AccessibleButtonPropsWithout } from '../button'
import {
  LazyPopover,
  type LazyPopoverActions,
  type LazyPopoverInitialFocus,
  type LazyPopoverProps,
  useLazyPopoverActions,
} from '../popover/lazy'
import { usePopoverPointerToggleGuard } from '../popover/pointer-toggle'
import { colors } from '../tokens/color.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { showContextMenuAt } from './open'

export type LazyContextMenuProps<Props extends object = Record<string, never>> = Omit<
  LazyPopoverProps<Props & AccessibleAriaNameProps>,
  'contentProps' | 'initialFocus'
> &
  AccessibleAriaNameProps & { contentProps: Props }

export type LazyContextMenuTriggerProps = Omit<
  ComponentPropsWithRef<'div'>,
  | 'aria-busy'
  | 'aria-controls'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'aria-label'
  | 'aria-labelledby'
  | 'className'
  | 'role'
  | 'style'
> &
  AccessibleAriaNameProps & { sx?: StyleXStyles }

export type LazyContextMenuButtonProps = AccessibleButtonPropsWithout<
  'aria-busy' | 'aria-controls' | 'aria-expanded' | 'aria-haspopup'
>

export function LazyContextMenu<Props extends object = Record<string, never>>(
  {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    contentProps,
    ...props
  }: LazyContextMenuProps<Props>,
) {
  const accessibleNameProps: AccessibleAriaNameProps =
    ariaLabel !== undefined
      ? { 'aria-label': ariaLabel }
      : { 'aria-labelledby': ariaLabelledBy as string }

  return (
    <LazyPopover
      {...props}
      contentProps={{ ...contentProps, ...accessibleNameProps }}
      initialFocus="first"
    />
  )
}

function activateAt(
  actions: LazyPopoverActions,
  source: HTMLElement,
  clientX: number,
  clientY: number,
  initialFocus: LazyPopoverInitialFocus = 'first',
) {
  actions.activate({
    initialFocus,
    open: (menu) => showContextMenuAt(menu, source, clientX, clientY),
    source,
  })
}

/** A named context-gesture region with right-click and ContextMenu/Shift+F10 support. */
export function LazyContextMenuTrigger({
  onContextMenu,
  onFocus,
  onKeyDown,
  onPointerCancel,
  onPointerDown,
  onPointerEnter,
  onPointerUp,
  ref,
  sx,
  tabIndex = 0,
  ...props
}: LazyContextMenuTriggerProps) {
  const actions = useLazyPopoverActions()
  const contextPointerDownRef = useRef(false)
  const pendingContextRef = useRef<{
    clientX: number
    clientY: number
    source: HTMLElement
  } | null>(null)
  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    onPointerEnter?.(event)
    if (!event.defaultPrevented) actions.preload()
  }
  const clearContextPointer = () => {
    contextPointerDownRef.current = false
    pendingContextRef.current = null
  }

  return (
    <div
      {...props}
      ref={ref}
      role="group"
      tabIndex={tabIndex}
      aria-busy={actions.busy || undefined}
      aria-controls={actions.mounted ? actions.target : undefined}
      aria-expanded={actions.expanded}
      aria-haspopup="menu"
      onFocus={(event) => {
        onFocus?.(event)
        if (!event.defaultPrevented) actions.preload()
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event)
        clearContextPointer()
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        clearContextPointer()
        if (event.defaultPrevented) return
        actions.preload()
        // A contextmenu can originate from a secondary click, Ctrl-click,
        // pen barrel button, or touch long-press. If it arrives before
        // pointerup, defer opening until that pointer gesture completes.
        contextPointerDownRef.current = true
      }}
      onPointerEnter={handlePointerEnter}
      onPointerUp={(event) => {
        onPointerUp?.(event)
        const pending = pendingContextRef.current
        const shouldActivate =
          !event.defaultPrevented && contextPointerDownRef.current && pending !== null
        clearContextPointer()
        if (shouldActivate) {
          activateAt(actions, pending.source, pending.clientX, pending.clientY)
        }
      }}
      onContextMenu={(event) => {
        onContextMenu?.(event)
        if (event.defaultPrevented) {
          clearContextPointer()
          return
        }
        event.preventDefault()
        if (contextPointerDownRef.current) {
          pendingContextRef.current = {
            clientX: event.clientX,
            clientY: event.clientY,
            source: event.currentTarget,
          }
          return
        }
        activateAt(actions, event.currentTarget, event.clientX, event.clientY)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (
          event.defaultPrevented ||
          (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10'))
        ) {
          return
        }
        event.preventDefault()
        const rect = event.currentTarget.getBoundingClientRect()
        const clientX = event.currentTarget.matches(':dir(rtl)') ? rect.right : rect.left
        activateAt(actions, event.currentTarget, clientX, rect.bottom)
      }}
      {...stylex.props(styles.trigger, sx)}
    />
  )
}

/** A visible keyboard/touch trigger for the same deferred context menu. */
export function LazyContextMenuButton({
  onClick,
  onFocus,
  onKeyDown,
  onPointerCancel,
  onPointerDown,
  onPointerEnter,
  type = 'button',
  variant = 'outline',
  ...props
}: LazyContextMenuButtonProps) {
  const actions = useLazyPopoverActions()
  const pointerToggle = usePopoverPointerToggleGuard(() => {
    const menu = document.getElementById(actions.target)
    return menu instanceof HTMLElement ? menu : null
  })
  const handlePointerIntent = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.type === 'pointerenter') onPointerEnter?.(event)
    else {
      pointerToggle.clear()
      onPointerDown?.(event)
      if (!event.defaultPrevented) pointerToggle.capture()
    }
    if (!event.defaultPrevented) actions.preload()
  }
  const openFromButton = (
    source: HTMLButtonElement,
    initialFocus: LazyPopoverInitialFocus = 'first',
  ) => {
    const rect = source.getBoundingClientRect()
    const clientX = source.matches(':dir(rtl)') ? rect.right : rect.left
    activateAt(actions, source, clientX, rect.bottom, initialFocus)
  }

  return (
    <Button
      {...props}
      type={type}
      variant={variant}
      aria-busy={actions.busy || undefined}
      aria-controls={actions.mounted ? actions.target : undefined}
      aria-expanded={actions.expanded}
      aria-haspopup="menu"
      onFocus={(event: FocusEvent<HTMLButtonElement>) => {
        onFocus?.(event)
        if (!event.defaultPrevented) actions.preload()
      }}
      onPointerCancel={(event) => {
        pointerToggle.clear()
        onPointerCancel?.(event)
      }}
      onPointerDown={handlePointerIntent}
      onPointerEnter={handlePointerIntent}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return
        event.preventDefault()
        openFromButton(event.currentTarget, event.key === 'ArrowUp' ? 'last' : 'first')
      }}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return

        // Light dismissal can close the menu between pointerdown and click.
        // Preserve the earlier state so clicking an open button remains a
        // close gesture instead of immediately reopening the menu.
        const menu = document.getElementById(actions.target)
        const wasOpen =
          pointerToggle.consume() ||
          actions.expanded ||
          (menu instanceof HTMLElement && menu.matches(':popover-open'))
        if (wasOpen) {
          if (menu instanceof HTMLElement && menu.matches(':popover-open')) {
            menu.hidePopover()
          }
          event.currentTarget.focus({ preventScroll: true })
          return
        }

        openFromButton(event.currentTarget)
      }}
    />
  )
}

/* eslint-disable @stylexjs/valid-styles -- StyleX 0.18 omits WebkitTouchCallout. */
const styles = stylex.create({
  trigger: {
    WebkitTouchCallout: 'none',
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': stroke.focusRing },
  },
})
/* eslint-enable @stylexjs/valid-styles */
