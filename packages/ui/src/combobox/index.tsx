'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  type DomOrderedCollectionRecord,
  getAdjacentItem,
  useDomOrderedCollection,
} from '../internal/dom-ordered-collection'
import { composeRefs } from '../internal/refs'
import { showPopoverWithSource } from '../platform-polyfills/popover-source'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type ItemRecord = DomOrderedCollectionRecord & {
  disabled: boolean
  label: string
}

type ComboboxContextValue = {
  activeDescendant: string | undefined
  activeId: string | null
  close: () => void
  contentId: string
  contentRef: React.RefObject<HTMLDivElement | null>
  disabled: boolean
  filterTerm: string
  form: string | undefined
  getMatchingItems: () => ItemRecord[]
  getNavigableItems: () => ItemRecord[]
  inputId: string
  inputRef: React.RefObject<HTMLInputElement | null>
  isOpen: boolean
  listId: string
  open: () => void
  query: string
  registerItem: (item: ItemRecord) => () => void
  required: boolean
  restoreCommitted: () => void
  select: (item: ItemRecord) => void
  selectedId: string | null
  setActiveId: (id: string | null) => void
  syncOpenState: (open: boolean) => void
  typeQuery: (query: string) => void
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null)

function useComboboxContext(component: string) {
  const context = useContext(ComboboxContext)
  if (!context) {
    throw new Error(`${component} must be rendered inside Combobox`)
  }
  return context
}

type NativeRootProps = ComponentPropsWithRef<'div'>

export type ComboboxProps = Omit<NativeRootProps, 'className' | 'defaultValue' | 'style'> & {
  defaultValue?: string
  disabled?: boolean
  form?: string
  name?: string
  onValueChange?: (value: string) => void
  required?: boolean
  requiredMessage?: string
  sx?: StyleXStyles
  value?: string
}

