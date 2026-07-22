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
  minLength = length,
  pattern = `[0-9]{${length}}`,
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
      minLength={minLength}
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
      ':user-invalid': colors.danger,
      '[aria-invalid="true"]': colors.danger,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxSizing: 'border-box',
    color: colors.fg,
    fontFamily: typography.fontMono,
    forcedColorAdjust: 'auto',
    fontSize: {
      default: typography.step1,
      '@media (pointer: coarse)': `max(1rem, ${typography.step1})`,
    },
    fontVariantNumeric: 'tabular-nums',
    fontWeight: typography.weightSemibold,
    minHeight: {
      default: `max(${spacing.controlLg}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    letterSpacing: '0.65em',
    maxWidth: '100%',
    outlineColor: {
      default: colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: stroke.focusRing,
    paddingInline: spacing.md,
    textAlign: 'center',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'border-color, outline-color',
    transitionTimingFunction: motion.easeStandard,
    width: '14rem',
  },
})
