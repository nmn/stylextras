'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  createContext,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button, type ButtonProps } from '../button'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type CommandRecord = { disabled: boolean; id: string; keywords: string; value: string }
type CommandContextValue = {
  activeValue: string | null
  itemCount: number
  listId: string
  query: string
  register: (item: CommandRecord) => () => void
  run: (item: CommandRecord) => void
  setActiveValue: (value: string | null) => void
  setQuery: (value: string) => void
  visibleItems: () => CommandRecord[]
}

const CommandContext = createContext<CommandContextValue | null>(null)

function useCommand(component: string) {
  const context = useContext(CommandContext)
  if (!context) throw new Error(`${component} must be rendered inside Command`)
  return context
}

export type CommandProps = Omit<ComponentPropsWithRef<'dialog'>, 'className' | 'style'> & {
  onValueChange?: (value: string) => void
  sx?: StyleXStyles
}
export type CommandTriggerProps = ButtonProps & { target: string }
export type CommandInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'aria-activedescendant' | 'aria-controls' | 'className' | 'role' | 'style' | 'value'
> & { sx?: StyleXStyles }
export type CommandListProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'role' | 'style'> & {
  sx?: StyleXStyles
}
export type CommandItemProps = Omit<
  ComponentPropsWithRef<'button'>,
  'className' | 'onSelect' | 'role' | 'style' | 'value'
> & {
  keywords?: string
  onSelect?: (value: string) => void
  sx?: StyleXStyles
  value: string
}
export type CommandEmptyProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & {
  sx?: StyleXStyles
}

const commandProps = (target: string) =>
  ({ command: 'show-modal', commandfor: target }) as Record<string, string>

export function Command({ children, onValueChange, ref, sx, ...props }: CommandProps) {
  const generatedId = useId().replaceAll(':', '')
  const listId = `stylextras-command-list-${generatedId}`
  const dialogRef = useRef<HTMLDialogElement>(null)
  const itemsRef = useRef(new Map<string, CommandRecord>())
  const queryRef = useRef('')
  const [query, setQueryState] = useState('')
  const [activeValue, setActiveValue] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  const setRefs = useCallback(
    (node: HTMLDialogElement | null) => {
      dialogRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  const matches = useCallback((item: CommandRecord) => {
    const normalized = queryRef.current.trim().toLocaleLowerCase()
    return (
      !normalized ||
      item.keywords.includes(normalized) ||
      item.value.toLocaleLowerCase().includes(normalized)
    )
  }, [])

  const visibleItems = useCallback(
    () => [...itemsRef.current.values()].filter((item) => !item.disabled && matches(item)),
    [matches],
  )

  const register = useCallback((item: CommandRecord) => {
    itemsRef.current.set(item.value, item)
    setVersion((version) => version + 1)
    return () => {
      itemsRef.current.delete(item.value)
      setVersion((version) => version + 1)
    }
  }, [])

  const setQuery = useCallback((value: string) => {
    queryRef.current = value
    setQueryState(value)
    setActiveValue(null)
  }, [])

  const run = useCallback(
    (item: CommandRecord) => {
      if (item.disabled) return
      onValueChange?.(item.value)
      dialogRef.current?.close(item.value)
      setQuery('')
    },
    [onValueChange, setQuery],
  )

  const context = useMemo<CommandContextValue>(
    () => ({
      activeValue,
      itemCount: itemsRef.current.size,
      listId,
      query,
      register,
      run,
      setActiveValue,
      setQuery,
      visibleItems,
    }),
    [activeValue, listId, query, register, run, setQuery, version, visibleItems],
  )

  return (
    <CommandContext value={context}>
      <dialog
        ref={setRefs}
        {...({ closedby: 'any' } as Record<string, string>)}
        {...props}
        {...stylex.props(styles.command, sx)}
      >
        {children}
      </dialog>
    </CommandContext>
  )
}

export function CommandTrigger({ target, type = 'button', ...props }: CommandTriggerProps) {
  return <Button type={type} {...props} {...commandProps(target)} />
}

export function CommandInput({ onChange, onKeyDown, ref, sx, type = 'search', ...props }: CommandInputProps) {
  const context = useCommand('CommandInput')
  const activeId = context.activeValue
    ? context.visibleItems().find((item) => item.value === context.activeValue)?.id
    : undefined

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const items = context.visibleItems()
    const current = items.findIndex((item) => item.value === context.activeValue)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      const next = items[(current + delta + items.length) % items.length]
      if (next) context.setActiveValue(next.value)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const next = event.key === 'Home' ? items[0] : items.at(-1)
      if (next) context.setActiveValue(next.value)
    } else if (event.key === 'Enter' && context.activeValue) {
      const active = items.find((item) => item.value === context.activeValue)
      if (active) {
        event.preventDefault()
        context.run(active)
      }
    }
  }

  return (
    <input
      ref={ref}
      type={type}
      role="combobox"
      aria-activedescendant={activeId}
      aria-controls={context.listId}
      aria-expanded="true"
      autoComplete="off"
      value={context.query}
      onChange={(event) => {
        onChange?.(event)
        if (!event.defaultPrevented) context.setQuery(event.currentTarget.value)
      }}
      onKeyDown={handleKeyDown}
      {...props}
      {...stylex.props(styles.input, sx)}
    />
  )
}

