'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import {
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useState,
} from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { Button, type AccessibleButtonPropsWithout } from '../button'
import { ensureFocusgroupPolyfill, focusgroupAttributes, focusgroupRef } from '../focusgroup'
import { getPopoverSource } from '../platform-polyfills/popover-source'
import { usePopoverPointerToggleGuard } from '../popover/pointer-toggle'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'
import { showContextMenuAt } from './open'

type SxProp = { sx?: StyleXStyles }

export type ContextMenuTriggerProps = Omit<
  ComponentPropsWithRef<'div'>,
  | 'aria-controls'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'aria-label'
  | 'aria-labelledby'
  | 'className'
  | 'role'
  | 'style'
> &
  AccessibleAriaNameProps &
  SxProp & { target: string }
export type ContextMenuButtonProps = AccessibleButtonPropsWithout<
  | 'aria-controls'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'popoverTarget'
  | 'popoverTargetAction'
> & { target: string }
export type ContextMenuProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'popover' | 'role' | 'style'
> &
  AccessibleAriaNameProps &
  SxProp
export type ContextMenuItemProps = Omit<
  ComponentPropsWithRef<'button'>,
  'className' | 'role' | 'style'
> &
  SxProp
export type ContextMenuLabelProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> &
  SxProp
export type ContextMenuSeparatorProps = Omit<ComponentPropsWithRef<'hr'>, 'className' | 'style'> &
  SxProp

const MENU_ITEM_SELECTOR = '[role="menuitem"]'
const typeaheadState = new WeakMap<HTMLElement, { query: string; updatedAt: number }>()

function isContextMenuOpen(menu: HTMLElement) {
  return menu.matches(':popover-open')
}

function getContextMenuSources(menu: HTMLElement) {
  if (!menu.id) return []
  return Array.from(
    document.querySelectorAll<HTMLElement>('[aria-controls][aria-haspopup="menu"]'),
  ).filter((source) => source.getAttribute('aria-controls')?.split(/\s+/).includes(menu.id))
}

function syncContextMenuSources(menu: HTMLElement, expanded: boolean) {
  for (const source of getContextMenuSources(menu)) {
    source.setAttribute('aria-expanded', String(expanded))
  }
}

function restoreContextMenuFocus(menu: HTMLElement, force = false) {
  const source = getPopoverSource(menu)
  if (!source?.isConnected) return
  requestAnimationFrame(() => {
    if (isContextMenuOpen(menu)) return
    const activeElement = document.activeElement
    if (
      !force &&
      activeElement instanceof HTMLElement &&
      activeElement !== document.body &&
      !menu.contains(activeElement)
    ) {
      return
    }
    source.focus({ preventScroll: true })
  })
}

function useContextMenuExpanded(target: string) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const menu = document.getElementById(target)
    if (!(menu instanceof HTMLElement)) return
    const handleToggle = () => setExpanded(isContextMenuOpen(menu))
    menu.addEventListener('toggle', handleToggle)
    return () => menu.removeEventListener('toggle', handleToggle)
  }, [target])

  return expanded
}

function isContextMenuItemDiscoverable(item: HTMLElement) {
  if (
    item.matches(':disabled') ||
    item.closest('[hidden], [aria-hidden="true"], [inert]') ||
    item.getClientRects().length === 0
  ) {
    return false
  }

  const computed = getComputedStyle(item)
  return (
    computed.display !== 'none' &&
    computed.visibility !== 'hidden' &&
    computed.visibility !== 'collapse'
  )
}

function getContextMenuItems(menu: HTMLElement) {
  return Array.from(menu.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)).filter(
    isContextMenuItemDiscoverable,
  )
}

function handleMenuTypeahead(event: ReactKeyboardEvent<HTMLDivElement>) {
  if (event.key.length !== 1 || event.key === ' ' || event.altKey || event.ctrlKey || event.metaKey) {
    return
  }
  const menu = event.currentTarget
  const key = event.key.toLocaleLowerCase()
  const now = Date.now()
  const previous = typeaheadState.get(menu)
  const combined = previous && now - previous.updatedAt < 500 ? previous.query + key : key
  const query = Array.from(combined).every((character) => character === key) ? key : combined
  typeaheadState.set(menu, { query, updatedAt: now })
  const items = getContextMenuItems(menu)
  const activeIndex = items.indexOf(document.activeElement as HTMLElement)
  const orderedItems = [...items.slice(activeIndex + 1), ...items.slice(0, activeIndex + 1)]
  const match = orderedItems.find((item) =>
    item.textContent?.trim().toLocaleLowerCase().startsWith(query),
  )
  if (!match) return
  event.preventDefault()
  match.focus()
}

