import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

export type SpinnerProps = Omit<
  ComponentPropsWithRef<'progress'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'style' | 'value'
> &
  AccessibleAriaNameProps & { sx?: StyleXStyles }

export function Spinner({ 'aria-label': ariaLabel, ref, sx, ...props }: SpinnerProps) {
  return <progress ref={ref} aria-label={ariaLabel} {...props} {...stylex.props(styles.spinner, sx)} />
}

const spin = stylex.keyframes({ to: { rotate: '1turn' } })

const styles = stylex.create({
  spinner: {
    animationDuration: motion.durationSlower,
    animationIterationCount: 'infinite',
    animationName: {
      default: spin,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationTimingFunction: 'linear',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.round,
    borderStyle: 'solid',
    borderTopColor: {
      default: colors.primary,
      '@media (forced-colors: active)': 'Highlight',
    },
    borderWidth: stroke.thick,
    height: spacing.lg,
    width: spacing.lg,
  },
})
