import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

export type TimeFieldProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'style' | 'type'
> & { sx?: StyleXStyles }
export type TimeFieldFieldProps = TimeFieldProps

/** A native time input with platform keyboard, validation, and form behavior. */
export function TimeField({ ref, sx, ...props }: TimeFieldProps) {
  return <input ref={ref} type="time" {...props} {...stylex.props(styles.input, sx)} />
}

/** @deprecated Use TimeField. */
export const TimeFieldField = TimeField

const styles = stylex.create({
  input: {
    borderColor: {
      '[aria-invalid="true"]': colors.danger,
      default: colors.border,
      ':user-invalid': colors.danger,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    paddingInline: spacing.md,
    accentColor: colors.primary,
    backgroundColor: colors.bgRaised,
    boxSizing: 'border-box',
    color: colors.fg,
    colorScheme: 'light dark',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':focus-visible': stroke.focusRing,
    },
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, border-color, color',
    transitionTimingFunction: motion.easeStandard,
    minHeight: {
      default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
    minWidth: 0,
    width: '100%',
  },
})
