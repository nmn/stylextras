import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

export type ToggleSize = 'sm' | 'md' | 'lg'
export type ToggleProps = Omit<ComponentPropsWithRef<'button'>, 'className' | 'style'> & {
  size?: ToggleSize
  sx?: StyleXStyles
}

/** A styled pressed button. Consumers own aria-pressed state through native props. */
export function Toggle({ ref, size = 'md', sx, type = 'button', ...props }: ToggleProps) {
  return (
    <button
      ref={ref}
      type={type}
      {...props}
      {...stylex.props(styles.toggle, sizeStyles[size], sx)}
    />
  )
}

const styles = stylex.create({
  toggle: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
      '[aria-pressed="true"]': colors.primary,
    },
    borderColor: {
      default: colors.border,
      '[aria-pressed="true"]': colors.primary,
    },
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRingOffset} ${colors.bg}, 0 0 0 calc(${stroke.focusRingOffset} + ${stroke.focusRing}) ${colors.focusRing}`,
    },
    color: {
      default: colors.fg,
      '[aria-pressed="true"]': colors.primaryForeground,
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    gap: spacing.xs,
    justifyContent: 'center',
    opacity: { default: 1, ':disabled': 0.5 },
    outline: 'none',
    transitionDuration: motion.durationFast,
    transitionProperty: 'background-color, border-color, box-shadow, color',
    transitionTimingFunction: motion.easeStandard,
  },
})

const sizeStyles = stylex.create({
  sm: { minHeight: spacing.controlSm, paddingInline: spacing.sm },
  md: { minHeight: spacing.controlMd, paddingInline: spacing.md },
  lg: { minHeight: spacing.controlLg, paddingInline: spacing.lg },
})