/** Root controller for a native-input, popover-backed combobox. */
export function Combobox({
  children,
  defaultValue = '',
  disabled = false,
  form,
  name,
  onValueChange,
  ref,
  required = false,
  requiredMessage = 'Please select an option.',
  sx,
  value,
  ...props
}: ComboboxProps) {
  const generatedId = useId().replaceAll(':', '')
  const inputId = `stylextras-combobox-input-${generatedId}`
  const contentId = `stylextras-combobox-content-${generatedId}`
  const listId = `stylextras-combobox-list-${generatedId}`
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const {
    getItems,
    register: registerCollectionItem,
    version,
  } = useDomOrderedCollection<ItemRecord>('Combobox')
  const defaultValueRef = useRef(defaultValue)
  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const selectedValue = controlled ? value : uncontrolledValue
  const selectedValueRef = useRef(selectedValue)
  const [query, setQuery] = useState('')
  const isDraftingRef = useRef(false)
  const [filterTerm, setFilterTerm] = useState('')
  const filterTermRef = useRef(filterTerm)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  selectedValueRef.current = selectedValue
  filterTermRef.current = filterTerm

  const close = useCallback(() => {
    const content = contentRef.current
    if (content?.matches(':popover-open')) {
      content.hidePopover()
    }
    setIsOpen(false)
    setActiveId(null)
  }, [])

  const getCommittedItem = useCallback(() => {
    const items = getItems()
    const currentItem = selectedId
      ? items.find((item) => item.id === selectedId && item.value === selectedValueRef.current)
      : undefined
    return currentItem ?? items.find((item) => item.value === selectedValueRef.current)
  }, [getItems, selectedId])

  const open = useCallback(() => {
    if (disabled) return
    const content = contentRef.current
    const input = inputRef.current
    if (content && !content.matches(':popover-open')) {
      try {
        showPopoverWithSource(content, input ?? undefined)
      } catch {
        // The state still updates in DOM environments without Popover API support.
      }
    }
    const selectedItem = getCommittedItem()
    setActiveId(selectedItem && !selectedItem.disabled ? selectedItem.id : null)
    setIsOpen(true)
  }, [disabled, getCommittedItem])

  const syncOpenState = useCallback((nextOpen: boolean) => {
    setIsOpen(nextOpen)
    if (!nextOpen) setActiveId(null)
  }, [])

  const matchesFilter = useCallback((item: ItemRecord) => {
    const normalizedQuery = filterTermRef.current.trim().toLocaleLowerCase()
    if (!normalizedQuery) return true
    return (
      item.label.toLocaleLowerCase().includes(normalizedQuery) ||
      item.value.toLocaleLowerCase().includes(normalizedQuery)
    )
  }, [])

  const getMatchingItems = useCallback(
    () => getItems().filter(matchesFilter),
    [getItems, matchesFilter],
  )

  const getNavigableItems = useCallback(
    () => getMatchingItems().filter((item) => !item.disabled),
    [getMatchingItems],
  )

  const registerItem = useCallback(
    (item: ItemRecord) => registerCollectionItem(item),
    [registerCollectionItem],
  )

  const commitValue = useCallback(
    (nextValue: string) => {
      if (!controlled) setUncontrolledValue(nextValue)
      onValueChange?.(nextValue)
    },
    [controlled, onValueChange],
  )

  const select = useCallback(
    (item: ItemRecord) => {
      if (disabled || item.disabled) return
      isDraftingRef.current = false
      commitValue(item.value)
      setQuery(item.label)
      setFilterTerm('')
      setSelectedId(item.id)
      close()
      inputRef.current?.focus()
    },
    [close, commitValue, disabled],
  )

  const typeQuery = useCallback(
    (nextQuery: string) => {
      isDraftingRef.current = true
      setQuery(nextQuery)
      setFilterTerm(nextQuery)
      open()
      setActiveId(null)
    },
    [open],
  )

  const restoreCommitted = useCallback(() => {
    isDraftingRef.current = false
    const selectedItem = getCommittedItem()
    setQuery(selectedItem?.label ?? '')
    setFilterTerm('')
    setSelectedId(selectedItem?.id ?? null)
    setActiveId(selectedItem && !selectedItem.disabled ? selectedItem.id : null)
  }, [getCommittedItem])

  useEffect(() => {
    const input = inputRef.current
    const form = input?.form
    if (!form || controlled) return
    const reset = () => {
      isDraftingRef.current = false
      const nextValue = defaultValueRef.current
      setUncontrolledValue(nextValue)
      setFilterTerm('')
      setActiveId(null)
      setSelectedId(null)
      setQuery(getItems().find((item) => item.value === nextValue)?.label ?? '')
      close()
    }
    form.addEventListener('reset', reset)
    return () => form.removeEventListener('reset', reset)
  }, [close, controlled, getItems])

  useEffect(() => {
    const items = getItems()
    const currentItem = selectedId
      ? items.find((item) => item.id === selectedId && item.value === selectedValue)
      : undefined
    const selectedItem = currentItem ?? items.find((item) => item.value === selectedValue)
    const nextSelectedId = selectedItem?.id ?? null
    if (nextSelectedId !== selectedId) setSelectedId(nextSelectedId)
    if (isDraftingRef.current) return
    if (selectedItem) {
      setQuery(selectedItem.label)
      setFilterTerm('')
    } else {
      setQuery('')
      setFilterTerm('')
    }
  }, [getItems, selectedId, selectedValue, version])

  useEffect(() => {
    inputRef.current?.setCustomValidity(required && !selectedValue ? requiredMessage : '')
  }, [required, requiredMessage, selectedValue])

  useEffect(() => {
    if (disabled) close()
  }, [close, disabled])

  useEffect(() => {
    if (isOpen && activeId && !getNavigableItems().some((item) => item.id === activeId)) {
      setActiveId(null)
    }
  }, [activeId, filterTerm, getNavigableItems, isOpen, version])

  const context = useMemo<ComboboxContextValue>(
    () => ({
      activeDescendant:
        isOpen && activeId && getNavigableItems().some((item) => item.id === activeId)
          ? activeId
          : undefined,
      activeId,
      close,
      contentId,
      contentRef,
      disabled,
      filterTerm,
      form,
      getMatchingItems,
      getNavigableItems,
      inputId,
      inputRef,
      isOpen,
      listId,
      open,
      query,
      registerItem,
      required,
      restoreCommitted,
      select,
      selectedId,
      setActiveId,
      syncOpenState,
      typeQuery,
    }),
    [
      activeId,
      close,
      contentId,
      disabled,
      filterTerm,
      form,
      getMatchingItems,
      getNavigableItems,
      inputId,
      isOpen,
      listId,
      open,
      query,
      registerItem,
      required,
      restoreCommitted,
      select,
      selectedId,
      syncOpenState,
      typeQuery,
      version,
    ],
  )

  return (
    <ComboboxContext value={context}>
      <div ref={ref} {...props} {...stylex.props(styles.root, sx)}>
        {children}
        {name ? (
          <input type="hidden" disabled={disabled} form={form} name={name} value={selectedValue} />
        ) : null}
      </div>
    </ComboboxContext>
  )
}

