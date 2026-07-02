'use client';

import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { use, type ComponentPropsWithRef } from 'react';
import { colors } from '../tokens/color.stylex';
import { radius } from '../tokens/radius.stylex';
import { spacing } from '../tokens/spacing.stylex';
import { stroke } from '../tokens/stroke.stylex';
import { typography } from '../tokens/typography.stylex';
import { ButtonInGroupContext } from './contex';

type BaseProps = ComponentPropsWithRef<'button'>;

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'dangerOutline';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<BaseProps, 'className' | 'style'> & {
  sx?: StyleXStyles;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

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
  const isInGroup = use(ButtonInGroupContext);
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
  );
}

const baseStyles = stylex.create({
  base: {
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    gap: spacing.xs,
    outline: 'none',
    alignItems: 'center',

    appearance: 'none',
    boxShadow: {
      default: null,
      ':focus-visible': `0 0 0 ${stroke.thick} ${colors.accent} inset`,
    },

    display: 'inline-flex',
    fontFamily: typography.fontSans,
    fontWeight: typography.weightRegular,
    justifyContent: 'center',
    lineHeight: typography.lineHeightSnug,
    scale: {
      default: null,
      ':active': '99%',
    },
    transitionDuration: '150ms',
    transitionProperty: 'background-color, scale',
    transitionTimingFunction: 'ease-in-out',
    whiteSpace: 'nowrap',
  },
  inGroup: {
    borderRadius: {
      default: null,
      ':first-child': `${radius.md} 0 0 ${radius.md}`,
      ':last-child': `0 ${radius.md} ${radius.md} 0`,
    },
    marginInline: `calc(${stroke.thin} / -2)`,
    position: 'relative',
    zIndex: {
      default: 0,
      ':focus-visible': 1,
    },
  },
});

const sizeStyles = stylex.create({
  sm: {
    paddingBlock: spacing.xxs,
    paddingInline: spacing.sm,
    fontSize: typography.stepMinus1,
    minHeight: spacing.xxl,
  },
  md: {
    paddingBlock: spacing.xs,
    paddingInline: spacing.md,
    fontSize: typography.step0,
    minHeight: spacing.xxl,
  },
  lg: {
    paddingBlock: spacing.sm,
    paddingInline: spacing.lg,
    fontSize: typography.step1,
    minHeight: spacing.xxxl,
  },
});

const variantStyles = stylex.create({
  primary: {
    borderColor: colors.primaryActive,
    backgroundColor: {
      default: colors.primary,
      ':hover': colors.primaryHover,
      ':active': colors.primaryActive,
    },
    color: colors.primaryForeground,
  },
  secondary: {
    borderColor: colors.borderStrong,
    backgroundColor: {
      default: colors.secondary,
      ':hover': colors.secondaryHover,
      ':active': colors.secondaryActive,
    },
    color: colors.fg,
  },
  tertiary: {
    borderColor: 'transparent',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.bgRaised,
      ':active': colors.bgInset,
    },
    color: colors.fg,
  },
  outline: {
    borderColor: colors.borderStrong,
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.secondaryHover,
      ':active': colors.secondaryActive,
    },
    color: colors.fg,
  },
  ghost: {
    borderColor: 'transparent',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.secondaryHover,
      ':active': colors.secondaryActive,
    },
    color: colors.fgSoft,
  },
  danger: {
    borderColor: colors.danger,
    backgroundColor: {
      default: colors.danger,
      ':hover': colors.dangerHover,
      ':active': colors.dangerActive,
    },
    color: colors.fgOnBrand,
  },
  dangerOutline: {
    borderColor: colors.danger,
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.dangerSoft,
      ':active': colors.selection,
    },
    color: colors.danger,
  },
});

const stateStyles = stylex.create({
  disabled: {
    opacity: 0.5,
  },
});
