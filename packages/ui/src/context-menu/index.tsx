import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import * as React from 'react'
import type { ComponentPropsWithRef } from 'react'
import { Button, type ButtonProps } from '../button'
import {
  type LazyComponentLoader,
  type ReactComponent,
  showPopoverWithSource,
  useLazyComponent,
} from '../lazy-component'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type BaseProps = ComponentPropsWithRef<'div'>

export type ContextMenuPlacement = 'bottom' | 'top' | 'right' | 'left'
export type ContextMenuBehavior = 'auto' | 'manual'

export type ContextMenuProps = Omit<BaseProps, 'className' | 'style' | 'popover'> & {
  behavior?: ContextMenuBehavior
  placement?: ContextMenuPlacement
  sx?: StyleXStyles
}

export type ContextMenuContentProps = ContextMenuProps

export type ContextMenuTriggerProps = Omit<ButtonProps, 'className' | 'content' | 'style'> & {
  content: LazyComponentLoader<ContextMenuContentProps>
  contentProps?: Omit<ContextMenuContentProps, 'ref'>
  fallback?: React.ReactNode
}

export type ContextMenuComponent = ReactComponent<ContextMenuContentProps>

const bottomFallback = stylex.positionTry({ positionArea: 'top' })
const topFallback = stylex.positionTry({ positionArea: 'bottom' })
const rightFallback = stylex.positionTry({ positionArea: 'left' })
const leftFallback = stylex.positionTry({ positionArea: 'right' })

/**
 * Renders a menu surface using the native popover attribute and anchor positioning.
 *
 * Search aliases: context menu, right click menu, menu surface, popover menu.
 *
 * A11y notes:
 * - Does not implement full context-menu keyboard behavior or invocation handling.
 * - Opening, focus management, and item navigation must be composed by the caller.
 */
export function ContextMenuContent({
  behavior = 'manual',
  placement = 'bottom',
  ref,
  sx,
  ...props
}: ContextMenuContentProps) {
  return (
    <div
      ref={ref}
      {...props}
      popover={behavior}
      role="menu"
      {...stylex.props(baseStyles.base, placementStyles[placement], fallbackStyles[placement], sx)}
    />
  )
}

export function ContextMenuTrigger({
  children,
  content,
  contentProps,
  fallback = null,
  onClick,
  onFocus,
  onPointerEnter,
  type = 'button',
  ...props
}: ContextMenuTriggerProps) {
  const [mounted, setMounted] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const shouldOpenRef = React.useRef(false)
  const { LazyContent, preload } = useLazyComponent(content)

  const openMenu = React.useCallback(() => {
    shouldOpenRef.current = true
    setMounted(true)

    const menu = menuRef.current
    if (menu && !menu.matches(':popover-open')) {
      showPopoverWithSource(menu, triggerRef.current)
      shouldOpenRef.current = false
    }
  }, [])

  const setMenuRef = React.useCallback((node: HTMLDivElement | null) => {
    menuRef.current = node

    if (node && shouldOpenRef.current && !node.matches(':popover-open')) {
      showPopoverWithSource(node, triggerRef.current)
      shouldOpenRef.current = false
    }

    return () => {
      if (menuRef.current === node) {
        menuRef.current = null
      }
    }
  }, [])

  return (
    <>
      <Button
        {...props}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) {
            openMenu()
          }
        }}
        onFocus={(event) => {
          onFocus?.(event)
          void preload()
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event)
          void preload()
        }}
        ref={triggerRef}
        type={type}
      >
        {children}
      </Button>
      {mounted ? (
        <React.Suspense fallback={fallback}>
          <LazyContent {...contentProps} ref={setMenuRef} />
        </React.Suspense>
      ) : null}
    </>
  )
}

export const ContextMenu = ContextMenuContent

const baseStyles = stylex.create({
  base: {
    position: 'fixed',
    margin: 0,
    gap: spacing['3xs'],
    minWidth: spacing['4xl'],
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: 'auto',
    display: {
      default: null,
      ':popover-open': 'grid',
    },
  },
})

const placementStyles = stylex.create({
  bottom: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: 'bottom',
  },
  top: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: 'top',
  },
  right: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: 'right',
  },
  left: {
    // eslint-disable-next-line @stylexjs/valid-styles
    positionArea: 'left',
  },
})

const fallbackStyles = stylex.create({
  bottom: { positionTryFallbacks: bottomFallback },
  top: { positionTryFallbacks: topFallback },
  right: { positionTryFallbacks: rightFallback },
  left: { positionTryFallbacks: leftFallback },
})
