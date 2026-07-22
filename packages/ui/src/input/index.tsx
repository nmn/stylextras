import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'className' | 'style'> & {
  sx?: StyleXStyles
}

export function Input({ ref, sx, type = 'text', ...props }: InputProps) {
  return (
    <input ref={ref} type={type} {...props} {...stylex.props(inputStyles.base, sx)} />
  )
}

const inputStyles = stylex.create({
  base: {
    appearance: 'none',
    backgroundColor: colors.control,
    borderColor: {
      default: colors.border,
      ':hover': colors.borderStrong,
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
    fontFamily: typography.fontSans,
    forcedColorAdjust: 'auto',
    fontSize: {
      default: typography.step0,
      '@media (pointer: coarse)': `max(1rem, ${typography.step0})`,
    },
    lineHeight: typography.lineHeightBody,
    minHeight: {
      default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    minWidth: 0,
    opacity: {
      default: 1,
      ':disabled': 0.5,
    },
    outlineColor: {
      default: colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: stroke.focusRing,
    paddingInline: spacing.md,
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, border-color, color, outline-color',
    transitionTimingFunction: motion.easeStandard,
    width: '100%',
    '::placeholder': {
      color: colors.fgMuted,
    },
    '::file-selector-button': {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderStyle: 'none',
      borderWidth: 0,
      color: colors.fg,
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: typography.weightMedium,
      lineHeight: 'inherit',
      marginInlineEnd: spacing.sm,
      padding: 0,
    },
  },
})
