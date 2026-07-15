import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

export type InputOTPProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'inputMode' | 'style' | 'type'
> & {
  /** Number of characters accepted. */
  length?: number
  sx?: StyleXStyles
}

/** A single native one-time-code input, visually spaced into character cells. */
export function InputOTP({
  autoComplete = 'one-time-code',
  length = 6,
  maxLength = length,
  pattern = '[0-9]*',
  ref,
  sx,
  ...props
}: InputOTPProps) {
  return (
    <input
      ref={ref}
      autoComplete={autoComplete}
      inputMode="numeric"
      maxLength={maxLength}
      pattern={pattern}
      type="text"
      {...props}
      {...stylex.props(styles.input, sx)}
    />
  )
}

const styles = stylex.create({
  input: {
    backgroundColor: colors.control,
    borderColor: {
      default: colors.border,
      ':focus-visible': colors.focusRing,
    },
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRingOffset} ${colors.bg}, 0 0 0 calc(${stroke.focusRingOffset} + ${stroke.focusRing}) ${colors.focusRing}`,
    },
    boxSizing: 'border-box',
    color: colors.fg,
    fontFamily: typography.fontMono,
    fontSize: typography.step1,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: typography.weightSemibold,
    height: spacing.controlLg,
    letterSpacing: '0.65em',
    maxWidth: '100%',
    outline: 'none',
    paddingInline: spacing.md,
    textAlign: 'center',
    transitionDuration: motion.durationFast,
    transitionProperty: 'border-color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
    width: '14rem',
  },
})
