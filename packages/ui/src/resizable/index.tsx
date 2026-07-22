'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type PointerEvent,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type ResizableContextValue = {
  direction: 'horizontal' | 'vertical'
  max: number
  min: number
  rootRef: React.RefObject<HTMLDivElement | null>
  setValue: (value: number) => void
  value: number
}

const ResizableContext = createContext<ResizableContextValue | null>(null)

function useResizable(component: string) {
  const context = useContext(ResizableContext)
  if (!context) throw new Error(`${component} must be rendered inside Resizable`)
  return context
}

type SxProp = { sx?: StyleXStyles }

export type ResizableProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'defaultValue' | 'style'
> &
  SxProp & {
    defaultValue?: number
    direction?: 'horizontal' | 'vertical'
    max?: number
    min?: number
    onValueChange?: (value: number) => void
    value?: number
  }
export type ResizablePanelProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp
export type ResizableHandleProps = Omit<
  ComponentPropsWithRef<'div'>,
  | 'aria-orientation'
  | 'aria-valuemax'
  | 'aria-valuemin'
  | 'aria-valuenow'
  | 'className'
  | 'role'
  | 'style'
> &
  SxProp & { label: string }

export function Resizable({
  defaultValue = 50,
  direction = 'horizontal',
  max = 90,
  min = 10,
  onValueChange,
  ref,
  sx,
  value,
  ...props
}: ResizableProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const normalizedMin = Math.min(min, max)
  const normalizedMax = Math.max(min, max)
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = Math.min(normalizedMax, Math.max(normalizedMin, value ?? internalValue))

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  const setValue = useCallback(
    (nextValue: number) => {
      const clamped = Math.min(normalizedMax, Math.max(normalizedMin, Math.round(nextValue)))
      if (!controlled) setInternalValue(clamped)
      onValueChange?.(clamped)
    },
    [controlled, normalizedMax, normalizedMin, onValueChange],
  )

  const context = useMemo<ResizableContextValue>(
    () => ({
      direction,
      max: normalizedMax,
      min: normalizedMin,
      rootRef,
      setValue,
      value: currentValue,
    }),
    [currentValue, direction, normalizedMax, normalizedMin, setValue],
  )

  return (
    <ResizableContext value={context}>
      <div
        ref={setRefs}
        {...props}
        {...stylex.props(
          styles.root,
          directionStyles[direction],
          dynamicStyles.size(`${currentValue}%`),
          sx,
        )}
      />
    </ResizableContext>
  )
}

export function ResizablePanel({ ref, sx, ...props }: ResizablePanelProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.panel, sx)} />
}

export function ResizableHandle({
  label,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  ref,
  sx,
  tabIndex = 0,
  ...props
}: ResizableHandleProps) {
  const context = useResizable('ResizableHandle')

  const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const root = context.rootRef.current
    if (!root) return
    const rect = root.getBoundingClientRect()
    const inlineProgress = (event.clientX - rect.x) / rect.width
    const nextValue =
      context.direction === 'horizontal'
        ? (getComputedStyle(root).direction === 'rtl' ? 1 - inlineProgress : inlineProgress) * 100
        : ((event.clientY - rect.top) / rect.height) * 100
    context.setValue(nextValue)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const step = event.shiftKey ? 10 : 2
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
    const previousKey =
      context.direction === 'horizontal' ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp'
    const nextKey =
      context.direction === 'horizontal' ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown'
    if (event.key === previousKey) {
      event.preventDefault()
      context.setValue(context.value - step)
    } else if (event.key === nextKey) {
      event.preventDefault()
      context.setValue(context.value + step)
    } else if (event.key === 'Home') {
      event.preventDefault()
      context.setValue(context.min)
    } else if (event.key === 'End') {
      event.preventDefault()
      context.setValue(context.max)
    }
  }

  return (
    <div
      ref={ref}
      role="separator"
      tabIndex={tabIndex}
      aria-label={label}
      aria-orientation={context.direction === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-valuemax={context.max}
      aria-valuemin={context.min}
      aria-valuenow={context.value}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (!event.defaultPrevented) {
          event.currentTarget.setPointerCapture(event.pointerId)
          updateFromPointer(event)
        }
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (!event.defaultPrevented && event.currentTarget.hasPointerCapture(event.pointerId)) {
          updateFromPointer(event)
        }
      }}
      {...props}
      {...stylex.props(
        styles.handle,
        context.direction === 'vertical' && styles.handleVertical,
        sx,
      )}
    />
  )
}

/* eslint-disable @stylexjs/valid-styles */
const styles = stylex.create({
  root: {
    overflow: 'hidden',
    display: 'grid',
    minHeight: '8rem',
    minWidth: 0,
  },
  panel: {
    overflow: 'auto',
    minHeight: 0,
    minWidth: 0,
  },
  handle: {
    borderRadius: radius.round,
    backgroundColor: 'transparent',
    cursor: 'col-resize',
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: `calc(-1 * ${stroke.focusRing})`,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':focus-visible': stroke.focusRing,
    },
    position: 'relative',
    touchAction: 'none',
    minHeight: spacing.xxxl,
    minWidth: {
      default: spacing.targetMin,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
    width: spacing.targetMin,
    '::before': {
      borderRadius: radius.round,
      insetBlock: 0,
      backgroundColor: {
        default: colors.border,
        '@media (forced-colors: active)': 'CanvasText',
      },
      content: '""',
      insetInlineStart: '50%',
      position: 'absolute',
      transform: 'translateX(-50%)',
      width: stroke.thick,
    },
  },
  handleVertical: {
    cursor: 'row-resize',
    height: spacing.targetMin,
    minHeight: {
      default: spacing.targetMin,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
    minWidth: spacing.xxxl,
    width: '100%',
    '::before': {
      insetInline: 0,
      insetBlockStart: '50%',
      transform: 'translateY(-50%)',
      height: stroke.thick,
      width: 'auto',
    },
  },
})

const dynamicStyles = stylex.create({
  size: (value: string) => ({
    '--stylextras-resizable-size': value,
  }),
})

const directionStyles = stylex.create({
  horizontal: {
    gridTemplateColumns:
      'minmax(0, var(--stylextras-resizable-size, 50%)) auto minmax(0, calc(100% - var(--stylextras-resizable-size, 50%)))',
  },
  vertical: {
    gridTemplateRows:
      'minmax(0, var(--stylextras-resizable-size, 50%)) auto minmax(0, calc(100% - var(--stylextras-resizable-size, 50%)))',
  },
})
/* eslint-enable @stylexjs/valid-styles */
