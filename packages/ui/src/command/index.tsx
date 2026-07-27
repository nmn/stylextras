'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { type AccessibleButtonPropsWithout, Button } from '../button'
import {
  type DomOrderedCollectionRecord,
  getAdjacentItem,
  useDomOrderedCollection,
} from '../internal/dom-ordered-collection'
import { composeRefs } from '../internal/refs'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type CommandRecord = DomOrderedCollectionRecord & {
  disabled: boolean
  hidden: boolean
  keywords: string
  onSelect: ((value: string) => void) | undefined
}
type CommandContextValue = {
  activeId: string | null
  getMatchingItems: () => CommandRecord[]
  getNavigableItems: () => CommandRecord[]
  listId: string
  query: string
  register: (item: CommandRecord) => () => void
  run: (item: CommandRecord) => void
  setActiveId: (id: string | null) => void
  setQuery: (value: string) => void
}

const CommandContext = createContext<CommandContextValue | null>(null)

function useCommand(component: string) {
  const context = useContext(CommandContext)
  if (!context) throw new Error(`${component} must be rendered inside Command`)
  return context
}

export type CommandProps = Omit<
  ComponentPropsWithRef<'dialog'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'style'
> &
  AccessibleAriaNameProps & {
    onValueChange?: (value: string) => void
    sx?: StyleXStyles
  }
export type CommandTriggerProps = AccessibleButtonPropsWithout<
  'aria-controls' | 'aria-haspopup'
> & {
  target: string
}
export type CommandInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'aria-activedescendant'
  | 'aria-autocomplete'
  | 'aria-controls'
  | 'aria-expanded'
  | 'aria-label'
  | 'aria-labelledby'
  | 'className'
  | 'role'
  | 'style'
  | 'type'
  | 'value'
> &
  AccessibleAriaNameProps & { sx?: StyleXStyles; type?: 'search' | 'text' }
export type CommandListProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'id' | 'role' | 'style'
> & {
  sx?: StyleXStyles
}
export type CommandItemProps = Omit<
  ComponentPropsWithRef<'div'>,
  | 'aria-disabled'
  | 'aria-selected'
  | 'className'
  | 'id'
  | 'onSelect'
  | 'role'
  | 'style'
  | 'tabIndex'
> & {
  disabled?: boolean
  keywords?: string
  onSelect?: (value: string) => void
  sx?: StyleXStyles
  value: string
}
export type CommandEmptyProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'hidden' | 'style'
> & {
  sx?: StyleXStyles
}
export type CommandStatusProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-atomic' | 'aria-live' | 'children' | 'className' | 'role' | 'style'
> & {
  children: string | ((count: number) => string)
  sx?: StyleXStyles
}

const commandProps = (target: string) =>
  ({ command: 'show-modal', commandfor: target }) as Record<string, string>

export function Command({ children, onClose, onValueChange, ref, sx, ...props }: CommandProps) {
  const generatedId = useId().replaceAll(':', '')
  const listId = `stylextras-command-list-${generatedId}`
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { getItems, register, version } = useDomOrderedCollection<CommandRecord>('Command')
  const queryRef = useRef('')
  const [query, setQueryState] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const setRefs = useMemo(() => composeRefs(dialogRef, ref), [ref])

  const matches = useCallback((item: CommandRecord) => {
    const normalized = queryRef.current.trim().toLocaleLowerCase()
    return (
      !normalized ||
      item.keywords.includes(normalized) ||
      item.value.toLocaleLowerCase().includes(normalized)
    )
  }, [])

  const getMatchingItems = useCallback(
    () => getItems().filter((item) => !item.hidden && matches(item)),
    [getItems, matches],
  )

  const getNavigableItems = useCallback(
    () => getMatchingItems().filter((item) => !item.disabled),
    [getMatchingItems],
  )

  const setQuery = useCallback((value: string) => {
    queryRef.current = value
    setQueryState(value)
    setActiveId(null)
  }, [])

  const run = useCallback(
    (item: CommandRecord) => {
      if (item.disabled) return
      item.onSelect?.(item.value)
      onValueChange?.(item.value)
      dialogRef.current?.close(item.value)
      setQuery('')
    },
    [onValueChange, setQuery],
  )

  useEffect(() => {
    if (activeId && !getNavigableItems().some((item) => item.id === activeId)) {
      setActiveId(null)
    }
  }, [activeId, getNavigableItems, query, version])

  const context = useMemo<CommandContextValue>(
    () => ({
      activeId,
      getMatchingItems,
      getNavigableItems,
      listId,
      query,
      register,
      run,
      setActiveId,
      setQuery,
    }),
    [
      activeId,
      getMatchingItems,
      getNavigableItems,
      listId,
      query,
      register,
      run,
      setQuery,
      version,
    ],
  )

  return (
    <CommandContext value={context}>
      <dialog
        ref={setRefs}
        {...props}
        {...({ closedby: 'any' } as Record<string, string>)}
        onClose={(event) => {
          onClose?.(event)
          setQuery('')
          setActiveId(null)
        }}
        {...stylex.props(styles.command, sx)}
      >
        {children}
      </dialog>
    </CommandContext>
  )
}

