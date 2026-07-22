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

type ButtonSharedProps = Omit<NativeButtonProps, 'className' | 'size' | 'style'> & {
  sx?: StyleXStyles
  variant?: ButtonVariant
}

export type IconButtonSize = Extract<ButtonSize, `icon${string}`>
export type TextButtonSize = Exclude<ButtonSize, IconButtonSize>

export type AccessibleIconButtonName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-label'?: string; 'aria-labelledby': string }

export type TextButtonProps = ButtonSharedProps & { size?: TextButtonSize }
export type IconButtonProps = ButtonSharedProps &
  AccessibleIconButtonName & { size: IconButtonSize }
export type NamedDynamicSizeButtonProps = ButtonSharedProps &
  AccessibleIconButtonName & { size: ButtonSize }
export type AccessibleButtonProps =
  | TextButtonProps
  | IconButtonProps
  | NamedDynamicSizeButtonProps
export type ButtonProps = AccessibleButtonProps

export type DistributiveOmit<Props, Keys extends PropertyKey> = Props extends unknown
  ? Omit<Props, Keys>
  : never

/** Preserves the size/name discriminant while a wrapper owns other button props. */
export type AccessibleButtonPropsWithout<Keys extends PropertyKey> = DistributiveOmit<
  AccessibleButtonProps,
  Keys
>

/** For wrappers that always render an icon-sized Button themselves. */
export type AccessibleIconButtonPropsWithout<Keys extends PropertyKey> = DistributiveOmit<
  IconButtonProps,
  Keys
>

/** A styled native button. Icon-only buttons use an icon size and an aria-label. */
export function Button({
  ref,
  size = 'md',
  sx,
  type = 'button',
  variant = 'primary',
  ...props
}: AccessibleButtonProps) {
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
    forcedColorAdjust: 'auto',
    fontFamily: typography.fontSans,
    fontWeight: typography.weightMedium,
    gap: spacing.controlGap,
    justifyContent: 'center',
    lineHeight: typography.lineHeightSnug,
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
    overflowWrap: 'anywhere',
    textAlign: 'center',
    textDecoration: 'none',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, border-color, color, opacity, outline-color',
    transitionTimingFunction: motion.easeStandard,
    userSelect: 'none',
    whiteSpace: 'normal',
  },
})

const sizeStyles = stylex.create({
  sm: {
    fontSize: typography.stepMinus1,
    minHeight: {
      default: `max(${spacing.controlSm}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    paddingInline: spacing.sm,
  },
  md: {
    fontSize: typography.step0,
    minHeight: {
      default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    paddingInline: spacing.md,
  },
  lg: {
    fontSize: typography.step0,
    minHeight: {
      default: `max(${spacing.controlLg}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    paddingInline: spacing.lg,
  },
  'icon-sm': {
    height: {
      default: `max(${spacing.controlSm}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    padding: 0,
    width: {
      default: `max(${spacing.controlSm}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
  },
  icon: {
    height: {
      default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    padding: 0,
    width: {
      default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
  },
  'icon-lg': {
    height: {
      default: `max(${spacing.controlLg}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    padding: 0,
    width: {
      default: `max(${spacing.controlLg}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
  },
})

const variantStyles = stylex.create({
  primary: {
    backgroundColor: {
      default: colors.primary,
      ':hover': colors.primaryHover,
      ':active': colors.primaryActive,
    },
    borderColor: {
      default: 'transparent',
      '@media (forced-colors: active)': 'CanvasText',
    },
    color: colors.primaryForeground,
  },
  secondary: {
    backgroundColor: {
      default: colors.secondary,
      ':hover': colors.secondaryHover,
      ':active': colors.secondaryActive,
    },
    borderColor: {
      default: 'transparent',
      '@media (forced-colors: active)': 'CanvasText',
    },
    color: colors.secondaryForeground,
  },
  outline: {
    backgroundColor: {
      default: colors.control,
      ':hover': colors.accent,
      ':active': colors.secondaryActive,
    },
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    color: colors.fg,
  },
  ghost: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
      ':active': colors.secondaryActive,
    },
    borderColor: {
      default: 'transparent',
      '@media (forced-colors: active)': 'CanvasText',
    },
    color: colors.fg,
  },
  link: {
    backgroundColor: 'transparent',
    borderColor: {
      default: 'transparent',
      '@media (forced-colors: active)': 'CanvasText',
    },
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
    borderColor: {
      default: 'transparent',
      '@media (forced-colors: active)': 'CanvasText',
    },
    color: colors.fgOnBrand,
  },
})
