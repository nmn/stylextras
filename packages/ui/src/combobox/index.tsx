'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
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

type ComboboxItemRecord = DomOrderedCollectionRecord & {
  disabled: boolean
  label: string
}

function normalizeFilter(value: string) {
  return value.trim().toLocaleLowerCase()
}

function matchesFilter(item: ComboboxItemRecord, filter: string) {
  return (
    !filter ||
    item.label.toLocaleLowerCase().includes(filter) ||
    item.value.toLocaleLowerCase().includes(filter)
  )
}

type ComboboxContextValue = {
  activeId: string | null
  close: () => void
  contentId: string
  contentRef: RefObject<HTMLDivElement | null>
  disabled: boolean
  filter: string
  form: string | undefined
  getNavigableItems: () => ComboboxItemRecord[]
  inputId: string
  inputRef: RefObject<HTMLInputElement | null>
  isOpen: boolean
  listId: string
  matchingCount: number
  open: () => void
  query: string
  registerItem: (item: ComboboxItemRecord) => () => void
  required: boolean
  restoreCommitted: () => void
  select: (item: ComboboxItemRecord) => void
  selectedId: string | null
  setActiveId: (id: string | null) => void
  syncOpenState: (open: boolean) => void
  typeQuery: (query: string) => void
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null)

function useComboboxContext(component: string) {
  const context = useContext(ComboboxContext)
  if (!context) throw new Error(`${component} must be rendered inside Combobox`)
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

/** Root state for a text input and native Popover listbox. */
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
    items,
    register: registerItem,
  } = useDomOrderedCollection<ComboboxItemRecord>('Combobox')
  const defaultValueRef = useRef(defaultValue)
  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const selectedValue = controlled ? value : uncontrolledValue
  const [draft, setDraft] = useState<string | null>(null)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [activeOptionId, setActiveOptionId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const filter = normalizeFilter(draft ?? '')
  const matchingItems = items.filter((item) => matchesFilter(item, filter))
  const getMatchingItems = useCallback(
    () => getItems().filter((item) => matchesFilter(item, filter)),
    [filter, getItems],
  )
  const getNavigableItems = useCallback(
    () => (disabled ? [] : getMatchingItems().filter((item) => !item.disabled)),
    [disabled, getMatchingItems],
  )
  const selectedItem =
    (selectedOptionId
      ? items.find((item) => item.id === selectedOptionId && item.value === selectedValue)
      : undefined) ?? items.find((item) => item.value === selectedValue)
  const selectedId = selectedItem?.id ?? null
  const selectedItemDisabled = selectedItem?.disabled ?? false
  const query = draft ?? selectedItem?.label ?? ''
  const activeId =
    activeOptionId &&
    !disabled &&
    matchingItems.some((item) => item.id === activeOptionId && !item.disabled)
      ? activeOptionId
      : null
  const matchingCount = matchingItems.length

  const close = useCallback(() => {
    const content = contentRef.current
    if (content?.matches(':popover-open')) content.hidePopover()
    setIsOpen(false)
    setActiveOptionId(null)
  }, [])

  const open = useCallback(() => {
    if (disabled) return
    const content = contentRef.current
    if (!content) return
    if (!content.matches(':popover-open')) {
      showPopoverWithSource(content, inputRef.current ?? undefined)
    }
    setActiveOptionId(selectedId && !selectedItemDisabled ? selectedId : null)
  }, [disabled, selectedId, selectedItemDisabled])

  const syncOpenState = useCallback((nextOpen: boolean) => {
    setIsOpen(nextOpen)
    if (!nextOpen) setActiveOptionId(null)
  }, [])

  const select = useCallback(
    (item: ComboboxItemRecord) => {
      if (disabled || item.disabled) return
      if (!controlled) setUncontrolledValue(item.value)
      onValueChange?.(item.value)
      setDraft(null)
      setSelectedOptionId(item.id)
      close()
      inputRef.current?.focus()
    },
    [close, controlled, disabled, onValueChange],
  )

  const typeQuery = useCallback(
    (nextQuery: string) => {
      setDraft(nextQuery)
      open()
      setActiveOptionId(null)
    },
    [open],
  )

  const restoreCommitted = useCallback(() => {
    setDraft(null)
  }, [])

  useEffect(() => {
    const currentForm = inputRef.current?.form
    if (!currentForm || controlled) return
    const reset = () => {
      setUncontrolledValue(defaultValueRef.current)
      setDraft(null)
      setSelectedOptionId(null)
      close()
    }
    currentForm.addEventListener('reset', reset)
    return () => currentForm.removeEventListener('reset', reset)
  }, [close, controlled])

  useEffect(() => {
    inputRef.current?.setCustomValidity(required && !selectedValue ? requiredMessage : '')
  }, [required, requiredMessage, selectedValue])

  useEffect(() => {
    if (disabled) close()
  }, [close, disabled])

  const context = useMemo<ComboboxContextValue>(
    () => ({
      activeId,
      close,
      contentId,
      contentRef,
      disabled,
      filter,
      form,
      getNavigableItems,
      inputId,
      inputRef,
      isOpen,
      listId,
      matchingCount,
      open,
      query,
      registerItem,
      required,
      restoreCommitted,
      select,
      selectedId,
      setActiveId: setActiveOptionId,
      syncOpenState,
      typeQuery,
    }),
    [
      activeId,
      close,
      contentId,
      disabled,
      filter,
      form,
      getNavigableItems,
      inputId,
      isOpen,
      listId,
      matchingCount,
      open,
      query,
      registerItem,
      required,
      restoreCommitted,
      select,
      selectedId,
      syncOpenState,
      typeQuery,
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
  onKeyDown,
  ref,
  sx,
  type = 'search',
  ...props
}: ComboboxInputProps) {
  const context = useComboboxContext('ComboboxInput')
  const setRefs = useMemo(() => composeRefs(context.inputRef, ref), [context.inputRef, ref])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.nativeEvent.isComposing) return

    const options = context.getNavigableItems()
    let nextOption: ComboboxItemRecord | undefined
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        context.open()
        nextOption = getAdjacentItem(options, context.activeId, 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        context.open()
        nextOption = getAdjacentItem(options, context.activeId, -1)
        break
      case 'Home':
        if (!context.isOpen || !options[0]) return
        event.preventDefault()
        nextOption = options[0]
        break
      case 'End':
        if (!context.isOpen || !options.at(-1)) return
        event.preventDefault()
        nextOption = options.at(-1)
        break
      case 'Enter': {
        if (!context.isOpen || !context.activeId) return
        const option = options.find((candidate) => candidate.id === context.activeId)
        if (option) {
          event.preventDefault()
          context.select(option)
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

    if (nextOption) {
      context.setActiveId(nextOption.id)
      nextOption.getElement()?.scrollIntoView({ block: 'nearest' })
    }
  }

  return (
    <input
      ref={setRefs}
      {...props}
      id={id ?? context.inputId}
      type={type}
      role="combobox"
      aria-activedescendant={context.isOpen ? (context.activeId ?? undefined) : undefined}
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
        if (!event.defaultPrevented) context.open()
      }}
      onKeyDown={handleKeyDown}
      {...stylex.props(styles.input, sx)}
    />
  )
}

