import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

export type ColorSliderProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'style' | 'type'
> & { sx?: StyleXStyles }

/** A native range input for a named color channel. */
export function ColorSlider({ max = 360, min = 0, ref, step = 1, sx, ...props }: ColorSliderProps) {
  return (
    <input
      ref={ref}
      max={max}
      min={min}
      step={step}
      type="range"
      {...props}
      {...stylex.props(styles.input, sx)}
    />
  )
}

const styles = stylex.create({
  input: {
    margin: 0,
    accentColor: {
      default: colors.primary,
      ':user-invalid': colors.danger,
      '[aria-invalid="true"]': colors.danger,
      '@media (forced-colors: active)': 'Highlight',
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':focus-visible': stroke.focusRing,
    },
    minHeight: {
      default: spacing.targetMin,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
    width: '100%',
  },
})
