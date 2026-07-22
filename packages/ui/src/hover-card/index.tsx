'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { Button, type AccessibleButtonPropsWithout } from '../button'
import { useInterestInvoker } from '../platform-polyfills/interest-invoker'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type HoverCardPlacement = 'bottom' | 'top' | 'end' | 'start'
export type HoverCardProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'popover' | 'style'> &
  SxProp & { placement?: HoverCardPlacement }
export type HoverCardTriggerProps = AccessibleButtonPropsWithout<
  'aria-controls' | 'popoverTarget' | 'popoverTargetAction'
> & {
  hideDelay?: number
  showDelay?: number
  target: string
}
export type HoverCardHeaderProps = Omit<ComponentPropsWithRef<'header'>, 'className' | 'style'> &
  SxProp
export type HoverCardTitleProps = Omit<ComponentPropsWithRef<'h3'>, 'className' | 'style'> & SxProp
export type HoverCardDescriptionProps = Omit<ComponentPropsWithRef<'p'>, 'className' | 'style'> &
  SxProp

/** Interactive interest content. It deliberately uses popover semantics, not tooltip semantics. */
export function HoverCard({ placement = 'bottom', ref, sx, ...props }: HoverCardProps) {
  return (
    <div
      ref={ref}
      popover="auto"
      {...props}
      {...stylex.props(styles.card, placementStyles[placement], sx)}
    />
  )
}

export function HoverCardTrigger({
  'aria-details': ariaDetails,
  hideDelay,
  ref,
  showDelay,
  target,
  type = 'button',
  variant = 'link',
  ...props
}: HoverCardTriggerProps) {
  const setRef = useInterestInvoker(ref, { hideDelay, interactive: true, showDelay, target })
  const interestProps = { interestfor: target } as Record<string, string>
  return (
    <Button
      ref={setRef}
      {...props}
      type={type}
      variant={variant}
      aria-controls={target}
      aria-details={[ariaDetails, target].filter(Boolean).join(' ')}
      popoverTarget={target}
      popoverTargetAction="toggle"
      {...interestProps}
    />
  )
}

export function HoverCardHeader({ ref, sx, ...props }: HoverCardHeaderProps) {
  return <header ref={ref} {...props} {...stylex.props(styles.header, sx)} />
}

export function HoverCardTitle({ ref, sx, ...props }: HoverCardTitleProps) {
  return <h3 ref={ref} {...props} {...stylex.props(styles.title, sx)} />
}

export function HoverCardDescription({ ref, sx, ...props }: HoverCardDescriptionProps) {
  return <p ref={ref} {...props} {...stylex.props(styles.description, sx)} />
}

/* eslint-disable @stylexjs/valid-styles */
const styles = stylex.create({
  card: {
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
    inset: 'auto',
    margin: spacing.xs,
    maxHeight: 'min(80dvh, 36rem)',
    maxWidth: 'calc(100vw - 2rem)',
    opacity: { default: 0, ':popover-open': 1 },
    overflow: 'auto',
    overflowWrap: 'anywhere',
    padding: spacing.md,
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
    width: 'min(20rem, calc(100vw - 2rem))',
  },
  header: {
    display: 'grid',
    gap: spacing.xs,
  },
  title: {
    color: colors.fg,
    fontFamily: typography.fontDisplay,
    fontSize: typography.step0,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightSnug,
    margin: 0,
  },
  description: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightBody,
    margin: 0,
    textWrap: 'pretty',
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
