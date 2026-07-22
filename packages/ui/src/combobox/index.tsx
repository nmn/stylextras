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
import { showPopoverWithSource } from '../platform-polyfills/popover-source'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type ItemRecord = {
  disabled: boolean
  id: string
  label: string
  value: string
}

type ComboboxContextValue = {
  activeDescendant: string | undefined
  activeValue: string | null
  close: () => void
  contentId: string
  contentRef: React.RefObject<HTMLDivElement | null>
  disabled: boolean
  filterTerm: string
  form: string | undefined
  getNavigableItems: () => ItemRecord[]
  inputId: string
  inputRef: React.RefObject<HTMLInputElement | null>
  isOpen: boolean
  open: () => void
  query: string
  registerItem: (item: ItemRecord) => () => void
  required: boolean
  select: (item: ItemRecord) => void
  selectedValue: string
  setActiveValue: (value: string | null) => void
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
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef(new Map<string, ItemRecord>())
  const defaultValueRef = useRef(defaultValue)
  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const selectedValue = controlled ? value : uncontrolledValue
  const selectedValueRef = useRef(selectedValue)
  const [query, setQuery] = useState('')
  const preserveTypedQueryRef = useRef(false)
  const [filterTerm, setFilterTerm] = useState('')
  const filterTermRef = useRef(filterTerm)
  const [activeValue, setActiveValue] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [itemsVersion, setItemsVersion] = useState(0)

  selectedValueRef.current = selectedValue
  filterTermRef.current = filterTerm

  const close = useCallback(() => {
    const content = contentRef.current
    if (content?.matches(':popover-open')) {
      content.hidePopover()
    }
    setIsOpen(false)
  }, [])

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
    setIsOpen(true)
  }, [disabled])

  const syncOpenState = useCallback((nextOpen: boolean) => setIsOpen(nextOpen), [])

  const matchesFilter = useCallback((item: ItemRecord) => {
    const normalizedQuery = filterTermRef.current.trim().toLocaleLowerCase()
    if (!normalizedQuery) return true
    return (
      item.label.toLocaleLowerCase().includes(normalizedQuery) ||
      item.value.toLocaleLowerCase().includes(normalizedQuery)
    )
  }, [])

  const getNavigableItems = useCallback(
    () => [...itemsRef.current.values()].filter((item) => !item.disabled && matchesFilter(item)),
    [matchesFilter],
  )

  const registerItem = useCallback((item: ItemRecord) => {
    itemsRef.current.set(item.value, item)
    if (item.value === selectedValueRef.current && !preserveTypedQueryRef.current) {
      setQuery(item.label)
      setFilterTerm('')
    }
    setItemsVersion((version) => version + 1)
    return () => {
      itemsRef.current.delete(item.value)
      setItemsVersion((version) => version + 1)
    }
  }, [])

  const commitValue = useCallback(
    (nextValue: string) => {
      if (!controlled) setUncontrolledValue(nextValue)
      onValueChange?.(nextValue)
    },
    [controlled, onValueChange],
  )

  const select = useCallback(
    (item: ItemRecord) => {
      if (item.disabled) return
      preserveTypedQueryRef.current = false
      commitValue(item.value)
      setQuery(item.label)
      setFilterTerm('')
      setActiveValue(item.value)
      close()
      inputRef.current?.focus()
    },
    [close, commitValue],
  )

  const typeQuery = useCallback(
    (nextQuery: string) => {
      setQuery(nextQuery)
      setFilterTerm(nextQuery)
      setActiveValue(null)
      if (selectedValueRef.current) {
        preserveTypedQueryRef.current = true
        commitValue('')
      }
      open()
    },
    [commitValue, open],
  )

  useEffect(() => {
    const input = inputRef.current
    const form = input?.form
    if (!form || controlled) return
    const reset = () => {
      preserveTypedQueryRef.current = false
      const nextValue = defaultValueRef.current
      setUncontrolledValue(nextValue)
      setFilterTerm('')
      setActiveValue(null)
      setQuery(itemsRef.current.get(nextValue)?.label ?? '')
      close()
    }
    form.addEventListener('reset', reset)
    return () => form.removeEventListener('reset', reset)
  }, [close, controlled])

  useEffect(() => {
    if (preserveTypedQueryRef.current && selectedValue === '') {
      preserveTypedQueryRef.current = false
      return
    }
    preserveTypedQueryRef.current = false
    const selectedItem = itemsRef.current.get(selectedValue)
    if (selectedItem) {
      setQuery(selectedItem.label)
      setFilterTerm('')
    } else {
      setQuery('')
      setFilterTerm('')
    }
  }, [selectedValue])

  useEffect(() => {
    inputRef.current?.setCustomValidity(required && !selectedValue ? requiredMessage : '')
  }, [required, requiredMessage, selectedValue])

  const context = useMemo<ComboboxContextValue>(
    () => ({
      activeDescendant: activeValue ? itemsRef.current.get(activeValue)?.id : undefined,
      activeValue,
      close,
      contentId,
      contentRef,
      disabled,
      filterTerm,
      form,
      getNavigableItems,
      inputId,
      inputRef,
      isOpen,
      open,
      query,
      registerItem,
      required,
      select,
      selectedValue,
      setActiveValue,
      syncOpenState,
      typeQuery,
    }),
    [
      activeValue,
      close,
      contentId,
      disabled,
      filterTerm,
      form,
      getNavigableItems,
      inputId,
      isOpen,
      itemsVersion,
      open,
      query,
      registerItem,
      required,
      select,
      selectedValue,
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
  | 'name'
  | 'role'
  | 'style'
  | 'value'
> & {
  sx?: StyleXStyles
}

export function ComboboxInput({
  disabled,
  form,
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

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      context.inputRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [context.inputRef, ref],
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.nativeEvent.isComposing) return

    const items = context.getNavigableItems()
    const currentIndex = items.findIndex((item) => item.value === context.activeValue)
    let nextItem: ItemRecord | undefined

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        context.open()
        nextItem = items[(currentIndex + 1 + items.length) % items.length]
        break
      case 'ArrowUp':
        event.preventDefault()
        context.open()
        nextItem = items[(currentIndex - 1 + items.length) % items.length]
        break
      case 'Home':
        if (!context.isOpen) return
        event.preventDefault()
        nextItem = items[0]
        break
      case 'End':
        if (!context.isOpen) return
        event.preventDefault()
        nextItem = items.at(-1)
        break
      case 'Enter': {
        if (!context.isOpen || !context.activeValue) return
        const activeItem = items.find((item) => item.value === context.activeValue)
        if (activeItem) {
          event.preventDefault()
          context.select(activeItem)
        }
        return
      }
      case 'Escape':
        if (context.isOpen) {
          event.preventDefault()
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
      context.setActiveValue(nextItem.value)
      document.getElementById(nextItem.id)?.scrollIntoView({ block: 'nearest' })
    }
  }

  return (
    <input
      ref={setRefs}
      id={id ?? context.inputId}
      type={type}
      role="combobox"
      aria-activedescendant={context.activeDescendant}
      aria-autocomplete="list"
      aria-controls={context.contentId}
      aria-expanded={context.isOpen}
      autoComplete="off"
      disabled={context.disabled || disabled}
      form={form ?? context.form}
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
      {...props}
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
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      context.contentRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [context.contentRef, ref],
  )

  return (
    <div
      ref={setRefs}
      id={context.contentId}
      popover="auto"
      role="listbox"
      onToggle={(event) => {
        onToggle?.(event)
        context.syncOpenState(event.currentTarget.matches(':popover-open'))
      }}
      {...props}
      {...stylex.props(styles.content, sx)}
    >
      {children}
    </div>
  )
}

type NativeItemProps = ComponentPropsWithRef<'div'>

export type ComboboxItemProps = Omit<
  NativeItemProps,
  'aria-disabled' | 'aria-selected' | 'className' | 'hidden' | 'id' | 'onClick' | 'role' | 'style'
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
  const label = textValue ?? (typeof children === 'string' ? children : value)
  const id = `${context.contentId}-option-${generatedId}`
  const item = useMemo<ItemRecord>(
    () => ({ disabled, id, label, value }),
    [disabled, id, label, value],
  )
  const normalizedFilter = context.filterTerm.trim().toLocaleLowerCase()
  const hidden = Boolean(
    normalizedFilter &&
      !label.toLocaleLowerCase().includes(normalizedFilter) &&
      !value.toLocaleLowerCase().includes(normalizedFilter),
  )

  useEffect(() => context.registerItem(item), [context.registerItem, item])

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event)
    if (!event.defaultPrevented && !disabled) context.setActiveValue(value)
  }

  return (
    <div
      ref={ref}
      {...props}
      id={id}
      role="option"
      aria-disabled={disabled || undefined}
      aria-selected={context.selectedValue === value}
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
        context.activeValue === value && styles.itemActive,
        disabled && styles.itemDisabled,
        hidden && styles.hidden,
        sx,
      )}
    >
      {children}
    </div>
  )
}

export type ComboboxEmptyProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & {
  children?: ReactNode
  sx?: StyleXStyles
}

export type ComboboxStatusProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-atomic' | 'aria-live' | 'children' | 'className' | 'role' | 'style'
> & {
  children: ReactNode | ((count: number) => ReactNode)
  sx?: StyleXStyles
}

/** A polite, visually hidden result-count announcement controlled by the caller's language. */
export function ComboboxStatus({ children, ref, sx, ...props }: ComboboxStatusProps) {
  const context = useComboboxContext('ComboboxStatus')
  const count = context.getNavigableItems().length
  return (
    <div
      ref={ref}
      role="status"
      aria-atomic="true"
      aria-live="polite"
      {...props}
      {...stylex.props(styles.status, sx)}
    >
      {typeof children === 'function' ? children(count) : children}
    </div>
  )
}

export function ComboboxEmpty({ children = 'No results.', ref, sx, ...props }: ComboboxEmptyProps) {
  const context = useComboboxContext('ComboboxEmpty')
  const hidden = context.getNavigableItems().length > 0
  return (
    <div
      ref={ref}
      hidden={hidden}
      {...props}
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
      ':hover': colors.accentForeground,
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
    color: colors.accentForeground,
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
