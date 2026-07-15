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

/* eslint-disable @stylexjs/valid-styles */
const styles = stylex.create({
  slider: {
    accentColor: colors.primary,
    appearance: 'none',
    backgroundColor: colors.secondary,
    borderRadius: radius.round,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRingOffset} ${colors.bg}, 0 0 0 calc(${stroke.focusRingOffset} + ${stroke.focusRing}) ${colors.focusRing}`,
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    height: spacing.xs,
    margin: `${spacing.sm} 0`,
    opacity: { default: 1, ':disabled': 0.5 },
    outline: 'none',
    transitionDuration: motion.durationFast,
    transitionProperty: 'box-shadow, opacity',
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
/* eslint-enable @stylexjs/valid-styles */
