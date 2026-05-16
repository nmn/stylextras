import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type BaseProps = ComponentPropsWithoutRef<'input'>

export type ToggleSize = 'sm' | 'md' | 'lg'

export type ToggleProps = Omit<BaseProps, 'children' | 'className' | 'style' | 'type' | 'size'> & {
  children?: ReactNode
  sx?: StyleXStyles
  inputSx?: StyleXStyles
  size?: ToggleSize
}

/**
 * Renders a checkbox-backed toggle button with a button-like surface.
 *
 * Search aliases: toggle, toggle button, checkbox button, on off control.
 *
 * A11y notes:
 * - Uses native checkbox semantics instead of aria-pressed button semantics.
 * - The caller is responsible for grouping and higher-level selection rules when multiple toggles are related.
 */
export function Toggle({ children, disabled, inputSx, size = 'md', sx, ...props }: ToggleProps) {
  return (
    <label
      {...stylex.props(rootStyles.base, sizeStyles[size], disabled && stateStyles.disabled, sx)}
    >
      <input
        {...props}
        disabled={disabled}
        type="checkbox"
        {...stylex.props(inputStyles.base, inputSx)}
      />
      {children ? <span {...stylex.props(labelStyles.base)}>{children}</span> : null}
    </label>
  )
}

const rootStyles = stylex.create({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderRadius: radius.md,
    color: {
      default: colors.fg,
      ':has(input:checked)': colors.primaryForeground,
    },
    backgroundColor: {
      default: colors.bg,
      ':has(input:checked)': colors.primary,
    },
    borderColor: {
      default: colors.border,
      ':has(input:checked)': colors.primary,
    },
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
})

const sizeStyles = stylex.create({
  sm: {
    minHeight: spacing.xl,
    paddingInline: spacing.sm,
    paddingBlock: spacing['2xs'],
  },
  md: {
    minHeight: spacing['2xl'],
    paddingInline: spacing.md,
    paddingBlock: spacing.xs,
  },
  lg: {
    minHeight: spacing['3xl'],
    paddingInline: spacing.lg,
    paddingBlock: spacing.sm,
  },
})

const stateStyles = stylex.create({
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const inputStyles = stylex.create({
  base: {
    position: 'absolute',
    inset: 0,
    margin: 0,
    opacity: 0,
    cursor: 'inherit',
  },
})

const labelStyles = stylex.create({
  base: {
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
  },
})
