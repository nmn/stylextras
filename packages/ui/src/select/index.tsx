import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type BaseProps = ComponentPropsWithoutRef<'select'>

type SelectOption = string | { label: string; value: string }

export type SelectSize = 'sm' | 'md'

export type SelectProps = Omit<BaseProps, 'className' | 'style' | 'size'> & {
  sx?: StyleXStyles
  selectSx?: StyleXStyles
  labelSx?: StyleXStyles
  label?: ReactNode
  options?: SelectOption[]
  size?: SelectSize
}

const defaultOptions = [
  { label: 'Option one', value: 'one' },
  { label: 'Option two', value: 'two' },
  { label: 'Option three', value: 'three' },
]

/**
 * Renders a token-styled native select element.
 *
 * Search aliases: select, dropdown select, picker, select field.
 *
 * A11y notes:
 * - Uses native select semantics.
 * - Popup behavior and spoken feedback vary by browser and platform.
 */
export function Select({
  children,
  label,
  labelSx,
  options = defaultOptions,
  selectSx,
  size = 'md',
  sx,
  ...props
}: SelectProps) {
  return (
    <label {...stylex.props(rootStyles.base, sx)}>
      {label ? <span {...stylex.props(labelStyles.base, labelSx)}>{label}</span> : null}
      <select {...props} {...stylex.props(selectStyles.base, sizeStyles[size], selectSx)}>
        {children ??
          options.map((option) => {
            const normalizedOption =
              typeof option === 'string' ? { label: option, value: option } : option

            return (
              <option key={normalizedOption.value} value={normalizedOption.value}>
                {normalizedOption.label}
              </option>
            )
          })}
      </select>
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
const selectStyles = stylex.create({
  base: {
    width: '100%',
    appearance: 'none',
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderRadius: radius.lg,
    backgroundColor: colors.bg,
    color: colors.fg,
    fontFamily: typography.fontSans,
    backgroundImage: `linear-gradient(45deg, transparent 50%, ${colors.fgMuted} 50%), linear-gradient(135deg, ${colors.fgMuted} 50%, transparent 50%)`,
    backgroundPosition: `calc(100% - ${spacing.md}) calc(50% - 1px), calc(100% - ${spacing.sm}) calc(50% - 1px)`,
    backgroundSize: '6px 6px, 6px 6px',
    backgroundRepeat: 'no-repeat',
    borderColor: {
      default: colors.borderStrong,
      ':hover': colors.borderAccent,
      ':focus': colors.primary,
    },
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
  },
})
const sizeStyles = stylex.create({
  sm: {
    minHeight: spacing['2xl'],
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    paddingRight: spacing.xl,
    fontSize: typography.stepMinus1,
  },
  md: {
    minHeight: spacing['3xl'],
    paddingInline: spacing.md,
    paddingBlock: spacing.sm,
    paddingRight: spacing['2xl'],
    fontSize: typography.step0,
  },
})