type NativeInputProps = ComponentPropsWithRef<'input'>

export type ComboboxInputProps = Omit<
  NativeInputProps,
  | 'aria-activedescendant'
  | 'aria-autocomplete'
  | 'aria-controls'
  | 'aria-expanded'
  | 'className'
  | 'disabled'
  | 'form'
  | 'name'
  | 'required'
  | 'role'
  | 'style'
  | 'type'
  | 'value'
> & {
  sx?: StyleXStyles
  type?: 'search' | 'text'
}

export function ComboboxInput({
  autoComplete = 'off',
  id,
  onChange,
  onClick,
  onFocus,
  onKeyDown,
  onPointerCancel,
  onPointerDown,
  onPointerUp,
  ref,
  sx,
  type = 'search',
  ...props
}: ComboboxInputProps) {
  const context = useComboboxContext('ComboboxInput')
  const pointerFocusRef = useRef(false)

  const setRefs = useMemo(() => composeRefs(context.inputRef, ref), [context.inputRef, ref])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.nativeEvent.isComposing) return

    const items = context.getNavigableItems()
    let nextItem: ItemRecord | undefined

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        context.open()
        nextItem = getAdjacentItem(items, context.activeId, 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        context.open()
        nextItem = getAdjacentItem(items, context.activeId, -1)
        break
      case 'Home':
        if (!context.isOpen) return
        nextItem = items[0]
        if (!nextItem) return
        event.preventDefault()
        break
      case 'End':
        if (!context.isOpen) return
        nextItem = items.at(-1)
        if (!nextItem) return
        event.preventDefault()
        break
      case 'Enter': {
        if (!context.isOpen || !context.activeId) return
        const activeItem = items.find((item) => item.id === context.activeId)
        if (activeItem) {
          event.preventDefault()
          context.select(activeItem)
        }
        return
      }
      case 'Escape':
        if (context.isOpen) {
          event.preventDefault()
          context.restoreCommitted()
          context.close()
        }
        return
      case 'Tab':
        context.close()
        return
      default:
        return
    }

    if (nextItem) {
      context.setActiveId(nextItem.id)
      nextItem.getElement()?.scrollIntoView({ block: 'nearest' })
    }
  }

  return (
    <input
      ref={setRefs}
      {...props}
      id={id ?? context.inputId}
      type={type}
      role="combobox"
      aria-activedescendant={context.activeDescendant}
      aria-autocomplete="list"
      aria-controls={context.listId}
      aria-expanded={context.isOpen}
      autoComplete={autoComplete}
      disabled={context.disabled}
      form={context.form}
      name={undefined}
      required={context.required}
      value={context.query}
      onChange={(event) => {
        onChange?.(event)
        if (!event.defaultPrevented) context.typeQuery(event.currentTarget.value)
      }}
      onClick={(event) => {
        onClick?.(event)
        pointerFocusRef.current = false
        if (!event.defaultPrevented) context.open()
      }}
      onFocus={(event) => {
        onFocus?.(event)
        const pointerInitiated = pointerFocusRef.current
        pointerFocusRef.current = false
        if (!event.defaultPrevented && !pointerInitiated) context.open()
      }}
      onKeyDown={handleKeyDown}
      onPointerCancel={(event) => {
        onPointerCancel?.(event)
        pointerFocusRef.current = false
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (!event.defaultPrevented) pointerFocusRef.current = true
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event)
        pointerFocusRef.current = false
      }}
      {...stylex.props(styles.input, sx)}
    />
  )
}

