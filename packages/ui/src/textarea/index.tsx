import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

export type TextareaProps = Omit<ComponentPropsWithRef<'textarea'>, 'className' | 'style'> & {
  sx?: StyleXStyles
}

export function Textarea({ ref, sx, ...props }: TextareaProps) {
  return <textarea ref={ref} {...props} {...stylex.props(styles.base, sx)} />
}

const styles = stylex.create({
  base: {
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
    minHeight: spacing.xxxxl,
    opacity: {
      default: 1,
      ':disabled': 0.5,
    },
    outline: 'none',
    padding: spacing.md,
    resize: 'vertical',
    transitionDuration: motion.durationFast,
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
    width: '100%',
    '::placeholder': {
      color: colors.fgMuted,
    },
  },
})