export function CommandTrigger({ target, type = 'button', ...props }: CommandTriggerProps) {
  return (
    <Button
      {...props}
      type={type}
      aria-controls={target}
      aria-haspopup="dialog"
      {...commandProps(target)}
    />
  )
}

export function CommandInput({
  autoComplete = 'off',
  onChange,
  onKeyDown,
  ref,
  sx,
  type = 'search',
  ...props
}: CommandInputProps) {
  const context = useCommand('CommandInput')
  const activeId = context.activeId
    ? context.getNavigableItems().find((item) => item.id === context.activeId)?.id
    : undefined

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.nativeEvent.isComposing) return
    const items = context.getNavigableItems()
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const next = getAdjacentItem(items, context.activeId, event.key === 'ArrowDown' ? 1 : -1)
      if (next) {
        event.preventDefault()
        context.setActiveId(next.id)
        next.getElement()?.scrollIntoView({ block: 'nearest' })
      }
    } else if (event.key === 'Home' || event.key === 'End') {
      const next = event.key === 'Home' ? items[0] : items.at(-1)
      if (next) {
        event.preventDefault()
        context.setActiveId(next.id)
        next.getElement()?.scrollIntoView({ block: 'nearest' })
      }
    } else if (event.key === 'Enter' && context.activeId) {
      const active = items.find((item) => item.id === context.activeId)
      if (active) {
        event.preventDefault()
        context.run(active)
      }
    }
  }

  return (
    <input
      ref={ref}
      {...props}
      type={type}
      role="combobox"
      aria-activedescendant={activeId}
      aria-controls={context.listId}
      aria-expanded="true"
      aria-autocomplete="list"
      autoComplete={autoComplete}
      value={context.query}
      onChange={(event) => {
        onChange?.(event)
        if (!event.defaultPrevented) context.setQuery(event.currentTarget.value)
      }}
      onKeyDown={handleKeyDown}
      {...stylex.props(styles.input, sx)}
    />
  )
}

export function CommandList({ ref, sx, ...props }: CommandListProps) {
  const context = useCommand('CommandList')
  return (
    <div
      ref={ref}
      {...props}
      id={context.listId}
      role="listbox"
      {...stylex.props(styles.list, sx)}
    />
  )
}

