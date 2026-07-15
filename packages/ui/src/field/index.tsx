import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type FieldProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp
export type FieldLabelProps = Omit<ComponentPropsWithRef<'label'>, 'className' | 'style'> &
  SxProp
export type FieldDescriptionProps = Omit<
  ComponentPropsWithRef<'p'>,
  'className' | 'style'
> &
  SxProp
export type FieldErrorProps = FieldDescriptionProps

export function Field({ ref, sx, ...props }: FieldProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.field, sx)} />
}

export function FieldLabel({ ref, sx, ...props }: FieldLabelProps) {
  return <label ref={ref} {...props} {...stylex.props(styles.label, sx)} />
}

export function FieldDescription({ ref, sx, ...props }: FieldDescriptionProps) {
  return <p ref={ref} {...props} {...stylex.props(styles.description, sx)} />
}

export function FieldError({ ref, role = 'alert', sx, ...props }: FieldErrorProps) {
  return <p ref={ref} role={role} {...props} {...stylex.props(styles.error, sx)} />
}

const styles = stylex.create({
  field: {
    display: 'grid',
    gap: spacing.xs,
    minWidth: 0,
  },
  label: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
  },
  description: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightBody,
    margin: 0,
  },
  error: {
    color: colors.danger,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightBody,
    margin: 0,
  },
})
