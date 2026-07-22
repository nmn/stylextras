import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import {
  Button,
  type AccessibleButtonPropsWithout,
  type DistributiveOmit,
} from '../button'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

export type PopoverPlacement = 'bottom' | 'top' | 'end' | 'start'
export type PopoverSize = 'sm' | 'md' | 'lg'
export type PopoverProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'popover' | 'style'> & {
  behavior?: 'auto' | 'hint' | 'manual'
  placement?: PopoverPlacement
  size?: PopoverSize
  sx?: StyleXStyles
}
export type PopoverTriggerProps = AccessibleButtonPropsWithout<
  'aria-controls' | 'popoverTarget' | 'popoverTargetAction'
> & {
  action?: 'toggle' | 'show' | 'hide'
  target: string
}
export type PopoverCloseProps = DistributiveOmit<PopoverTriggerProps, 'action'>

/** A native Popover API surface with anchor positioning as an enhancement. */
export function Popover({
  behavior = 'auto',
  placement = 'bottom',
  ref,
  size = 'md',
  sx,
  ...props
}: PopoverProps) {
  return (
    <div
      ref={ref}
      popover={behavior}
      {...props}
      {...stylex.props(styles.popover, placementStyles[placement], sizeStyles[size], sx)}
    />
  )
}

export function PopoverTrigger({
  action = 'toggle',
  target,
  type = 'button',
  variant = 'outline',
  ...props
}: PopoverTriggerProps) {
  return (
    <Button
      {...props}
      type={type}
      variant={variant}
      aria-controls={target}
      popoverTarget={target}
      popoverTargetAction={action}
    />
  )
}

export function PopoverClose({ target, ...props }: PopoverCloseProps) {
  return <PopoverTrigger target={target} action="hide" {...props} />
}

/* eslint-disable @stylexjs/valid-styles */
const styles = stylex.create({
  popover: {
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
    opacity: {
      default: 0,
      ':popover-open': 1,
    },
    overflow: 'auto',
    overflowWrap: 'anywhere',
    padding: spacing.md,
    position: 'fixed',
    positionAnchor: 'auto',
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
    scrollbarGutter: 'stable',
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

const sizeStyles = stylex.create({
  sm: { width: 'min(15rem, calc(100vw - 2rem))' },
  md: { width: 'min(20rem, calc(100vw - 2rem))' },
  lg: { width: 'min(26rem, calc(100vw - 2rem))' },
})