function openContextMenu(menu: HTMLElement, source: HTMLElement, clientX: number, clientY: number) {
  showContextMenuAt(menu, source, clientX, clientY)
  const scheduleFocus = () => {
    requestAnimationFrame(() => {
      if (!menu.matches(':popover-open')) return
      getContextMenuItems(menu)[0]?.focus()
    })
  }
  const ready = ensureFocusgroupPolyfill(menu)
  if (ready) void ready.then(scheduleFocus, scheduleFocus)
  else scheduleFocus()
}

/** A visible keyboard and touch alternative to the platform context-menu gesture. */
export function ContextMenuButton({
  onClick,
  onPointerCancel,
  onPointerDown,
  target,
  type = 'button',
  variant = 'outline',
  ...props
}: ContextMenuButtonProps) {
  const expanded = useContextMenuExpanded(target)
  const pointerToggle = usePopoverPointerToggleGuard(() => {
    const menu = document.getElementById(target)
    return menu instanceof HTMLElement ? menu : null
  })

  return (
    <Button
      {...props}
      type={type}
      variant={variant}
      aria-controls={target}
      aria-expanded={expanded}
      aria-haspopup="menu"
      onPointerCancel={(event) => {
        pointerToggle.clear()
        onPointerCancel?.(event)
      }}
      onPointerDown={(event) => {
        pointerToggle.clear()
        onPointerDown?.(event)
        if (event.defaultPrevented) return
        pointerToggle.capture()
      }}
      onClick={(event) => {
        onClick?.(event)
        const wasOpen = pointerToggle.consume()
        if (event.defaultPrevented) return
        const menu = document.getElementById(target)
        if (!(menu instanceof HTMLElement)) return
        if (wasOpen || expanded || isContextMenuOpen(menu)) {
          if (isContextMenuOpen(menu)) menu.hidePopover()
          event.currentTarget.focus({ preventScroll: true })
          return
        }
        const rect = event.currentTarget.getBoundingClientRect()
        const clientX = event.currentTarget.matches(':dir(rtl)') ? rect.right : rect.left
        openContextMenu(menu, event.currentTarget, clientX, rect.bottom)
      }}
    />
  )
}

/** A context gesture target with pointer and Shift+F10/ContextMenu-key support. */
export function ContextMenuTrigger({
  onContextMenu,
  onKeyDown,
  ref,
  sx,
  tabIndex = 0,
  target,
  ...props
}: ContextMenuTriggerProps) {
  const expanded = useContextMenuExpanded(target)

  return (
    <div
      {...props}
      ref={ref}
      role="group"
      tabIndex={tabIndex}
      aria-controls={target}
      aria-expanded={expanded}
      aria-haspopup="menu"
      onContextMenu={(event) => {
        onContextMenu?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        const menu = document.getElementById(target)
        if (!(menu instanceof HTMLElement)) return
        const { clientX, clientY, currentTarget } = event
        openContextMenu(menu, currentTarget, clientX, clientY)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) {
          return
        }
        event.preventDefault()
        const menu = document.getElementById(target)
        if (!(menu instanceof HTMLElement)) return
        const rect = event.currentTarget.getBoundingClientRect()
        const clientX = event.currentTarget.matches(':dir(rtl)') ? rect.x + rect.width : rect.x
        openContextMenu(menu, event.currentTarget, clientX, rect.y + rect.height)
      }}
      {...stylex.props(styles.trigger, sx)}
    />
  )
}

