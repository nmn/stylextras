import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'
import { toggleGroupMarker } from '../toggle-group/markers.stylex'

export type ToggleSize = 'sm' | 'md' | 'lg'
export type ToggleProps = Omit<
  ComponentPropsWithRef<'button'>,
  'aria-pressed' | 'className' | 'style'
> & {
  'aria-pressed': boolean | 'false' | 'mixed' | 'true'
  size?: ToggleSize
  sx?: StyleXStyles
}

/** A styled pressed button. Consumers own aria-pressed state through native props. */
export function Toggle({ ref, size = 'md', sx, type = 'button', ...props }: ToggleProps) {
  return (
    <button
      ref={ref}
      type={type}
      {...props}
      {...stylex.props(styles.toggle, sizeStyles[size], sx)}
    />
  )
}

const styles = stylex.create({
  toggle: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.selection,
      ':is([aria-pressed="true"], [aria-pressed="mixed"])': colors.selection,
    },
    borderColor: {
      default: colors.border,
      [stylex.when.ancestor(':where(*)', toggleGroupMarker)]: 'transparent',
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: {
      default: radius.sm,
      [stylex.when.ancestor(':where(*)', toggleGroupMarker)]: radius.round,
    },
    borderStyle: 'solid',
    borderWidth: {
      default: stroke.thin,
      [stylex.when.ancestor(':where(*)', toggleGroupMarker)]: 0,
    },
    boxSizing: 'border-box',
    color: {
      default: colors.fg,
      ':is([aria-pressed="true"], [aria-pressed="mixed"])': colors.fg,
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    forcedColorAdjust: 'auto',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    gap: spacing.xs,
    justifyContent: 'center',
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: {
      default: colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: stroke.focusRing,
    overflowWrap: 'anywhere',
    textAlign: 'center',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, border-color, color, outline-color',
    transitionTimingFunction: motion.easeStandard,
  },
})

const sizeStyles = stylex.create({
  sm: {
    minHeight: {
      default: `max(${spacing.controlSm}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    paddingInline: spacing.xs,
  },
  md: {
    minHeight: {
      default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    paddingInline: spacing.md,
  },
  lg: {
    minHeight: {
      default: `max(${spacing.controlLg}, ${spacing.targetMin})`,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    paddingInline: spacing.lg,
  },
})
