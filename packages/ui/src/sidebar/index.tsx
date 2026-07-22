import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef, ElementType } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { Button, type AccessibleIconButtonPropsWithout } from '../button'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }
type DivProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp

export type SidebarProps = Omit<
  ComponentPropsWithRef<'aside'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'popover' | 'style'
> &
  AccessibleAriaNameProps &
  SxProp & { mode?: 'inline' | 'popover' }
export type SidebarTriggerProps = AccessibleIconButtonPropsWithout<
  'aria-controls' | 'popoverTarget' | 'popoverTargetAction' | 'size'
> & { target: string }
export type SidebarHeaderProps = DivProps
export type SidebarContentProps = DivProps
export type SidebarFooterProps = DivProps
export type SidebarGroupProps = DivProps
export type SidebarGroupLabelProps<T extends ElementType = 'h3'> = Omit<
  ComponentPropsWithRef<T>,
  'className' | 'style'
> &
  SxProp & { as?: T }
export type SidebarMenuProps = Omit<ComponentPropsWithRef<'ul'>, 'className' | 'style'> & SxProp
export type SidebarMenuItemProps = Omit<ComponentPropsWithRef<'li'>, 'className' | 'style'> & SxProp
export type SidebarMenuButtonProps = Omit<ComponentPropsWithRef<'button'>, 'className' | 'style'> &
  SxProp
export type SidebarMenuLinkProps = Omit<ComponentPropsWithRef<'a'>, 'className' | 'style'> & SxProp

export function Sidebar({ mode = 'inline', ref, sx, ...props }: SidebarProps) {
  return (
    <aside
      ref={ref}
      popover={mode === 'popover' ? 'auto' : undefined}
      {...props}
      {...stylex.props(styles.sidebar, mode === 'popover' && styles.popover, sx)}
    />
  )
}

export function SidebarTrigger({ target, type = 'button', ...props }: SidebarTriggerProps) {
  return (
    <Button
      {...props}
      type={type}
      size="icon"
      variant="outline"
      aria-controls={target}
      popoverTarget={target}
      popoverTargetAction="toggle"
    />
  )
}

export function SidebarHeader({ ref, sx, ...props }: SidebarHeaderProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.header, sx)} />
}

export function SidebarContent({ ref, sx, ...props }: SidebarContentProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.content, sx)} />
}

export function SidebarFooter({ ref, sx, ...props }: SidebarFooterProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.footer, sx)} />
}

export function SidebarGroup({ ref, sx, ...props }: SidebarGroupProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.group, sx)} />
}

export function SidebarGroupLabel<T extends ElementType = 'h3'>({
  as,
  sx,
  ...props
}: SidebarGroupLabelProps<T>) {
  const Component = as ?? 'h3'
  return <Component {...props} {...stylex.props(styles.groupLabel, sx)} />
}

export function SidebarMenu({ ref, sx, ...props }: SidebarMenuProps) {
  return <ul ref={ref} {...props} {...stylex.props(styles.menu, sx)} />
}

export function SidebarMenuItem({ ref, sx, ...props }: SidebarMenuItemProps) {
  return <li ref={ref} {...props} {...stylex.props(styles.menuItem, sx)} />
}

export function SidebarMenuButton({ ref, sx, type = 'button', ...props }: SidebarMenuButtonProps) {
  return <button ref={ref} type={type} {...props} {...stylex.props(styles.menuButton, sx)} />
}

export function SidebarMenuLink({ ref, sx, ...props }: SidebarMenuLinkProps) {
  return <a ref={ref} {...props} {...stylex.props(styles.menuButton, sx)} />
}

const styles = stylex.create({
  sidebar: {
    backgroundColor: colors.sidebar,
    borderColor: colors.sidebarBorder,
    borderStyle: 'solid',
    borderWidth: 0,
    borderInlineEndWidth: stroke.thin,
    color: colors.sidebarForeground,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    maxWidth: '100%',
    width: '16rem',
  },
  popover: {
    backgroundColor: colors.popover,
    borderColor: {
      default: colors.sidebarBorder,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderWidth: stroke.thin,
    boxShadow: elevation.lg,
    display: { default: 'none', ':popover-open': 'flex' },
    height: '100dvh',
    insetBlock: 0,
    insetInline: '0 auto',
    margin: 0,
    maxHeight: '100dvh',
    padding: 0,
    position: 'fixed',
    overflow: 'hidden',
  },
  header: {
    borderColor: colors.sidebarBorder,
    borderStyle: 'solid',
    borderWidth: `0 0 ${stroke.thin}`,
    padding: spacing.md,
  },
  content: {
    flexBasis: 0,
    flexGrow: 1,
    overflowY: 'auto',
    overscrollBehaviorY: 'contain',
    padding: spacing.sm,
  },
  footer: {
    borderColor: colors.sidebarBorder,
    borderStyle: 'solid',
    borderWidth: `${stroke.thin} 0 0`,
    padding: spacing.md,
  },
  group: {
    display: 'grid',
    gap: spacing.xxs,
    paddingBlock: spacing.sm,
  },
  groupLabel: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus2,
    fontWeight: typography.weightSemibold,
    letterSpacing: typography.trackingWide,
    margin: 0,
    paddingInline: spacing.sm,
    textTransform: 'uppercase',
  },
  menu: {
    display: 'grid',
    gap: spacing.xxxs,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  menuItem: { minWidth: 0 },
  menuButton: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.sidebarAccent,
      ':focus-visible': colors.sidebarAccent,
      '[aria-current="page"]': colors.sidebarAccent,
    },
    borderColor: 'transparent',
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: 0,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRing} ${colors.focusRing}`,
    },
    color: colors.sidebarForeground,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'flex',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: {
      default: typography.weightRegular,
      '[aria-current="page"]': typography.weightSemibold,
    },
    gap: spacing.sm,
    minHeight: {
      default: `max(${spacing.controlSm}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    opacity: { default: 1, ':disabled': 0.5 },
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
    textDecoration: 'none',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, box-shadow, color, outline-color',
    transitionTimingFunction: motion.easeStandard,
    width: '100%',
    overflowWrap: 'anywhere',
  },
})