export function ContextMenu({ onBlur, onKeyDown, onToggle, ref, sx, ...props }: ContextMenuProps) {
  const setRef = focusgroupRef(ref)
  return (
    <div
      ref={setRef}
      popover="auto"
      role="menu"
      {...focusgroupAttributes('menu')}
      onBlur={(event) => {
        onBlur?.(event)
        const nextTarget = event.relatedTarget
        if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return
        if (event.currentTarget.matches(':popover-open')) event.currentTarget.hidePopover()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        if (event.key === 'Escape') {
          event.preventDefault()
          event.stopPropagation()
          event.currentTarget.dataset.restoreFocus = 'true'
          event.currentTarget.hidePopover()
          return
        }
        handleMenuTypeahead(event)
      }}
      onToggle={(event) => {
        onToggle?.(event)
        const menu = event.currentTarget
        const expanded = isContextMenuOpen(menu)
        syncContextMenuSources(menu, expanded)
        if (!expanded) {
          const forceRestore = menu.dataset.restoreFocus === 'true'
          delete menu.dataset.restoreFocus
          restoreContextMenuFocus(menu, forceRestore)
        }
      }}
      {...props}
      {...stylex.props(styles.menu, sx)}
    />
  )
}

export function ContextMenuItem({
  'aria-disabled': ariaDisabled,
  disabled = false,
  onClick,
  ref,
  sx,
  type = 'button',
  ...props
}: ContextMenuItemProps) {
  const isDisabled = disabled || ariaDisabled === true || ariaDisabled === 'true'
  return (
    <button
      ref={ref}
      type={type}
      role="menuitem"
      aria-disabled={isDisabled || undefined}
      onClick={(event) => {
        if (isDisabled) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
        onClick?.(event)
        if (!event.defaultPrevented) {
          const menu = event.currentTarget.closest<HTMLElement>('[popover]')
          if (menu) {
            menu.dataset.restoreFocus = 'true'
            menu.hidePopover()
          }
        }
      }}
      {...props}
      {...stylex.props(styles.item, sx)}
    />
  )
}

export function ContextMenuLabel({ ref, sx, ...props }: ContextMenuLabelProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.label, sx)} />
}

export function ContextMenuSeparator({ ref, sx, ...props }: ContextMenuSeparatorProps) {
  return <hr ref={ref} {...props} {...stylex.props(styles.separator, sx)} />
}

/* eslint-disable @stylexjs/valid-styles, @stylexjs/no-legacy-contextual-styles */
const styles = stylex.create({
  trigger: {
    WebkitTouchCallout: 'none',
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': stroke.focusRing },
  },
  menu: {
    backgroundColor: colors.popover,
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: elevation.md,
    color: colors.popoverForeground,
    display: { default: 'none', ':popover-open': 'grid' },
    gap: spacing.xxxs,
    inset: 'auto',
    insetBlockStart: 'var(--context-menu-block-start)',
    insetInlineStart: 'var(--context-menu-inline-start)',
    margin: 0,
    minWidth: '12rem',
    maxHeight: 'min(80dvh, 32rem)',
    maxWidth: 'calc(100vw - 1rem)',
    opacity: { default: 0, ':popover-open': 1 },
    padding: spacing.xxs,
    overflow: 'auto',
    position: 'fixed',
    transitionBehavior: 'allow-discrete',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'display, opacity, overlay',
    transitionTimingFunction: motion.easeEmphasized,
  },
  item: {
    backgroundColor: {
      default: 'transparent',
      ':is(:hover, :focus-visible)': colors.accent,
      '[aria-disabled="true"]': 'transparent',
    },
    borderColor: 'transparent',
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: 0,
    color: {
      default: colors.popoverForeground,
      ':is(:hover, :focus-visible)': colors.accentForeground,
      '[aria-disabled="true"]': colors.fgDisabled,
    },
    cursor: { default: 'default', '[aria-disabled="true"]': 'not-allowed' },
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    minHeight: {
      default: spacing.targetMin,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    opacity: { default: 1, '[aria-disabled="true"]': 0.5 },
    outline: 'none',
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: `-${stroke.focusRingOffset}`,
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': stroke.focusRing },
    paddingInline: spacing.sm,
    textAlign: 'start',
    width: '100%',
  },
  label: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightSemibold,
    paddingBlock: spacing.xxs,
    paddingInline: spacing.sm,
  },
  separator: {
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: `${stroke.thin} 0 0`,
    marginBlock: spacing.xxs,
  },
})
/* eslint-enable @stylexjs/valid-styles, @stylexjs/no-legacy-contextual-styles */
