'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { Button, type ButtonProps } from '../button'
import { ensureFocusgroupPolyfill, focusgroupAttributes, focusgroupRef } from '../focusgroup'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }
type InitialMenuFocus = 'first' | 'last'
type DropdownMenuContextValue = {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

const MENU_ITEM_SELECTOR = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'
const typeaheadState = new WeakMap<HTMLElement, { query: string; updatedAt: number }>()
const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null)

export type DropdownMenuProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp
export type DropdownMenuTriggerProps = Omit<
  ButtonProps,
  'popoverTarget' | 'popoverTargetAction'
> & {
  target: string
}
export type DropdownMenuPlacement = 'bottom' | 'top' | 'end' | 'start'
export type DropdownMenuContentProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'popover' | 'role' | 'style'
> &
  SxProp & { placement?: DropdownMenuPlacement }
export type DropdownMenuItemProps = Omit<
  ComponentPropsWithRef<'button'>,
  'className' | 'role' | 'style'
> &
  SxProp & { closeOnSelect?: boolean }
export type DropdownMenuLabelProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> &
  SxProp
export type DropdownMenuSeparatorProps = Omit<ComponentPropsWithRef<'hr'>, 'className' | 'style'> &
  SxProp
export type DropdownMenuShortcutProps = Omit<ComponentPropsWithRef<'kbd'>, 'className' | 'style'> &
  SxProp

function isMenuOpen(menu: HTMLElement) {
  return menu.matches(':popover-open')
}

function getMenuItems(menu: HTMLElement) {
  return Array.from(menu.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)).filter(
    (item) =>
      !item.hidden && item.getAttribute('aria-hidden') !== 'true' && !item.matches(':disabled'),
  )
}

function getMenuTriggers(menu: HTMLElement) {
  if (!menu.id) return []
  return Array.from(document.querySelectorAll<HTMLElement>('[popovertarget]')).filter(
    (trigger) => trigger.getAttribute('popovertarget') === menu.id,
  )
}

function syncMenuTriggers(menu: HTMLElement, expanded: boolean) {
  const triggers = getMenuTriggers(menu)
  for (const trigger of triggers) trigger.setAttribute('aria-expanded', String(expanded))

  if (
    expanded &&
    !menu.hasAttribute('aria-label') &&
    !menu.hasAttribute('aria-labelledby') &&
    triggers[0]
  ) {
    triggers[0].id ||= `${menu.id}-trigger`
    menu.setAttribute('aria-labelledby', triggers[0].id)
  }
}

function focusMenuTrigger(menu: HTMLElement) {
  getMenuTriggers(menu)[0]?.focus()
}

function focusMenuItem(menu: HTMLElement, target: InitialMenuFocus) {
  if (!isMenuOpen(menu)) return
  const items = getMenuItems(menu)
  const item = target === 'last' ? items.at(-1) : items[0]
  item?.focus()
}

function focusMenuWhenReady(menu: HTMLElement, target: InitialMenuFocus) {
  const focusItem = () => focusMenuItem(menu, target)
  const ready = ensureFocusgroupPolyfill(menu)
  if (ready) void ready.then(focusItem, focusItem)
  else focusItem()
}

function openMenu(menu: HTMLElement, target: InitialMenuFocus, source?: HTMLElement) {
  if (isMenuOpen(menu)) {
    focusMenuWhenReady(menu, target)
    return
  }

  menu.dataset.initialFocus = target
  const popoverSource = source ?? getMenuTriggers(menu)[0]
  if (popoverSource) {
    const showPopover = menu.showPopover as (options: { source: HTMLElement }) => void
    showPopover.call(menu, { source: popoverSource })
  } else {
    menu.showPopover()
  }
}

function closeMenu(menu: HTMLElement, restoreFocus: boolean) {
  if (isMenuOpen(menu)) menu.hidePopover()
  if (restoreFocus) focusMenuTrigger(menu)
}

function handleMenuTypeahead(event: ReactKeyboardEvent<HTMLDivElement>) {
  if (
    event.key.length !== 1 ||
    event.key === ' ' ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  ) {
    return false
  }

  const menu = event.currentTarget
  const key = event.key.toLocaleLowerCase()
  const now = Date.now()
  const previous = typeaheadState.get(menu)
  const combined = previous && now - previous.updatedAt < 500 ? previous.query + key : key
  const query = Array.from(combined).every((character) => character === key) ? key : combined
  typeaheadState.set(menu, { query, updatedAt: now })

  const items = getMenuItems(menu)
  if (items.length === 0) return false
  const activeIndex = items.indexOf(document.activeElement as HTMLElement)
  const orderedItems = [...items.slice(activeIndex + 1), ...items.slice(0, activeIndex + 1)]
  const match = orderedItems.find((item) =>
    item.textContent?.trim().toLocaleLowerCase().startsWith(query),
  )
  if (!match) return false

  event.preventDefault()
  match.focus()
  return true
}

