import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { ColorSwatch } from '../color-swatch'
import { colors as colorTokens } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

export type ColorSwatchPickerInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'checked'
  | 'className'
  | 'defaultChecked'
  | 'form'
  | 'name'
  | 'required'
  | 'style'
  | 'type'
  | 'value'
>

export type ColorSwatchPickerOption = {
  color: string
  disabled?: boolean
  inputProps?: ColorSwatchPickerInputProps
  label?: ReactNode
  value?: string
}

export type ColorSwatchPickerProps = Omit<
  ComponentPropsWithRef<'fieldset'>,
  'className' | 'defaultValue' | 'style'
> & {
  colors?: Array<string | ColorSwatchPickerOption>
  defaultValue?: string
  getColorLabel?: (color: string, index: number) => ReactNode
  legend: ReactNode
  name: string
  required?: boolean
  sx?: StyleXStyles
}

const defaultColors = ['#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']

/** A native radio group whose swatches retain labels and standard form behavior. */
export function ColorSwatchPicker({
  colors = defaultColors,
  defaultValue,
  disabled = false,
  form,
  getColorLabel = (color) => color,
  legend,
  name,
  ref,
  required = false,
  sx,
  ...props
}: ColorSwatchPickerProps) {
  const normalizedColors = dedupeOptions(
    colors.map((option) =>
      typeof option === 'string'
        ? { color: option, value: option }
        : { ...option, value: option.value ?? option.color },
    ),
  )
  const initialValue =
    defaultValue ??
    normalizedColors.find((option) => !option.disabled && !option.inputProps?.disabled)?.value ??
    ''

  return (
    <fieldset
      ref={ref}
      disabled={disabled}
      form={form}
      {...props}
      {...stylex.props(styles.group, sx)}
    >
      <legend {...stylex.props(styles.legend)}>{legend}</legend>
      <div {...stylex.props(styles.options)}>
        {normalizedColors.map((option, index) => {
          const label = option.label ?? getColorLabel(option.color, index)
          return (
            <label key={option.value} {...stylex.props(styles.option)}>
              <input
                {...option.inputProps}
                type="radio"
                disabled={option.disabled || option.inputProps?.disabled}
                form={form}
                name={name}
                required={required}
                value={option.value}
                defaultChecked={initialValue === option.value}
                {...stylex.props(styles.input)}
              />
              <ColorSwatch color={option.color} />
              <span {...stylex.props(styles.optionLabel)}>{label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

const warnedDuplicateOptionSets = new Set<string>()

function dedupeOptions(
  options: Array<ColorSwatchPickerOption & { value: string }>,
) {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  const unique = options.filter((option) => {
    if (seen.has(option.value)) {
      duplicates.add(option.value)
      return false
    }
    seen.add(option.value)
    return true
  })

  if (process.env.NODE_ENV !== 'production' && duplicates.size > 0) {
    const key = [...duplicates].sort().join('|')
    if (!warnedDuplicateOptionSets.has(key)) {
      warnedDuplicateOptionSets.add(key)
      console.warn(
        `[stylextras] ColorSwatchPicker ignored duplicate option values: ${[
          ...duplicates,
        ].join(', ')}`,
      )
    }
  }

  return unique
}

const styles = stylex.create({
  group: {
    margin: 0,
    padding: 0,
    borderStyle: 'none',
    borderWidth: 0,
    minWidth: 0,
  },
  legend: {
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    marginBlockEnd: spacing.xs,
  },
  options: {
    gap: spacing.xs,
    alignItems: 'stretch',
    display: 'flex',
    flexWrap: 'wrap',
  },
  option: {
    padding: spacing.xs,
    gap: spacing.xs,
    alignItems: 'center',
    cursor: 'pointer',
    display: 'inline-flex',
    outlineColor: {
      default: 'transparent',
      ':has(input:focus-visible)': colorTokens.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':has(input:focus-visible)': stroke.focusRing,
    },
    minHeight: {
      default: spacing.targetMin,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
  },
  input: {
    margin: -1,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    position: 'absolute',
    height: 1,
    width: 1,
  },
  optionLabel: {
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus1,
    overflowWrap: 'anywhere',
  },
})
