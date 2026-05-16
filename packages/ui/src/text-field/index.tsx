import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useId } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type BaseProps = ComponentPropsWithoutRef<'input'>

export type TextFieldSize = 'sm' | 'md'

export type TextFieldProps = Omit<BaseProps, 'className' | 'style' | 'size'> & {
  sx?: StyleXStyles
  inputSx?: StyleXStyles
  labelSx?: StyleXStyles
  descriptionSx?: StyleXStyles
  errorSx?: StyleXStyles
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  invalid?: boolean
  size?: TextFieldSize
}

/**
 * Renders a token-styled text input control.
 *
 * Search aliases: text field, input, text input, field.
 *
 * A11y notes:
 * - Uses native input semantics.
 * - Label, description, and error relationships must be composed by the caller.
 */
export function TextField({
  description,
  descriptionSx,
  disabled,
  error,
  errorSx,
  id: idProp,
  inputSx,
  invalid = false,
  label,
  labelSx,
  size = 'md',
  sx,
  type = 'text',
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <label {...stylex.props(rootStyles.root, sx)}>
      {label ? <span {...stylex.props(labelStyles.label, labelSx)}>{label}</span> : null}
      <input
        {...props}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        id={id}
        type={type}
        {...stylex.props(
          inputStyles.base,
          sizeStyles[size],
          invalid && stateStyles.invalid,
          disabled && stateStyles.disabled,
          inputSx,
        )}
      />
      {description ? (
        <span id={descriptionId} {...stylex.props(descriptionStyles.base, descriptionSx)}>
          {description}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} {...stylex.props(errorStyles.base, errorSx)}>
          {error}
        </span>
      ) : null}
    </label>
  )
}

const rootStyles = stylex.create({
  root: {
    display: 'grid',
    gap: spacing.xs,
    width: '100%',
  },
})

const labelStyles = stylex.create({
  label: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
  },
})

const inputStyles = stylex.create({
  base: {
    width: '100%',
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
  sm: {
    minHeight: spacing['2xl'],
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    fontSize: typography.stepMinus1,
  },
  md: {
    minHeight: spacing['3xl'],
    paddingInline: spacing.md,
    paddingBlock: spacing.sm,
    fontSize: typography.step0,
  },
})

const stateStyles = stylex.create({
  invalid: {
    borderColor: colors.danger,
    boxShadow: `0 0 0 ${stroke.thick} ${colors.dangerSoft}`,
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const descriptionStyles = stylex.create({
  base: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightBody,
  },
})

const errorStyles = stylex.create({
  base: {
    color: colors.danger,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightBody,
  },
})