export function DropdownMenu({ children, ref, sx, ...props }: DropdownMenuProps) {
  const [expanded, setExpanded] = useState(false)
  const context = useMemo(() => ({ expanded, setExpanded }), [expanded])

  return (
    <DropdownMenuContext.Provider value={context}>
      <div ref={ref} {...props} {...stylex.props(styles.root, sx)}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({
  id,
  onKeyDown,
  target,
  type = 'button',
  variant = 'outline',
  ...props
}: DropdownMenuTriggerProps) {
  const menuContext = useContext(DropdownMenuContext)
  return (
    <Button
      {...props}
      id={id ?? `${target}-trigger`}
      type={type}
      variant={variant}
      aria-controls={target}
      aria-expanded={menuContext?.expanded ?? false}
      aria-haspopup="menu"
      popoverTarget={target}
      popoverTargetAction="toggle"
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) {
          return
        }

        const menu = document.getElementById(target)
        if (!(menu instanceof HTMLElement) || !menu.hasAttribute('popover')) return
        event.preventDefault()
        openMenu(menu, event.key === 'ArrowUp' ? 'last' : 'first', event.currentTarget)
      }}
    />
  )
}

export function DropdownMenuContent({
  onBlur,
  onKeyDown,
  onToggle,
  placement = 'bottom',
  ref,
  sx,
  ...props
}: DropdownMenuContentProps) {
  const menuContext = useContext(DropdownMenuContext)
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
        closeMenu(event.currentTarget, false)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return

        if (event.key === 'Escape') {
          event.preventDefault()
          event.stopPropagation()
          closeMenu(event.currentTarget, true)
          return
        }

        handleMenuTypeahead(event)
      }}
      onToggle={(event) => {
        onToggle?.(event)
        const menu = event.currentTarget
        const expanded = isMenuOpen(menu)
        syncMenuTriggers(menu, expanded)
        menuContext?.setExpanded(expanded)
        if (!expanded) return

        const target = menu.dataset.initialFocus === 'last' ? 'last' : 'first'
        delete menu.dataset.initialFocus
        focusMenuWhenReady(menu, target)
      }}
      {...props}
      {...stylex.props(styles.content, placementStyles[placement], sx)}
    />
  )
}

export function DropdownMenuItem({
  'aria-disabled': ariaDisabled,
  closeOnSelect = true,
  disabled = false,
  onClick,
  ref,
  sx,
  type = 'button',
  ...props
}: DropdownMenuItemProps) {
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
        if (!event.defaultPrevented && closeOnSelect) {
          const menu = event.currentTarget.closest<HTMLElement>('[popover]')
          if (menu) closeMenu(menu, true)
        }
      }}
      {...props}
      {...stylex.props(styles.item, sx)}
    />
  )
}

export function DropdownMenuLabel({ ref, sx, ...props }: DropdownMenuLabelProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.label, sx)} />
}

export function DropdownMenuSeparator({ ref, sx, ...props }: DropdownMenuSeparatorProps) {
  return <hr ref={ref} {...props} {...stylex.props(styles.separator, sx)} />
}

export function DropdownMenuShortcut({ ref, sx, ...props }: DropdownMenuShortcutProps) {
  return <kbd ref={ref} {...props} {...stylex.props(styles.shortcut, sx)} />
}

/* eslint-disable @stylexjs/valid-styles */
const styles = stylex.create({
  root: {
    display: 'inline-flex',
  },
  content: {
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
    margin: spacing.xs,
    minWidth: '12rem',
    opacity: { default: 0, ':popover-open': 1 },
    padding: spacing.xxs,
    position: 'fixed',
    positionAnchor: 'auto',
    transform: {
      default: 'translateY(-4px)',
      ':popover-open': 'translateY(0)',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    transitionBehavior: 'allow-discrete',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'display, opacity, overlay, transform',
    transitionTimingFunction: motion.easeEmphasized,
  },
  item: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
      ':focus': colors.accent,
    },
    borderColor: 'transparent',
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: 0,
    color: {
      default: colors.popoverForeground,
      ':focus': colors.accentForeground,
      ':hover': colors.accentForeground,
      '[aria-disabled="true"]': colors.fgDisabled,
    },
    cursor: { default: 'default', '[aria-disabled="true"]': 'not-allowed' },
    display: 'flex',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    gap: spacing.sm,
    minHeight: spacing.controlSm,
    opacity: { default: 1, '[aria-disabled="true"]': 0.5 },
    outline: 'none',
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
    width: '100%',
  },
  shortcut: {
    color: 'currentColor',
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    marginInlineStart: 'auto',
  },
})

const placementStyles = stylex.create({
  bottom: {
    positionArea: 'bottom span-self-x-end',
    positionTryFallbacks: 'flip-block',
  },
  top: {
    positionArea: 'top span-self-x-end',
    positionTryFallbacks: 'flip-block',
  },
  end: {
    positionArea: 'self-x-end span-bottom',
    positionTryFallbacks: 'flip-inline',
  },
  start: {
    positionArea: 'self-x-start span-bottom',
    positionTryFallbacks: 'flip-inline',
  },
})
/* eslint-enable @stylexjs/valid-styles */
