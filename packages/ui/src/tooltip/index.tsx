'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { Button, type ButtonProps } from '../button'
import { useInterestInvoker } from '../platform-polyfills/interest-invoker'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { typography } from '../tokens/typography.stylex'

export type TooltipPlacement = 'bottom' | 'top' | 'end' | 'start'
export type TooltipProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'popover' | 'style'> & {
  placement?: TooltipPlacement
  sx?: StyleXStyles
}
export type TooltipTriggerProps = ButtonProps & {
  hideDelay?: number
  showDelay?: number
  target: string
}

export function Tooltip({ placement = 'top', ref, sx, ...props }: TooltipProps) {
  return (
    <div
      ref={ref}
      popover="hint"
      {...props}
      {...stylex.props(styles.tooltip, placementStyles[placement], sx)}
    />
  )
}

export function TooltipTrigger({
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
      type={type}
      variant={variant}
      popoverTarget={target}
      popoverTargetAction="toggle"
      {...props}
      {...interestProps}
    />
  )
}

/* eslint-disable @stylexjs/valid-styles */
const styles = stylex.create({
  tooltip: {
    backgroundColor: colors.fg,
    borderColor: {
      default: 'transparent',
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: 0,
    color: colors.bg,
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
