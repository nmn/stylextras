'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
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

export function DropdownMenu({ ref, sx, ...props }: DropdownMenuProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.root, sx)} />
}

export function DropdownMenuTrigger({
  target,
  type = 'button',
  variant = 'outline',
  ...props
}: DropdownMenuTriggerProps) {
  return (
    <Button
      type={type}
      variant={variant}
      aria-haspopup="menu"
      popoverTarget={target}
      popoverTargetAction="toggle"
      {...props}
    />
  )
}

export function DropdownMenuContent({
  onToggle,
  placement = 'bottom',
  ref,
  sx,
  ...props
}: DropdownMenuContentProps) {
  const setRef = focusgroupRef(ref)
  return (
    <div
      ref={setRef}
      popover="auto"
      role="menu"
      {...focusgroupAttributes('menu')}
      onToggle={(event) => {
        onToggle?.(event)
        const menu = event.currentTarget
        if (menu.matches(':popover-open')) {
          const focusFirstItem = () => {
            if (!menu.matches(':popover-open')) return
            const firstItem = menu.querySelector<HTMLElement>(
              '[role^="menuitem"]:not([aria-disabled="true"]):not(:disabled)',
            )
            firstItem?.focus()
          }
          const ready = ensureFocusgroupPolyfill(menu)
          if (ready) void ready.then(focusFirstItem)
          else focusFirstItem()
        }
      }}
      {...props}
      {...stylex.props(styles.content, placementStyles[placement], sx)}
    />
  )
}

export function DropdownMenuItem({
  closeOnSelect = true,
  onClick,
  ref,
  sx,
  type = 'button',
  ...props
}: DropdownMenuItemProps) {
  return (
    <button
      ref={ref}
      type={type}
      role="menuitem"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && closeOnSelect) {
          event.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover()
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
      ':focus-visible': colors.accent,
      ':disabled': 'transparent',
    },
    borderColor: 'transparent',
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: 0,
    color: colors.accentForeground,
    cursor: { default: 'default', ':disabled': 'not-allowed' },
    display: 'flex',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    gap: spacing.sm,
    minHeight: spacing.controlSm,
    opacity: { default: 1, ':disabled': 0.5 },
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
    color: colors.fgMuted,
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
