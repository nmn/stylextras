import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

export type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'className' | 'style' | 'type'> & {
  controlSize?: 'sm' | 'md'
  sx?: StyleXStyles
}

export function Checkbox({ controlSize = 'md', ref, sx, ...props }: CheckboxProps) {
  return (
    <input
      ref={ref}
      type="checkbox"
      {...props}
      {...stylex.props(styles.checkbox, sizeStyles[controlSize], sx)}
    />
  )
}

const styles = stylex.create({
  checkbox: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    borderWidth: 0,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    color: {
      default: colors.primaryForeground,
      '@media (forced-colors: active)': 'HighlightText',
    },
    display: 'grid',
    flexShrink: 0,
    height: {
      default: spacing.targetMin,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    margin: 0,
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: {
      default: colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: 0,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: stroke.focusRing,
    placeItems: 'center',
    position: 'relative',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'opacity, outline-color',
    transitionTimingFunction: motion.easeStandard,
    width: {
      default: spacing.targetMin,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    '::before': {
      backgroundColor: {
        default: colors.control,
        '@media (forced-colors: active)': 'Canvas',
      },
      borderColor: {
        default: colors.borderStrong,
        '@media (forced-colors: active)': 'CanvasText',
      },
      borderRadius: radius.xs,
      borderStyle: 'solid',
      borderWidth: stroke.thin,
      boxSizing: 'border-box',
      content: '""',
      gridColumnStart: '1',
      gridRowStart: '1',
    },
    '::after': {
      backgroundColor: {
        default: colors.primaryForeground,
        '@media (forced-colors: active)': 'HighlightText',
      },
      clipPath: 'polygon(14% 44%, 0 59%, 40% 100%, 100% 18%, 84% 4%, 38% 70%)',
      content: '""',
      gridColumnStart: '1',
      gridRowStart: '1',
      opacity: 0,
    },
    /* eslint-disable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles -- Native host state must precede its generated pseudo-element selector. */
    ':checked::before': {
      backgroundColor: {
        default: colors.primary,
        '@media (forced-colors: active)': 'Highlight',
      },
      borderColor: {
        default: colors.primary,
        '@media (forced-colors: active)': 'Highlight',
      },
    },
    ':checked::after': {
      opacity: 1,
    },
    ':indeterminate::before': {
      backgroundColor: {
        default: colors.primary,
        '@media (forced-colors: active)': 'Highlight',
      },
      borderColor: {
        default: colors.primary,
        '@media (forced-colors: active)': 'Highlight',
      },
    },
    ':indeterminate::after': {
      clipPath: 'inset(42% 12%)',
      opacity: 1,
    },
    ':user-invalid::before': {
      borderColor: {
        default: colors.danger,
        '@media (forced-colors: active)': 'CanvasText',
      },
    },
    '[aria-invalid="true"]::before': {
      borderColor: {
        default: colors.danger,
        '@media (forced-colors: active)': 'CanvasText',
      },
    },
    /* eslint-enable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
  },
})

const sizeStyles = stylex.create({
  sm: {
    '::after': {
      height: `calc(${spacing.md} * 0.6)`,
      width: `calc(${spacing.md} * 0.6)`,
    },
    '::before': { height: spacing.md, width: spacing.md },
  },
  md: {
    '::after': {
      height: `calc(${spacing.lg} * 0.6)`,
      width: `calc(${spacing.lg} * 0.6)`,
    },
    '::before': { height: spacing.lg, width: spacing.lg },
  },
})
