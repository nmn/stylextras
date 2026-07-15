import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type SxProp = { sx?: StyleXStyles }

export type CarouselProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp
export type CarouselItemProps = Omit<ComponentPropsWithRef<'article'>, 'className' | 'style'> &
  SxProp

/** A native scroll-snap carousel progressively enhanced by scroll markers/buttons. */
export function Carousel({ ref, role = 'region', sx, tabIndex = 0, ...props }: CarouselProps) {
  return (
    <div
      ref={ref}
      role={role}
      tabIndex={tabIndex}
      {...props}
      {...stylex.props(styles.carousel, sx)}
    />
  )
}

export function CarouselItem({ ref, sx, ...props }: CarouselItemProps) {
  return <article ref={ref} {...props} {...stylex.props(styles.item, sx)} />
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
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
    '::scroll-button(inline-start)': {
      backgroundColor: colors.control,
      borderColor: colors.border,
      borderRadius: radius.round,
      borderStyle: 'solid',
      borderWidth: stroke.thin,
      color: colors.fg,
      content: '"‹"',
      height: spacing.controlMd,
      transitionDuration: motion.durationFast,
      width: spacing.controlMd,
    },
    '::scroll-button(inline-end)': {
      backgroundColor: colors.control,
      borderColor: colors.border,
      borderRadius: radius.round,
      borderStyle: 'solid',
      borderWidth: stroke.thin,
      color: colors.fg,
      content: '"›"',
      height: spacing.controlMd,
      transitionDuration: motion.durationFast,
      width: spacing.controlMd,
    },
  },
  item: {
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    minWidth: 0,
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
    '::scroll-marker': {
      backgroundColor: colors.borderStrong,
      borderRadius: radius.round,
      content: '""',
      height: spacing.xs,
      width: spacing.xs,
    },
    ':target-current::scroll-marker': {
      backgroundColor: colors.primary,
    },
  },
})
/* eslint-enable @stylexjs/valid-styles, @stylexjs/no-legacy-contextual-styles */
