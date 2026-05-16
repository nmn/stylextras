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
import { elevation } from '../tokens/elevation.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type BaseProps = ComponentPropsWithRef<'div'>

export type PopoverSize = 'sm' | 'md' | 'lg'
export type PopoverBehavior = 'auto' | 'manual'
export type PopoverPlacement = 'bottom' | 'top' | 'right' | 'left'

export type PopoverProps = Omit<BaseProps, 'className' | 'style' | 'popover'> & {
  behavior?: PopoverBehavior
  placement?: PopoverPlacement
  size?: PopoverSize
  sx?: StyleXStyles
}

export type PopoverContentProps = PopoverProps

export type PopoverTriggerProps = Omit<ButtonProps, 'className' | 'content' | 'style'> & {
  content: LazyComponentLoader<PopoverContentProps>
  contentProps?: Omit<PopoverContentProps, 'ref'>
  fallback?: React.ReactNode
}

export type PopoverComponent = ReactComponent<PopoverContentProps>

const bottomFallback = stylex.positionTry({ positionArea: 'top' })
const topFallback = stylex.positionTry({ positionArea: 'bottom' })
const rightFallback = stylex.positionTry({ positionArea: 'left' })
const leftFallback = stylex.positionTry({ positionArea: 'right' })

/**
 * Renders a floating surface using the native popover attribute and CSS anchor positioning.
 *
 * Search aliases: popover, popup, floating panel, anchored content.
 *
 * A11y notes:
 * - Focus and trigger behavior are not fully managed by the component.
 * - The caller is responsible for opening, closing, and announcing the relationship to its trigger.
 */
export function PopoverContent({
  behavior = 'auto',
  placement = 'bottom',
  ref,
  size = 'md',
  sx,
  ...props
}: PopoverContentProps) {
  return (
    <div
      ref={ref}
      {...props}
      popover={behavior}
      {...stylex.props(
        baseStyles.base,
        placementStyles[placement],
        fallbackStyles[placement],
        sizeStyles[size],
        sx,
      )}
    />
  )
}

export function PopoverTrigger({
  children,
  content,
  contentProps,
  fallback = null,
  onClick,
  onFocus,
  onPointerEnter,
  type = 'button',
  ...props
}: PopoverTriggerProps) {
  const [mounted, setMounted] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const popoverRef = React.useRef<HTMLDivElement | null>(null)
  const shouldOpenRef = React.useRef(false)
  const { LazyContent, preload } = useLazyComponent(content)

  const openPopover = React.useCallback(() => {
    shouldOpenRef.current = true
    setMounted(true)

    const popover = popoverRef.current
    if (popover && !popover.matches(':popover-open')) {
      showPopoverWithSource(popover, triggerRef.current)
      shouldOpenRef.current = false
    }
  }, [])

  const setPopoverRef = React.useCallback((node: HTMLDivElement | null) => {
    popoverRef.current = node

    if (node && shouldOpenRef.current && !node.matches(':popover-open')) {
      showPopoverWithSource(node, triggerRef.current)
      shouldOpenRef.current = false
    }

    return () => {
      if (popoverRef.current === node) {
        popoverRef.current = null
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
            openPopover()
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
          <LazyContent {...contentProps} ref={setPopoverRef} />
        </React.Suspense>
      ) : null}
    </>
  )
}

export const Popover = PopoverContent

const baseStyles = stylex.create({
  base: {
    position: 'fixed',
    margin: 0,
    padding: spacing.md,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    boxShadow: elevation.md,
    // eslint-disable-next-line @stylexjs/valid-styles
    positionAnchor: 'auto',
    display: {
      default: null,
      ':popover-open': 'block',
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
  bottom: {
    positionTryFallbacks: bottomFallback,
  },
  top: {
    positionTryFallbacks: topFallback,
  },
  right: {
    positionTryFallbacks: rightFallback,
  },
  left: {
    positionTryFallbacks: leftFallback,
  },
})

const sizeStyles = stylex.create({
  sm: {
    width: 'min(240px, calc(100vw - 32px))',
  },
  md: {
    width: 'min(320px, calc(100vw - 32px))',
  },
  lg: {
    width: 'min(420px, calc(100vw - 32px))',
  },
})
