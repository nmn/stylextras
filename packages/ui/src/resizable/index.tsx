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
  useLayoutEffect,
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
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value ?? internalValue

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
      const clamped = Math.min(max, Math.max(min, Math.round(nextValue)))
      if (!controlled) setInternalValue(clamped)
      onValueChange?.(clamped)
    },
    [controlled, max, min, onValueChange],
  )

  useLayoutEffect(() => {
    rootRef.current?.style.setProperty('--stylextras-resizable-size', `${currentValue}%`)
  }, [currentValue])

  const context = useMemo<ResizableContextValue>(
    () => ({ direction, max, min, rootRef, setValue, value: currentValue }),
    [currentValue, direction, max, min, setValue],
  )

  return (
    <ResizableContext value={context}>
      <div
        ref={setRefs}
        {...props}
        {...stylex.props(styles.root, directionStyles[direction], sx)}
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
    const previousKey = context.direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
    const nextKey = context.direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
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
    display: 'grid',
    minHeight: '8rem',
    minWidth: 0,
    overflow: 'hidden',
  },
  panel: {
    minHeight: 0,
    minWidth: 0,
    overflow: 'auto',
  },
  handle: {
    backgroundColor: {
      default: colors.border,
      ':hover': colors.borderStrong,
      ':focus-visible': colors.focusRing,
    },
    borderRadius: radius.round,
    cursor: 'col-resize',
    minHeight: spacing.xxxl,
    outline: 'none',
    position: 'relative',
    width: stroke.thick,
  },
  handleVertical: {
    cursor: 'row-resize',
    height: stroke.thick,
    minHeight: 0,
    minWidth: spacing.xxxl,
    width: '100%',
  },
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
