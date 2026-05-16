import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { typography } from '../tokens/typography.stylex'

type BaseProps = ComponentPropsWithoutRef<'fieldset'>

type RadioOption = string | { label: string; value: string }

export type RadioGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  sx?: StyleXStyles
  legendSx?: StyleXStyles
  optionSx?: StyleXStyles
  legend?: ReactNode
  name?: string
  options?: RadioOption[]
}

const defaultOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
]

/**
 * Renders a grouped set of native radio controls.
 *
 * Search aliases: radio group, radio buttons, single select group, choice group.
 *
 * A11y notes:
 * - Relies on native fieldset and radio semantics.
 * - It does not add advanced keyboard management beyond what the browser provides.
 */
export function RadioGroup({
  children,
  legend = 'Options',
  legendSx,
  name = 'radio-group',
  optionSx,
  options = defaultOptions,
  sx,
  ...props
}: RadioGroupProps) {
  return (
    <fieldset {...props} {...stylex.props(rootStyles.base, sx)}>
      <legend {...stylex.props(legendStyles.base, legendSx)}>{legend}</legend>
      {children ??
        options.map((option) => {
          const normalizedOption =
            typeof option === 'string' ? { label: option, value: option } : option

          return (
            <label key={normalizedOption.value} {...stylex.props(optionStyles.base, optionSx)}>
              <input name={name} type="radio" value={normalizedOption.value} />
              <span>{normalizedOption.label}</span>
            </label>
          )
        })}
    </fieldset>
  )
}

const rootStyles = stylex.create({
  base: {
    display: 'grid',
    gap: spacing.xs,
    borderStyle: 'solid',
    borderWidth: 0,
    borderColor: 'transparent',
    padding: 0,
    margin: 0,
  },
})
const legendStyles = stylex.create({
  base: {
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
    marginBottom: spacing.xs,
  },
})
const optionStyles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
  },
})
