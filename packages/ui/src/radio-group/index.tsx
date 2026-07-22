import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }
export type RadioGroupProps = Omit<ComponentPropsWithRef<'fieldset'>, 'className' | 'style'> &
  SxProp
export type RadioGroupLegendProps = Omit<
  ComponentPropsWithRef<'legend'>,
  'className' | 'style'
> &
  SxProp
export type RadioGroupItemProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'style' | 'type'
> &
  SxProp

export function RadioGroup({ ref, sx, ...props }: RadioGroupProps) {
  return <fieldset ref={ref} {...props} {...stylex.props(styles.group, sx)} />
}

export function RadioGroupLegend({ ref, sx, ...props }: RadioGroupLegendProps) {
  return <legend ref={ref} {...props} {...stylex.props(styles.legend, sx)} />
}

export function RadioGroupItem({ ref, sx, ...props }: RadioGroupItemProps) {
  return <input ref={ref} type="radio" {...props} {...stylex.props(styles.item, sx)} />
}

/* eslint-disable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles -- Native input state styles its own pseudo-elements without JavaScript. */
const styles = stylex.create({
  group: {
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 0,
    display: 'grid',
    gap: spacing.sm,
    margin: 0,
    padding: 0,
  },
  legend: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    marginBlockEnd: spacing.xs,
  },
  item: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    borderWidth: 0,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'grid',
    opacity: { default: 1, ':disabled': 0.5 },
    placeItems: 'center',
    position: 'relative',
    height: {
      default: spacing.targetMin,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    margin: 0,
    borderRadius: radius.round,
    outlineColor: {
      default: colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: stroke.focusRing,
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
      borderRadius: radius.round,
      borderStyle: 'solid',
      borderWidth: stroke.thin,
      boxSizing: 'border-box',
      content: '""',
      gridColumnStart: '1',
      gridRowStart: '1',
      height: spacing.lg,
      width: spacing.lg,
    },
    '::after': {
      backgroundColor: {
        default: colors.primary,
        '@media (forced-colors: active)': 'Highlight',
      },
      borderRadius: radius.round,
      content: '""',
      gridColumnStart: '1',
      gridRowStart: '1',
      height: spacing.sm,
      opacity: 0,
      width: spacing.sm,
    },
    ':checked::before': {
      borderColor: {
        default: colors.primary,
        '@media (forced-colors: active)': 'Highlight',
      },
    },
    ':checked::after': { opacity: 1 },
    ':user-invalid::before': {
      borderColor: {
        default: colors.danger,
        '@media (forced-colors: active)': 'Highlight',
      },
    },
    '[aria-invalid="true"]::before': {
      borderColor: {
        default: colors.danger,
        '@media (forced-colors: active)': 'Highlight',
      },
    },
  },
})
/* eslint-enable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
