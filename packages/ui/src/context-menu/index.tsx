'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { type ComponentPropsWithRef, useRef } from 'react'
import { ensureFocusgroupPolyfill, focusgroupAttributes, focusgroupRef } from '../focusgroup'
import { showPopoverWithSource } from '../platform-polyfills/popover-source'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type ContextMenuTriggerProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> &
  SxProp & { target: string }
export type ContextMenuProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'popover' | 'role' | 'style'
> &
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

function openContextMenu(menu: HTMLElement, source: HTMLElement, clientX: number, clientY: number) {
  menu.style.insetInlineStart = `${source.matches(':dir(rtl)') ? innerWidth - clientX : clientX}px`
  menu.style.top = `${clientY}px`
  if (menu.matches(':popover-open')) menu.hidePopover()
  showPopoverWithSource(menu, source)
  const focusFirstItem = () => {
    if (!menu.matches(':popover-open')) return
    menu.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus()
  }
  const ready = ensureFocusgroupPolyfill(menu)
  if (ready) void ready.then(focusFirstItem)
  else focusFirstItem()
}

/** A context gesture target with pointer and Shift+F10/ContextMenu-key support. */
export function ContextMenuTrigger({
  onAuxClick,
  onContextMenu,
  onKeyDown,
  onPointerCancel,
  ref,
  sx,
  target,
  ...props
}: ContextMenuTriggerProps) {
  const pointerRequestRef = useRef<{
    clientX: number
    clientY: number
  } | null>(null)

  return (
    <div
      ref={ref}
      aria-haspopup="menu"
      onAuxClick={(event) => {
        onAuxClick?.(event)
        if (event.button !== 2) return
        const request = pointerRequestRef.current
        pointerRequestRef.current = null
        if (event.defaultPrevented || !request) return
        event.preventDefault()
        const menu = document.getElementById(target)
        if (menu instanceof HTMLElement) {
          openContextMenu(menu, event.currentTarget, request.clientX, request.clientY)
        }
      }}
      onContextMenu={(event) => {
        onContextMenu?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        const menu = document.getElementById(target)
        if (!(menu instanceof HTMLElement)) return
        const { clientX, clientY, currentTarget } = event
        if (event.buttons === 0) {
          openContextMenu(menu, currentTarget, clientX, clientY)
        } else {
          pointerRequestRef.current = { clientX, clientY }
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return
        event.preventDefault()
        const menu = document.getElementById(target)
        if (!(menu instanceof HTMLElement)) return
        const rect = event.currentTarget.getBoundingClientRect()
        const clientX = event.currentTarget.matches(':dir(rtl)') ? rect.x + rect.width : rect.x
        openContextMenu(menu, event.currentTarget, clientX, rect.y + rect.height)
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event)
        pointerRequestRef.current = null
      }}
      {...props}
      {...stylex.props(styles.trigger, sx)}
    />
  )
}

export function ContextMenu({ ref, sx, ...props }: ContextMenuProps) {
  const setRef = focusgroupRef(ref)
  return (
    <div
      ref={setRef}
      popover="auto"
      role="menu"
      {...focusgroupAttributes('menu')}
      {...props}
      {...stylex.props(styles.menu, sx)}
    />
  )
}

export function ContextMenuItem({
  onClick,
  ref,
  sx,
  type = 'button',
  ...props
}: ContextMenuItemProps) {
  return (
    <button
      ref={ref}
      type={type}
      role="menuitem"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented)
          event.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover()
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
    margin: 0,
    minWidth: '12rem',
    opacity: { default: 0, ':popover-open': 1 },
    padding: spacing.xxs,
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
      ':hover': colors.accent,
      ':focus-visible': colors.accent,
      ':disabled': 'transparent',
    },
    borderColor: 'transparent',
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: 0,
    color: colors.accentForeground,
    cursor: { default: 'default', ':disabled': 'not-allowed' },
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    minHeight: spacing.controlSm,
    opacity: { default: 1, ':disabled': 0.5 },
    outline: 'none',
    paddingInline: spacing.sm,
    textAlign: 'start',
  },
  label: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightSemibold,
    padding: spacing.sm,
  },
  separator: {
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: `${stroke.thin} 0 0`,
    marginBlock: spacing.xxs,
  },
})
/* eslint-enable @stylexjs/valid-styles, @stylexjs/no-legacy-contextual-styles */