type NativeContentProps = ComponentPropsWithRef<'div'>

export type ComboboxContentProps = Omit<
  NativeContentProps,
  'className' | 'id' | 'popover' | 'role' | 'style'
> & {
  sx?: StyleXStyles
}

export function ComboboxContent({ children, onToggle, ref, sx, ...props }: ComboboxContentProps) {
  const context = useComboboxContext('ComboboxContent')
  const setRefs = useMemo(() => composeRefs(context.contentRef, ref), [context.contentRef, ref])

  return (
    <div
      ref={setRefs}
      {...props}
      id={context.contentId}
      popover="auto"
      role={undefined}
      onToggle={(event) => {
        onToggle?.(event)
        context.syncOpenState(event.currentTarget.matches(':popover-open'))
      }}
      {...stylex.props(styles.content, sx)}
    >
      {children}
    </div>
  )
}

export type ComboboxListProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'id' | 'role' | 'style'
> & {
  sx?: StyleXStyles
}

/** The listbox owner for ComboboxItem options. Keep status and empty content as siblings. */
export function ComboboxList({ ref, sx, ...props }: ComboboxListProps) {
  const context = useComboboxContext('ComboboxList')
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

type NativeItemProps = ComponentPropsWithRef<'div'>

export type ComboboxItemProps = Omit<
  NativeItemProps,
  | 'aria-disabled'
  | 'aria-selected'
  | 'className'
  | 'hidden'
  | 'id'
  | 'onClick'
  | 'role'
  | 'style'
  | 'tabIndex'
> & {
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  sx?: StyleXStyles
  textValue?: string
  value: string
}

export function ComboboxItem({
  children,
  disabled = false,
  onClick,
  onMouseDown,
  onPointerMove,
  ref,
  sx,
  textValue,
  value,
  ...props
}: ComboboxItemProps) {
  const context = useComboboxContext('ComboboxItem')
  const generatedId = useId().replaceAll(':', '')
  const itemRef = useRef<HTMLDivElement>(null)
  const label = textValue ?? (typeof children === 'string' ? children : value)
  const id = `${context.contentId}-option-${generatedId}`
  const item = useMemo<ItemRecord>(
    () => ({ disabled, getElement: () => itemRef.current, id, label, value }),
    [disabled, id, label, value],
  )
  const normalizedFilter = context.filterTerm.trim().toLocaleLowerCase()
  const hidden = Boolean(
    normalizedFilter &&
      !label.toLocaleLowerCase().includes(normalizedFilter) &&
      !value.toLocaleLowerCase().includes(normalizedFilter),
  )

  useEffect(() => context.registerItem(item), [context.registerItem, item])

  const setRefs = useMemo(() => composeRefs(itemRef, ref), [ref])

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event)
    if (!event.defaultPrevented && !context.disabled && !disabled) context.setActiveId(id)
  }

  return (
    <div
      ref={setRefs}
      {...props}
      id={id}
      role="option"
      aria-disabled={context.disabled || disabled || undefined}
      aria-selected={context.isOpen ? context.activeId === id : context.selectedId === id}
      tabIndex={undefined}
      hidden={hidden}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.select(item)
      }}
      onMouseDown={(event) => {
        onMouseDown?.(event)
        event.preventDefault()
      }}
      onPointerMove={handlePointerMove}
      {...stylex.props(
        styles.item,
        context.activeId === id && styles.itemActive,
        (context.disabled || disabled) && styles.itemDisabled,
        hidden && styles.hidden,
        sx,
      )}
    >
      {children}
    </div>
  )
}

export type ComboboxEmptyProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'hidden' | 'style'
> & {
  children?: ReactNode
  sx?: StyleXStyles
}

export type ComboboxStatusProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-atomic' | 'aria-live' | 'children' | 'className' | 'role' | 'style'
> & {
  children: string | ((count: number) => string)
  delay?: number
  sx?: StyleXStyles
}

