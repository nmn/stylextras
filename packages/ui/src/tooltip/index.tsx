'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { Button, type AccessibleButtonPropsWithout } from '../button'
import { useInterestInvoker } from '../platform-polyfills/interest-invoker'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

export type TooltipPlacement = 'bottom' | 'top' | 'end' | 'start'
export type TooltipProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'popover' | 'role' | 'style'
> & {
  placement?: TooltipPlacement
  sx?: StyleXStyles
}
export type TooltipTriggerProps = AccessibleButtonPropsWithout<
  'aria-controls' | 'popoverTarget' | 'popoverTargetAction'
> & {
  hideDelay?: number
  showDelay?: number
  target: string
}

export function Tooltip({ placement = 'top', ref, sx, ...props }: TooltipProps) {
  return (
    <div
      ref={ref}
      popover="hint"
      role="tooltip"
      {...props}
      {...stylex.props(styles.tooltip, placementStyles[placement], sx)}
    />
  )
}

export function TooltipTrigger({
  'aria-describedby': ariaDescribedBy,
  hideDelay,
  ref,
  showDelay,
  target,
  type = 'button',
  variant = 'ghost',
  ...props
}: TooltipTriggerProps) {
  const setRef = useInterestInvoker(ref, { hideDelay, showDelay, target })
  const interestProps = { interestfor: target } as Record<string, string>
  return (
    <Button
      ref={setRef}
      {...props}
      type={type}
      variant={variant}
      aria-controls={target}
      aria-describedby={[ariaDescribedBy, target].filter(Boolean).join(' ')}
      popoverTarget={target}
      popoverTargetAction="toggle"
      {...interestProps}
    />
  )
}

/* eslint-disable @stylexjs/valid-styles */
const styles = stylex.create({
  tooltip: {
    backgroundColor: {
      default: colors.fg,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderColor: {
      default: 'transparent',
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: {
      default: 0,
      '@media (forced-colors: active)': stroke.thin,
    },
    color: {
      default: colors.bg,
      '@media (forced-colors: active)': 'Canvas',
    },
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    inset: 'auto',
    margin: spacing.xs,
    maxWidth: 'min(20rem, calc(100vw - 2rem))',
    opacity: { default: 0, ':popover-open': 1 },
    paddingBlock: spacing.xxxs,
    paddingInline: spacing.xs,
    pointerEvents: 'none',
    position: 'fixed',
    positionAnchor: 'auto',
    transitionBehavior: 'allow-discrete',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'display, opacity, overlay',
    transitionTimingFunction: motion.easeStandard,
    overflowWrap: 'anywhere',
    textWrap: 'pretty',
  },
})

const placementStyles = stylex.create({
  bottom: {
    positionArea: 'bottom',
    positionTryFallbacks: 'flip-block',
  },
  top: {
    positionArea: 'top',
    positionTryFallbacks: 'flip-block',
  },
  end: {
    positionArea: 'self-x-end',
    positionTryFallbacks: 'flip-inline',
  },
  start: {
    positionArea: 'self-x-start',
    positionTryFallbacks: 'flip-inline',
  },
})
/* eslint-enable @stylexjs/valid-styles */
