import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type SxProp = { sx?: StyleXStyles }

export type CarouselProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'style'
> &
  AccessibleAriaNameProps &
  SxProp
export type CarouselItemProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'style'
> &
  AccessibleAriaNameProps &
  SxProp

/** A native scroll-snap carousel progressively enhanced by scroll markers/buttons. */
export function Carousel({
  'aria-roledescription': ariaRoleDescription = 'carousel',
  ref,
  role = 'region',
  sx,
  tabIndex = 0,
  ...props
}: CarouselProps) {
  return (
    <div
      ref={ref}
      role={role}
      tabIndex={tabIndex}
      aria-roledescription={ariaRoleDescription}
      {...props}
      {...stylex.props(styles.carousel, sx)}
    />
  )
}

export function CarouselItem({
  'aria-roledescription': ariaRoleDescription = 'slide',
  ref,
  role = 'group',
  sx,
  ...props
}: CarouselItemProps) {
  return (
    <div
      ref={ref}
      role={role}
      aria-roledescription={ariaRoleDescription}
      {...props}
      {...stylex.props(styles.item, sx)}
    />
  )
}

/* eslint-disable @stylexjs/valid-styles, @stylexjs/no-legacy-contextual-styles */
const styles = stylex.create({
  carousel: {
    display: 'grid',
    gap: spacing.md,
    gridAutoColumns: 'minmax(min(82vw, 20rem), 1fr)',
    gridAutoFlow: 'column',
    overflowX: 'auto',
    overscrollBehaviorInline: 'contain',
    padding: spacing.xxs,
    scrollBehavior: {
      default: 'smooth',
      '@media (prefers-reduced-motion: reduce)': 'auto',
    },
    scrollMarkerGroup: 'after',
    scrollPaddingInline: spacing.xxs,
    scrollSnapType: 'inline mandatory',
    scrollbarWidth: 'thin',
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: { default: 0, ':focus-visible': stroke.focusRing },
    '::scroll-button(inline-start)': {
      backgroundColor: colors.control,
      borderColor: colors.border,
      borderRadius: radius.round,
      borderStyle: 'solid',
      borderWidth: stroke.thin,
      color: colors.fg,
      content: { default: '"‹"', ':dir(rtl)': '"›"' },
      height: {
        default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
        '@media (pointer: coarse)': spacing.targetCoarse,
      },
      width: {
        default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
        '@media (pointer: coarse)': spacing.targetCoarse,
      },
    },
    '::scroll-button(inline-end)': {
      backgroundColor: colors.control,
      borderColor: colors.border,
      borderRadius: radius.round,
      borderStyle: 'solid',
      borderWidth: stroke.thin,
      color: colors.fg,
      content: { default: '"›"', ':dir(rtl)': '"‹"' },
      height: {
        default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
        '@media (pointer: coarse)': spacing.targetCoarse,
      },
      width: {
        default: `max(${spacing.controlMd}, ${spacing.targetMin})`,
        '@media (pointer: coarse)': spacing.targetCoarse,
      },
    },
  },
  item: {
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    minWidth: 0,
    overflowWrap: 'anywhere',
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
    '::scroll-marker': {
      backgroundColor: colors.borderStrong,
      borderRadius: radius.round,
      content: '""',
      boxSizing: 'border-box',
      height: {
        default: spacing.targetMin,
        '@media (pointer: coarse)': spacing.targetCoarse,
      },
      padding: {
        default: `calc((${spacing.targetMin} - ${spacing.xs}) / 2)`,
        '@media (pointer: coarse)': `calc((${spacing.targetCoarse} - ${spacing.xs}) / 2)`,
      },
      width: {
        default: spacing.targetMin,
        '@media (pointer: coarse)': spacing.targetCoarse,
      },
    },
    '::scroll-marker:target-current': {
      backgroundColor: colors.primary,
    },
  },
})
/* eslint-enable @stylexjs/valid-styles, @stylexjs/no-legacy-contextual-styles */
