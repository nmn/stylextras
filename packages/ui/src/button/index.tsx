import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type NativeButtonProps = ComponentPropsWithRef<'button'>

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'danger'

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon' | 'icon-lg'

export type ButtonProps = Omit<NativeButtonProps, 'className' | 'style'> & {
  size?: ButtonSize
  sx?: StyleXStyles
  variant?: ButtonVariant
}

/** A styled native button. Icon-only buttons use an icon size and an aria-label. */
export function Button({
  ref,
  size = 'md',
  sx,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      {...props}
      {...stylex.props(baseStyles.base, sizeStyles[size], variantStyles[variant], sx)}
    />
  )
}

const baseStyles = stylex.create({
  base: {
    alignItems: 'center',
    appearance: 'none',
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxSizing: 'border-box',
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    display: 'inline-flex',
    flexShrink: 0,
    fontFamily: typography.fontSans,
    fontWeight: typography.weightMedium,
    gap: spacing.controlGap,
    justifyContent: 'center',
    lineHeight: typography.lineHeightSnug,
    opacity: {
      default: 1,
      ':disabled': 0.5,
    },
    outline: 'none',
    scale: {
      default: '1',
      ':active': '0.98',
      ':disabled': '1',
    },
    textDecoration: 'none',
    transitionDuration: motion.durationFast,
    transitionProperty: 'background-color, border-color, box-shadow, color, opacity, scale',
    transitionTimingFunction: motion.easeStandard,
    userSelect: 'none',
    whiteSpace: 'nowrap',
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRingOffset} ${colors.bg}, 0 0 0 calc(${stroke.focusRingOffset} + ${stroke.focusRing}) ${colors.focusRing}`,
    },
  },
})

const sizeStyles = stylex.create({
  sm: {
    fontSize: typography.stepMinus1,
    minHeight: spacing.controlSm,
    paddingInline: spacing.sm,
  },
  md: {
    fontSize: typography.step0,
    minHeight: spacing.controlMd,
    paddingInline: spacing.md,
  },
  lg: {
    fontSize: typography.step0,
    minHeight: spacing.controlLg,
    paddingInline: spacing.lg,
  },
  'icon-sm': {
    height: spacing.controlSm,
    padding: 0,
    width: spacing.controlSm,
  },
  icon: {
    height: spacing.controlMd,
    padding: 0,
    width: spacing.controlMd,
  },
  'icon-lg': {
    height: spacing.controlLg,
    padding: 0,
    width: spacing.controlLg,
  },
})

const variantStyles = stylex.create({
  primary: {
    backgroundColor: {
      default: colors.primary,
      ':hover': colors.primaryHover,
      ':active': colors.primaryActive,
    },
    borderColor: 'transparent',
    color: colors.primaryForeground,
  },
  secondary: {
    backgroundColor: {
      default: colors.secondary,
      ':hover': colors.secondaryHover,
      ':active': colors.secondaryActive,
    },
    borderColor: 'transparent',
    color: colors.secondaryForeground,
  },
  outline: {
    backgroundColor: {
      default: colors.control,
      ':hover': colors.accent,
      ':active': colors.secondaryActive,
    },
    borderColor: colors.border,
    color: colors.fg,
  },
  ghost: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
      ':active': colors.secondaryActive,
    },
    borderColor: 'transparent',
    color: colors.fg,
  },
  link: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: colors.fg,
    textDecoration: {
      default: 'none',
      ':hover': 'underline',
    },
    textUnderlineOffset: '4px',
  },
  danger: {
    backgroundColor: {
      default: colors.danger,
      ':hover': colors.dangerHover,
      ':active': colors.dangerActive,
    },
    borderColor: 'transparent',
    color: colors.fgOnBrand,
  },
})
