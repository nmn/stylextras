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

export const inputStyles = stylex.create({
  base: {
    appearance: 'none',
    backgroundColor: colors.control,
    borderColor: {
      default: colors.border,
      ':hover': colors.borderStrong,
      ':focus-visible': colors.focusRing,
      ':user-invalid': colors.danger,
      '[aria-invalid="true"]': colors.danger,
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
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    minHeight: spacing.controlMd,
    minWidth: 0,
    opacity: {
      default: 1,
      ':disabled': 0.5,
    },
    outline: 'none',
    paddingInline: spacing.md,
    transitionDuration: motion.durationFast,
    transitionProperty: 'background-color, border-color, box-shadow, color',
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
