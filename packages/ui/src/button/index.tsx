'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { use, type ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'
import { ButtonInGroupContext } from './contex'

type BaseProps = ComponentPropsWithRef<'button'>

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'critical'
  | 'critical-outline'

export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = Omit<BaseProps, 'className' | 'style'> & {
  sx?: StyleXStyles
  variant?: ButtonVariant
  size?: ButtonSize
}

/**
 * Renders a token-driven native button element.
 *
 * Search aliases: button, action button, cta, push button.
 *
 * A11y notes:
 * - Uses native button semantics.
 * - Does not provide loading announcements, async busy state, or keyboard shortcut affordances on its own.
 */
export function Button({
  disabled,
  ref,
  size = 'md',
  sx,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const isInGroup = use(ButtonInGroupContext)
  return (
    <button
      ref={ref}
      {...props}
      disabled={disabled}
      type={type}
      {...stylex.props(
        baseStyles.base,
        sizeStyles[size],
        variantStyles[variant],
        disabled && stateStyles.disabled,
        isInGroup && baseStyles.inGroup,
        sx,
      )}
    />
  )
}

const baseStyles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderRadius: radius.md,
    fontFamily: typography.fontSans,
    fontWeight: typography.weightRegular,
    lineHeight: typography.lineHeightSnug,
    whiteSpace: 'nowrap',
    boxShadow: {
      default: null,
      ':focus-visible': `0 0 0 ${stroke.thick} ${colors.accent} inset`,
    },
    transitionProperty: 'background-color, scale',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out',
    outline: 'none',
    scale: {
      default: null,
      ':active': '99%',
    },
  },
  inGroup: {
    marginInline: `calc(${stroke.thin} / -2)`,
    borderRadius: {
      default: null,
      ':first-child': `${radius.md} 0 0 ${radius.md}`,
      ':last-child': `0 ${radius.md} ${radius.md} 0`,
    },
    boxShadow: null,
  },
})

const sizeStyles = stylex.create({
  sm: {
    minHeight: spacing['2xl'],
    paddingInline: spacing.sm,
    paddingBlock: spacing['2xs'],
    fontSize: typography.stepMinus1,
  },
  md: {
    minHeight: spacing['2xl'],
    paddingInline: spacing.md,
    paddingBlock: spacing.xs,
    fontSize: typography.step0,
  },
  lg: {
    minHeight: spacing['3xl'],
    paddingInline: spacing.lg,
    paddingBlock: spacing.sm,
    fontSize: typography.step1,
  },
})

const variantStyles = stylex.create({
  primary: {
    color: colors.primaryForeground,
    backgroundColor: {
      default: colors.primary,
      ':hover': colors.primaryHover,
      ':active': colors.primaryActive,
    },
    borderColor: colors.primaryActive,
  },
  secondary: {
    color: colors.fg,
    backgroundColor: {
      default: colors.secondary,
      ':hover': colors.secondaryHover,
      ':active': colors.secondaryActive,
    },
    borderColor: colors.borderStrong,
  },
  tertiary: {
    color: colors.fg,
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.bgRaised,
      ':active': colors.bgInset,
    },
    borderColor: 'transparent',
  },
  outline: {
    color: colors.fg,
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.secondaryHover,
      ':active': colors.secondaryActive,
    },
    borderColor: colors.borderStrong,
  },
  ghost: {
    color: colors.fgSoft,
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.secondaryHover,
      ':active': colors.secondaryActive,
    },
    borderColor: 'transparent',
  },
  danger: {
    color: colors.fgOnBrand,
    backgroundColor: {
      default: colors.danger,
      ':hover': colors.dangerHover,
      ':active': colors.dangerActive,
    },
    borderColor: colors.danger,
  },
  critical: {
    color: colors.fgOnBrand,
    backgroundColor: {
      default: colors.danger,
      ':hover': colors.dangerHover,
      ':active': colors.dangerActive,
    },
    borderColor: colors.danger,
  },
  'critical-outline': {
    color: colors.danger,
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.dangerSoft,
      ':active': colors.selection,
    },
    borderColor: colors.danger,
  },
})

const stateStyles = stylex.create({
  disabled: {
    opacity: 0.5,
  },
})
