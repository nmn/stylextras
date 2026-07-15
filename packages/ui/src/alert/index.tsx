import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }
export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'danger'
export type AlertProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> &
  SxProp & { variant?: AlertVariant }
export type AlertTitleProps = Omit<ComponentPropsWithRef<'h5'>, 'className' | 'style'> &
  SxProp
export type AlertDescriptionProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'style'
> &
  SxProp

export function Alert({ ref, role = 'status', sx, variant = 'default', ...props }: AlertProps) {
  return (
    <div
      ref={ref}
      role={role}
      {...props}
      {...stylex.props(styles.alert, variantStyles[variant], sx)}
    />
  )
}

export function AlertTitle({ ref, sx, ...props }: AlertTitleProps) {
  return <h5 ref={ref} {...props} {...stylex.props(styles.title, sx)} />
}

export function AlertDescription({ ref, sx, ...props }: AlertDescriptionProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.description, sx)} />
}

const styles = stylex.create({
  alert: {
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    color: colors.fg,
    display: 'grid',
    gap: spacing.xxs,
    padding: spacing.md,
  },
  title: {
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightSnug,
    margin: 0,
  },
  description: {
    color: 'inherit',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    opacity: 0.76,
  },
})

const variantStyles = stylex.create({
  default: {
    backgroundColor: colors.bgSubtle,
    color: `color-mix(in oklab, ${colors.fg} 92%, ${colors.fgSoft})`,
  },
  info: {
    backgroundColor: colors.infoSoft,
    borderColor: colors.info,
    color: `color-mix(in oklab, ${colors.fg} 92%, ${colors.info})`,
  },
  success: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    color: `color-mix(in oklab, ${colors.fg} 92%, ${colors.success})`,
  },
  warning: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
    color: `color-mix(in oklab, ${colors.fg} 92%, ${colors.warning})`,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
    color: `color-mix(in oklab, ${colors.fg} 92%, ${colors.danger})`,
  },
})
