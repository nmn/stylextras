import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { ColorSwatch } from '../color-swatch'
import { colors as colorTokens } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

export type ColorSwatchPickerProps = Omit<
  ComponentPropsWithRef<'fieldset'>,
  'className' | 'defaultValue' | 'style'
> & {
  colors?: string[]
  defaultValue?: string
  getColorLabel?: (color: string) => string
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
  const initialValue = defaultValue ?? colors[0] ?? ''

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
        {colors.map((color, index) => {
          const label = getColorLabel(color)
          return (
            <label key={`${color}-${index}`} {...stylex.props(styles.option)}>
              <input
                type="radio"
                form={form}
                name={name}
                required={required}
                value={color}
                defaultChecked={initialValue === color}
                {...stylex.props(styles.input)}
              />
              <ColorSwatch color={color} />
              <span {...stylex.props(styles.optionLabel)}>{label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
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