/** A polite, visually hidden plain-text result count controlled by the caller's language. */
export function ComboboxStatus({ children, delay = 150, ref, sx, ...props }: ComboboxStatusProps) {
  const context = useComboboxContext('ComboboxStatus')
  const count = context.getMatchingItems().length
  const [announcedCount, setAnnouncedCount] = useState(count)

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setAnnouncedCount(count),
      Number.isFinite(delay) ? Math.max(0, delay) : 150,
    )
    return () => window.clearTimeout(timeout)
  }, [count, delay])

  return (
    <div
      ref={ref}
      {...props}
      role="status"
      aria-atomic="true"
      aria-live="polite"
      {...stylex.props(styles.status, sx)}
    >
      {typeof children === 'function' ? children(announcedCount) : children}
    </div>
  )
}

export function ComboboxEmpty({ children = 'No results.', ref, sx, ...props }: ComboboxEmptyProps) {
  const context = useComboboxContext('ComboboxEmpty')
  const hidden = context.getMatchingItems().length > 0
  return (
    <div
      ref={ref}
      {...props}
      hidden={hidden}
      {...stylex.props(styles.empty, hidden && styles.hidden, sx)}
    >
      {children}
    </div>
  )
}

/* eslint-disable @stylexjs/valid-styles */
const styles = stylex.create({
  root: {
    anchorScope: '--stylextras-combobox',
    display: 'grid',
    position: 'relative',
  },
  input: {
    anchorName: '--stylextras-combobox',
    borderColor: {
      '[aria-invalid="true"]': colors.danger,
      default: colors.border,
      ':focus-visible': colors.focusRing,
      ':user-invalid': colors.danger,
      ':hover': colors.borderStrong,
    },
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    paddingInline: spacing.md,
    appearance: 'none',
    backgroundColor: colors.control,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRingOffset} ${colors.bg}, 0 0 0 calc(${stroke.focusRingOffset} + ${stroke.focusRing}) ${colors.focusRing}`,
    },
    boxSizing: 'border-box',
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
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
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
    minHeight: {
      default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
    minWidth: 0,
    width: '100%',
    '::-webkit-search-cancel-button': {
      display: 'none',
    },
    '::placeholder': {
      color: colors.fgMuted,
    },
  },
  content: {
    positionAnchor: '--stylextras-combobox',
    positionArea: 'bottom span-self-x-end',
    positionTryFallbacks: 'flip-block',
    transitionBehavior: 'allow-discrete',
    inset: 'auto',
    margin: 0,
    padding: spacing.xxs,
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    overscrollBehavior: 'contain',
    backgroundColor: colors.popover,
    boxShadow: elevation.md,
    color: colors.popoverForeground,
    insetInlineStart: {
      default: '50%',
      '@supports (position-anchor: --stylextras-combobox)': 'auto',
    },
    opacity: {
      default: 0,
      ':popover-open': 1,
    },
    position: 'fixed',
    scrollbarWidth: 'thin',
    transform: {
      default: 'translateY(-4px) scale(0.98)',
      ':popover-open': 'translateY(0) scale(1)',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'display, opacity, transform, overlay',
    transitionTimingFunction: motion.easeEmphasized,
    translate: {
      default: '-50% -50%',
      '@supports (position-anchor: --stylextras-combobox)': '0',
    },
    maxHeight: 'min(20rem, 50vh)',
    minWidth: {
      default: 'min(22rem, calc(100vw - 2rem))',
      '@supports (position-anchor: --stylextras-combobox)': 'anchor-size(width)',
    },
    overflowY: 'auto',
    top: {
      default: '50%',
      '@supports (position-anchor: --stylextras-combobox)': 'auto',
    },
    width: 'max-content',
  },
  list: {
    gap: spacing.xxxs,
    display: 'grid',
  },
  item: {
    borderRadius: radius.xs,
    outline: 'none',
    paddingInline: spacing.sm,
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
    },
    color: {
      default: colors.popoverForeground,
      ':hover': colors.accentText,
    },
    cursor: 'default',
    display: 'flex',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    userSelect: 'none',
    minHeight: {
      default: spacing.targetMin,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
  },
  itemDisabled: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  itemActive: {
    backgroundColor: colors.accent,
    color: colors.accentText,
  },
  hidden: {
    display: 'none',
  },
  empty: {
    padding: spacing.md,
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
/* eslint-enable @stylexjs/valid-styles */
