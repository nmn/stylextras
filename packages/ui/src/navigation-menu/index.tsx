import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type NavigationMenuProps = Omit<
  ComponentPropsWithRef<'nav'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'style'
> &
  AccessibleAriaNameProps &
  SxProp
export type NavigationMenuListProps = Omit<ComponentPropsWithRef<'ul'>, 'className' | 'style'> &
  SxProp
export type NavigationMenuItemProps = Omit<ComponentPropsWithRef<'li'>, 'className' | 'style'> &
  SxProp
export type NavigationMenuLinkProps = Omit<ComponentPropsWithRef<'a'>, 'className' | 'style'> &
  SxProp
export type NavigationMenuTriggerProps = Omit<
  ComponentPropsWithRef<'button'>,
  'className' | 'popoverTarget' | 'popoverTargetAction' | 'style'
> & {
  sx?: StyleXStyles
  target: string
}
export type NavigationMenuContentProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'popover' | 'style'
> &
  SxProp

export function NavigationMenu({ ref, sx, ...props }: NavigationMenuProps) {
  return <nav ref={ref} {...props} {...stylex.props(styles.root, sx)} />
}

export function NavigationMenuList({ ref, sx, ...props }: NavigationMenuListProps) {
  return <ul ref={ref} {...props} {...stylex.props(styles.list, sx)} />
}

export function NavigationMenuItem({ ref, sx, ...props }: NavigationMenuItemProps) {
  return <li ref={ref} {...props} {...stylex.props(styles.item, sx)} />
}

export function NavigationMenuLink({ ref, sx, ...props }: NavigationMenuLinkProps) {
  return <a ref={ref} {...props} {...stylex.props(styles.link, sx)} />
}

export function NavigationMenuTrigger({
  ref,
  sx,
  target,
  type = 'button',
  ...props
}: NavigationMenuTriggerProps) {
  return (
    <button
      ref={ref}
      {...props}
      type={type}
      aria-controls={target}
      popoverTarget={target}
      {...stylex.props(styles.link, sx)}
    />
  )
}

export function NavigationMenuContent({ ref, sx, ...props }: NavigationMenuContentProps) {
  return <div ref={ref} popover="auto" {...props} {...stylex.props(styles.content, sx)} />
}

/* eslint-disable @stylexjs/valid-styles */
const styles = stylex.create({
  root: {
    position: 'relative',
  },
  list: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xxs,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    position: 'relative',
  },
  link: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
      '[aria-current="page"]': colors.accent,
    },
    borderColor: 'transparent',
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRingOffset} ${colors.bg}, 0 0 0 calc(${stroke.focusRingOffset} + ${stroke.focusRing}) ${colors.focusRing}`,
    },
    color: colors.fg,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    minHeight: {
      default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    opacity: { default: 1, ':disabled': 0.5 },
    outline: 'none',
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': stroke.focusRing },
    paddingInline: spacing.sm,
    textDecoration: 'none',
    textWrap: 'pretty',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
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
    boxSizing: 'border-box',
    color: colors.popoverForeground,
    inset: 'auto',
    margin: spacing.xs,
    maxHeight: 'min(80dvh, 32rem)',
    maxWidth: 'calc(100vw - 2rem)',
    minWidth: '12rem',
    opacity: {
      default: 0,
      ':popover-open': 1,
    },
    overflow: 'auto',
    overflowWrap: 'anywhere',
    padding: spacing.md,
    position: 'fixed',
    positionAnchor: 'auto',
    positionArea: 'bottom span-self-x-end',
    positionTryFallbacks: 'flip-block',
    transform: {
      default: 'translateY(-4px) scale(0.98)',
      ':popover-open': 'translateY(0) scale(1)',
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
})
/* eslint-enable @stylexjs/valid-styles */
