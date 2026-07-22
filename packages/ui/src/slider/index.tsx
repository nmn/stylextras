import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

export type SliderProps = Omit<ComponentPropsWithRef<'input'>, 'className' | 'style' | 'type'> & {
  sx?: StyleXStyles
}

export function Slider({ max = 100, min = 0, ref, step = 1, sx, ...props }: SliderProps) {
  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      {...props}
      {...stylex.props(styles.slider, sx)}
    />
  )
}

const styles = stylex.create({
  slider: {
    accentColor: {
      default: colors.primary,
      ':user-invalid': colors.danger,
      '[aria-invalid="true"]': colors.danger,
      '@media (forced-colors: active)': 'Highlight',
    },
    appearance: 'none',
    backgroundClip: 'content-box',
    backgroundColor: colors.secondary,
    borderRadius: radius.round,
    boxSizing: 'border-box',
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    minHeight: {
      default: spacing.targetMin,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    marginBlock: spacing.xxs,
    marginInline: 0,
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: {
      default: colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: stroke.focusRing,
    paddingBlock: {
      default: `calc((${spacing.targetMin} - ${spacing.xs}) / 2)`,
      '@media (pointer: coarse)': `calc((${spacing.targetCoarse} - ${spacing.xs}) / 2)`,
    },
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, opacity, outline-color',
    transitionTimingFunction: motion.easeStandard,
    width: '100%',
    '::-webkit-slider-thumb': {
      appearance: 'none',
      backgroundColor: colors.bgOverlay,
      borderColor: colors.primary,
      borderRadius: radius.round,
      borderStyle: 'solid',
      borderWidth: stroke.thick,
      boxShadow: `0 1px 2px ${colors.overlay}`,
      height: spacing.lg,
      transitionDuration: motion.durationFast,
      width: spacing.lg,
    },
    '::-moz-range-thumb': {
      backgroundColor: colors.bgOverlay,
      borderColor: colors.primary,
      borderRadius: radius.round,
      borderStyle: 'solid',
      borderWidth: stroke.thick,
      boxShadow: `0 1px 2px ${colors.overlay}`,
      height: spacing.lg,
      width: spacing.lg,
    },
  },
})