export function CommandItem({
  children,
  disabled = false,
  hidden: hiddenProp = false,
  keywords = '',
  onClick,
  onMouseDown,
  onPointerMove,
  onSelect,
  ref,
  sx,
  value,
  ...props
}: CommandItemProps) {
  const context = useCommand('CommandItem')
  const generatedId = useId().replaceAll(':', '')
  const itemRef = useRef<HTMLDivElement>(null)
  const id = `${context.listId}-item-${generatedId}`
  const searchable =
    `${value} ${keywords} ${typeof children === 'string' ? children : ''}`.toLocaleLowerCase()
  const item = useMemo<CommandRecord>(
    () => ({
      disabled,
      getElement: () => itemRef.current,
      hidden: hiddenProp,
      id,
      keywords: searchable,
      onSelect,
      value,
    }),
    [disabled, hiddenProp, id, onSelect, searchable, value],
  )
  const normalizedQuery = context.query.trim().toLocaleLowerCase()
  const filteredOut = Boolean(normalizedQuery && !item.keywords.includes(normalizedQuery))

  useEffect(() => context.register(item), [context.register, item])

  const setRefs = useMemo(() => composeRefs(itemRef, ref), [ref])

  return (
    <div
      ref={setRefs}
      {...props}
      id={id}
      role="option"
      aria-disabled={disabled || undefined}
      aria-selected={context.activeId === item.id}
      tabIndex={undefined}
      hidden={hiddenProp || filteredOut}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && !disabled) {
          context.run(item)
        }
      }}
      onMouseDown={(event) => {
        onMouseDown?.(event)
        if (!event.defaultPrevented) event.preventDefault()
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (!event.defaultPrevented && !disabled) context.setActiveId(item.id)
      }}
      {...stylex.props(styles.item, sx)}
    >
      {children}
    </div>
  )
}

export function CommandEmpty({ children = 'No results.', ref, sx, ...props }: CommandEmptyProps) {
  const context = useCommand('CommandEmpty')
  const matchingItems = context.getMatchingItems()
  return (
    <div ref={ref} {...props} hidden={matchingItems.length > 0} {...stylex.props(styles.empty, sx)}>
      {children}
    </div>
  )
}

/** A polite, visually hidden plain-text result count controlled by the caller's language. */
export function CommandStatus({ children, ref, sx, ...props }: CommandStatusProps) {
  const context = useCommand('CommandStatus')
  const count = context.getMatchingItems().length
  return (
    <div
      ref={ref}
      {...props}
      role="status"
      aria-atomic="true"
      aria-live="polite"
      {...stylex.props(styles.status, sx)}
    >
      {typeof children === 'function' ? children(count) : children}
    </div>
  )
}

/* eslint-disable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
const styles = stylex.create({
  command: {
    margin: 'auto',
    padding: spacing.xxs,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    gap: spacing.xxs,
    overscrollBehavior: 'contain',
    backgroundColor: colors.popover,
    boxShadow: elevation.lg,
    color: colors.popoverForeground,
    display: {
      default: 'none',
      ':open': 'grid',
    },
    maxHeight: 'min(32rem, 80dvh)',
    maxWidth: 'calc(100vw - 2rem)',
    width: 'min(36rem, calc(100vw - 2rem))',
    '::backdrop': { backgroundColor: colors.overlay },
  },
  input: {
    borderColor: {
      default: colors.border,
      ':focus-visible': colors.focusRing,
    },
    borderStyle: 'solid',
    borderWidth: `0 0 ${stroke.thin}`,
    paddingInline: spacing.md,
    backgroundColor: 'transparent',
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':focus-visible': stroke.focusRing,
    },
    minHeight: {
      default: `max(${spacing.controlLg}, ${spacing.targetMin})`,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
  },
  list: {
    padding: spacing.xxs,
    gap: spacing.xxxs,
    overscrollBehavior: 'contain',
    display: 'grid',
    overflowY: 'auto',
  },
  item: {
    borderColor: 'transparent',
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    paddingInline: spacing.sm,
    backgroundColor: {
      default: 'transparent',
      '[aria-disabled="true"]': 'transparent',
      ':is(:hover, [aria-selected="true"]):not([aria-disabled="true"])': colors.accent,
    },
    color: {
      default: colors.popoverForeground,
      ':is(:hover, [aria-selected="true"]):not([aria-disabled="true"])': colors.accentText,
    },
    cursor: { default: 'default', '[aria-disabled="true"]': 'not-allowed' },
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    opacity: { default: 1, '[aria-disabled="true"]': 0.5 },
    textAlign: 'start',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, border-color, color',
    transitionTimingFunction: motion.easeStandard,
    minHeight: {
      default: spacing.targetMin,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
  },
  empty: {
    padding: spacing.lg,
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    textAlign: 'center',
  },
  status: {
    margin: -1,
    padding: 0,
    borderStyle: 'none',
    borderWidth: 0,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    position: 'absolute',
    whiteSpace: 'nowrap',
    height: 1,
    width: 1,
  },
})
/* eslint-enable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
