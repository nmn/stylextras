'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type FocusEvent,
  type KeyboardEvent,
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react'
import { focusgroupAttributes, focusgroupRef } from '../focusgroup'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type TabsContextValue = {
  activationMode: 'automatic' | 'manual'
  id: string
  orientation: 'horizontal' | 'vertical'
  select: (value: string) => void
  value: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs(component: string) {
  const context = useContext(TabsContext)
  if (!context) throw new Error(`${component} must be rendered inside Tabs`)
  return context
}

type SxProp = { sx?: StyleXStyles }

export type TabsProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'defaultValue' | 'style'> &
  SxProp & {
    activationMode?: 'automatic' | 'manual'
    defaultValue?: string
    onValueChange?: (value: string) => void
    orientation?: 'horizontal' | 'vertical'
    value?: string
  }
export type TabsListProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'role' | 'style'> &
  SxProp
export type TabsTriggerProps = Omit<
  ComponentPropsWithRef<'button'>,
  'aria-controls' | 'aria-selected' | 'className' | 'role' | 'style' | 'value'
> &
  SxProp & { value: string }
export type TabsContentProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-labelledby' | 'className' | 'role' | 'style'
> &
  SxProp & { value: string }

export function Tabs({
  activationMode = 'automatic',
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  ref,
  sx,
  value,
  ...props
}: TabsProps) {
  const generatedId = useId().replaceAll(':', '')
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const selectedValue = value ?? internalValue
  const context = useMemo<TabsContextValue>(
    () => ({
      activationMode,
      id: generatedId,
      orientation,
      select: (nextValue) => {
        if (!controlled) setInternalValue(nextValue)
        onValueChange?.(nextValue)
      },
      value: selectedValue,
    }),
    [activationMode, controlled, generatedId, onValueChange, orientation, selectedValue],
  )
  return (
    <TabsContext value={context}>
      <div ref={ref} {...props} {...stylex.props(styles.root, sx)} />
    </TabsContext>
  )
}

export function TabsList({ ref, sx, ...props }: TabsListProps) {
  const context = useTabs('TabsList')
  const setRef = focusgroupRef(ref)
  return (
    <div
      ref={setRef}
      role="tablist"
      aria-orientation={context.orientation}
      {...focusgroupAttributes('tablist')}
      {...props}
      {...stylex.props(styles.list, context.orientation === 'vertical' && styles.listVertical, sx)}
    />
  )
}

export function TabsTrigger({
  onClick,
  onFocus,
  onKeyDown,
  ref,
  sx,
  type = 'button',
  value,
  ...props
}: TabsTriggerProps) {
  const context = useTabs('TabsTrigger')
  const selected = context.value === value
  const triggerId = `stylextras-tabs-${context.id}-trigger-${value}`
  const panelId = `stylextras-tabs-${context.id}-panel-${value}`

  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    onFocus?.(event)
    if (!event.defaultPrevented && context.activationMode === 'automatic') context.select(value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const triggers = [
      ...event.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled)',
      ),
    ]
    const index = triggers.indexOf(event.currentTarget)
    const previousKey = context.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
    const nextKey = context.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
    let next: HTMLButtonElement | undefined
    if (event.key === previousKey) next = triggers[(index - 1 + triggers.length) % triggers.length]
    else if (event.key === nextKey) next = triggers[(index + 1) % triggers.length]
    else if (event.key === 'Home') next = triggers[0]
    else if (event.key === 'End') next = triggers.at(-1)
    else if ((event.key === 'Enter' || event.key === ' ') && context.activationMode === 'manual') {
      event.preventDefault()
      context.select(value)
      return
    }
    if (next) {
      event.preventDefault()
      next.focus()
    }
  }

  return (
    <button
      ref={ref}
      id={triggerId}
      type={type}
      role="tab"
      aria-controls={panelId}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.select(value)
      }}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      {...props}
      {...stylex.props(styles.trigger, selected && styles.triggerActive, sx)}
    />
  )
}

export function TabsContent({ ref, sx, value, ...props }: TabsContentProps) {
  const context = useTabs('TabsContent')
  return (
    <div
      ref={ref}
      id={`stylextras-tabs-${context.id}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`stylextras-tabs-${context.id}-trigger-${value}`}
      hidden={context.value !== value}
      tabIndex={0}
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  )
}

const styles = stylex.create({
  root: {
    display: 'grid',
    gap: spacing.md,
    minWidth: 0,
    width: '100%',
  },
  list: {
    alignItems: 'center',
    backgroundColor: `light-dark(${colors.secondary}, ${colors.control})`,
    borderRadius: radius.sm,
    display: 'inline-flex',
    gap: spacing.xxxs,
    maxWidth: '100%',
    overflowX: 'auto',
    padding: spacing.xxxs,
    width: '100%',
  },
  listVertical: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  trigger: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.bgSubtle,
      ':disabled': 'transparent',
    },
    borderColor: 'transparent',
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRingOffset} ${colors.bg}, 0 0 0 calc(${stroke.focusRingOffset} + ${stroke.focusRing}) ${colors.focusRing}`,
    },
    color: colors.fgMuted,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    minHeight: spacing.controlSm,
    opacity: { default: 1, ':disabled': 0.5 },
    outline: 'none',
    paddingInline: spacing.sm,
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, box-shadow, color',
    transitionTimingFunction: motion.easeStandard,
  },
  triggerActive: {
    backgroundColor: `light-dark(${colors.control}, ${colors.bgSubtle})`,
    boxShadow: elevation.xs,
    color: colors.fg,
  },
  content: {
    borderRadius: radius.xs,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRing} ${colors.focusRing}`,
    },
    color: colors.fg,
    outline: 'none',
  },
})
