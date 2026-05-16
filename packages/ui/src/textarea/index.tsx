import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type BaseProps = ComponentPropsWithoutRef<'textarea'>

export type TextareaSize = 'sm' | 'md'

export type TextareaProps = Omit<BaseProps, 'className' | 'style'> & {
  sx?: StyleXStyles
  textareaSx?: StyleXStyles
  labelSx?: StyleXStyles
  label?: ReactNode
  size?: TextareaSize
}

/**
 * Renders a token-styled multiline text input.
 *
 * Search aliases: textarea, text area, multiline field, message box.
 *
 * A11y notes:
 * - Uses native textarea semantics.
 * - Labeling and error relationships must be composed by the caller.
 */
export function Textarea({ label, labelSx, size = 'md', sx, textareaSx, ...props }: TextareaProps) {
  return (
    <label {...stylex.props(rootStyles.base, sx)}>
      {label ? <span {...stylex.props(labelStyles.base, labelSx)}>{label}</span> : null}
      <textarea {...props} {...stylex.props(textareaStyles.base, sizeStyles[size], textareaSx)} />
    </label>
  )
}

const rootStyles = stylex.create({ base: { display: 'grid', gap: spacing.xs, width: '100%' } })
const labelStyles = stylex.create({
  base: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
  },
})
const textareaStyles = stylex.create({
  base: {
    width: '100%',
    minHeight: spacing['4xl'],
    paddingInline: spacing.md,
    paddingBlock: spacing.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderColor: {
      default: colors.borderStrong,
      ':hover': colors.borderAccent,
      ':focus': colors.primary,
    },
    borderRadius: radius.lg,
    backgroundColor: colors.bg,
    color: colors.fg,
    fontFamily: typography.fontSans,
    lineHeight: typography.lineHeightBody,
    resize: 'vertical',
    boxShadow: {
      default: `inset 0 1px 0 ${colors.bgSubtle}`,
      ':focus': `0 0 0 ${stroke.thick} ${colors.focusRing}`,
    },
    outline: {
      default: null,
      ':focus': 'none',
    },
    transitionDuration: '150ms',
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionTimingFunction: 'ease-in-out',
    '::placeholder': {
      color: colors.fgMuted,
    },
  },
})
const sizeStyles = stylex.create({
  sm: { fontSize: typography.stepMinus1 },
  md: { fontSize: typography.step0 },
})