export function CommandList({ ref, sx, ...props }: CommandListProps) {
  const context = useCommand('CommandList')
  return (
    <div ref={ref} id={context.listId} role="listbox" {...props} {...stylex.props(styles.list, sx)} />
  )
}

export function CommandItem({
  children,
  disabled = false,
  keywords = '',
  onClick,
  onPointerMove,
  onSelect,
  ref,
  sx,
  value,
  ...props
}: CommandItemProps) {
  const context = useCommand('CommandItem')
  const generatedId = useId().replaceAll(':', '')
  const id = `${context.listId}-item-${generatedId}`
  const searchable = `${value} ${keywords} ${typeof children === 'string' ? children : ''}`.toLocaleLowerCase()
  const item = useMemo<CommandRecord>(
    () => ({ disabled, id, keywords: searchable, value }),
    [disabled, id, searchable, value],
  )
  const normalizedQuery = context.query.trim().toLocaleLowerCase()
  const hidden = Boolean(normalizedQuery && !item.keywords.includes(normalizedQuery))

  useEffect(() => context.register(item), [context.register, item])

  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="option"
      aria-selected={context.activeValue === item.value}
      disabled={disabled}
      hidden={hidden}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          onSelect?.(value)
          context.run(item)
        }
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (!event.defaultPrevented && !disabled) context.setActiveValue(item.value)
      }}
      {...props}
      {...stylex.props(styles.item, sx)}
    >
      {children}
    </button>
  )
}

export function CommandEmpty({ children = 'No results.', ref, sx, ...props }: CommandEmptyProps) {
  const context = useCommand('CommandEmpty')
  const visibleItems = context.visibleItems()
  return (
    <div
      ref={ref}
      hidden={context.itemCount > 0 && visibleItems.length > 0}
      {...props}
      {...stylex.props(styles.empty, sx)}
    >
      {children}
    </div>
  )
}

/* eslint-disable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
const styles = stylex.create({
  command: {
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: elevation.lg,
    color: colors.popoverForeground,
    display: {
      default: 'none',
      ':open': 'grid',
    },
    gap: spacing.xxs,
    margin: 'auto',
    maxHeight: 'min(32rem, 80dvh)',
    maxWidth: 'calc(100vw - 2rem)',
    padding: spacing.xxs,
    width: 'min(36rem, calc(100vw - 2rem))',
    '::backdrop': { backgroundColor: colors.overlay },
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: {
      default: colors.border,
      ':focus-visible': colors.focusRing,
    },
    borderStyle: 'solid',
    borderWidth: `0 0 ${stroke.thin}`,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    minHeight: spacing.controlLg,
    outline: 'none',
    paddingInline: spacing.md,
  },
  list: {
    display: 'grid',
    gap: spacing.xxxs,
    overflowY: 'auto',
    padding: spacing.xxs,
  },
  item: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
      '[aria-selected="true"]': colors.accent,
      ':disabled': 'transparent',
    },
    borderColor: 'transparent',
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    color: colors.accentForeground,
    cursor: { default: 'default', ':disabled': 'not-allowed' },
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    minHeight: spacing.controlSm,
    opacity: { default: 1, ':disabled': 0.5 },
    paddingInline: spacing.sm,
    textAlign: 'start',
    transitionDuration: motion.durationFast,
  },
  empty: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    padding: spacing.lg,
    textAlign: 'center',
  },
})
/* eslint-enable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