type NativeContentProps = ComponentPropsWithRef<'div'>

export type ComboboxContentProps = Omit<
  NativeContentProps,
  'className' | 'id' | 'popover' | 'role' | 'style'
> & { sx?: StyleXStyles }

export function ComboboxContent({ children, onToggle, ref, sx, ...props }: ComboboxContentProps) {
  const context = useComboboxContext('ComboboxContent')
  const setRefs = useMemo(() => composeRefs(context.contentRef, ref), [context.contentRef, ref])
  return (
    <div
      ref={setRefs}
      {...props}
      id={context.contentId}
      popover="auto"
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
> & { sx?: StyleXStyles }

/** The listbox owner for options; status and empty content stay outside it. */
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
  const id = `${context.contentId}-option-${generatedId}`
  const label = textValue ?? (typeof children === 'string' ? children : value)
  const item = useMemo<ComboboxItemRecord>(
    () => ({ disabled, getElement: () => itemRef.current, id, label, value }),
    [disabled, id, label, value],
  )
  const hidden = !matchesFilter(item, context.filter)
  const unavailable = context.disabled || disabled
  const setRefs = useMemo(() => composeRefs(itemRef, ref), [ref])

  useEffect(() => context.registerItem(item), [context.registerItem, item])

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event)
    if (!event.defaultPrevented && !unavailable) context.setActiveId(id)
  }

  return (
    <div
      ref={setRefs}
      {...props}
      id={id}
      role="option"
      aria-disabled={unavailable || undefined}
      aria-selected={context.isOpen ? context.activeId === id : context.selectedId === id}
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
        unavailable && styles.itemDisabled,
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
> & { children?: ReactNode; sx?: StyleXStyles }

export type ComboboxStatusProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-atomic' | 'aria-live' | 'children' | 'className' | 'role' | 'style'
> & {
  children: string | ((count: number) => string)
  delay?: number
  sx?: StyleXStyles
}

/** A localizable, polite result-count announcement. */
export function ComboboxStatus({ children, delay = 150, ref, sx, ...props }: ComboboxStatusProps) {
  const { matchingCount } = useComboboxContext('ComboboxStatus')
  const [announcedCount, setAnnouncedCount] = useState(matchingCount)

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setAnnouncedCount(matchingCount),
      Number.isFinite(delay) ? Math.max(0, delay) : 150,
    )
    return () => window.clearTimeout(timeout)
  }, [delay, matchingCount])

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
  const { matchingCount } = useComboboxContext('ComboboxEmpty')
  const hidden = matchingCount > 0
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
