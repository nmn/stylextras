'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { type ComponentPropsWithRef, useMemo } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { ensureFocusgroupPolyfill, focusgroupAttributes, focusgroupRef } from '../focusgroup'
import { requestMenuFocus } from '../internal/menu-state'
import { getTypeaheadMatch, isTypeaheadKey } from '../internal/typeahead'
import { showPopoverWithSource } from '../platform-polyfills/popover-source'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

export type MenubarProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'role' | 'style'
> &
  AccessibleAriaNameProps & { sx?: StyleXStyles }

const MENUBAR_TRIGGER_SELECTOR = 'button[aria-haspopup="menu"][popovertarget]'
const MENU_ITEM_SELECTOR = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'

function getMenubarTriggers(menubar: HTMLElement) {
  return Array.from(menubar.querySelectorAll<HTMLButtonElement>(MENUBAR_TRIGGER_SELECTOR)).filter(
    (trigger) => trigger.closest('[role="menubar"]') === menubar && !trigger.disabled,
  )
}

function getTriggerMenu(trigger: HTMLButtonElement) {
  const target = trigger.getAttribute('popovertarget')
  const menu = target ? document.getElementById(target) : null
  return menu instanceof HTMLElement && menu.hasAttribute('popover') ? menu : null
}

function getOpenMenubarMenu(menubar: HTMLElement) {
  return Array.from(
    menubar.querySelectorAll<HTMLElement>('[role="menu"][popover]:popover-open'),
  ).find((menu) => menu.closest('[role="menubar"]') === menubar)
}

function getMenuTrigger(menubar: HTMLElement, menu: HTMLElement) {
  return getMenubarTriggers(menubar).find(
    (trigger) => trigger.getAttribute('popovertarget') === menu.id,
  )
}

function focusFirstMenuItem(menu: HTMLElement) {
  const focus = () => {
    const firstItem = menu.querySelector<HTMLElement>(MENU_ITEM_SELECTOR)
    firstItem?.focus({ preventScroll: true })
  }
  const ready = ensureFocusgroupPolyfill(menu)
  if (ready) void ready.then(focus, focus)
  else focus()
}

function switchMenubarMenu(menubar: HTMLElement, trigger: HTMLButtonElement, focusMenu: boolean) {
  const nextMenu = getTriggerMenu(trigger)
  if (!nextMenu) return

  const currentMenu = getOpenMenubarMenu(menubar)
  if (currentMenu === nextMenu) {
    if (focusMenu) focusFirstMenuItem(nextMenu)
    return
  }

  if (currentMenu) currentMenu.hidePopover()
  requestMenuFocus(nextMenu, focusMenu ? 'first' : 'none')
  showPopoverWithSource(nextMenu, trigger)
}

function getMenubarTypeaheadMatch(menubar: HTMLElement, key: string) {
  const triggers = getMenubarTriggers(menubar)
  return getTypeaheadMatch(menubar, triggers, key) as HTMLButtonElement | undefined
}

/** A focusgroup-enhanced menubar. Menus remain explicit DropdownMenu siblings. */
export function Menubar({ onKeyDownCapture, onPointerMove, ref, sx, ...props }: MenubarProps) {
  const setRef = useMemo(() => focusgroupRef(ref), [ref])
  return (
    <div
      ref={setRef}
      {...props}
      role="menubar"
      aria-orientation="horizontal"
      {...focusgroupAttributes('menubar inline wrap')}
      onKeyDownCapture={(event) => {
        onKeyDownCapture?.(event)
        if (event.defaultPrevented) return

        const eventTarget = event.target
        if (!(eventTarget instanceof Element)) return
        const triggers = getMenubarTriggers(event.currentTarget)
        if (triggers.length === 0) return

        const trigger = eventTarget.closest<HTMLButtonElement>(MENUBAR_TRIGGER_SELECTOR)
        const menu = eventTarget.closest<HTMLElement>('[role="menu"][popover]')
        const currentTrigger =
          trigger && event.currentTarget.contains(trigger)
            ? trigger
            : menu
              ? getMenuTrigger(event.currentTarget, menu)
              : undefined

        if (currentTrigger && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
          const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl'
          const forwardKey = isRtl ? 'ArrowLeft' : 'ArrowRight'
          const offset = event.key === forwardKey ? 1 : -1
          const currentIndex = triggers.indexOf(currentTrigger)
          const nextTrigger = triggers[(currentIndex + offset + triggers.length) % triggers.length]
          if (!nextTrigger) return

          event.preventDefault()
          nextTrigger.focus({ preventScroll: true })
          if (menu || getOpenMenubarMenu(event.currentTarget)) {
            switchMenubarMenu(event.currentTarget, nextTrigger, true)
          }
          return
        }

        if (trigger && isTypeaheadKey(event)) {
          const match = getMenubarTypeaheadMatch(event.currentTarget, event.key)
          if (!match) return
          event.preventDefault()
          match.focus({ preventScroll: true })
          if (getOpenMenubarMenu(event.currentTarget)) {
            switchMenubarMenu(event.currentTarget, match, false)
          }
        }
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (event.defaultPrevented || event.pointerType === 'touch') return
        const eventTarget = event.target
        if (!(eventTarget instanceof Element)) return
        const trigger = eventTarget.closest<HTMLButtonElement>(MENUBAR_TRIGGER_SELECTOR)
        if (!trigger || !event.currentTarget.contains(trigger)) return
        const openMenu = getOpenMenubarMenu(event.currentTarget)
        if (!openMenu || getTriggerMenu(trigger) === openMenu) return
        switchMenubarMenu(event.currentTarget, trigger, false)
      }}
      {...stylex.props(styles.base, sx)}
    />
  )
}

const styles = stylex.create({
  base: {
    alignItems: 'center',
    backgroundColor: colors.bgSubtle,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xxs,
    maxWidth: '100%',
    overflowX: 'auto',
    overscrollBehaviorX: 'contain',
    padding: spacing.xxs,
    width: 'fit-content',
  },
})
