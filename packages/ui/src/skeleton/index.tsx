import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'

export type SkeletonProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & {
  sx?: StyleXStyles
}

export function Skeleton({ ref, sx, ...props }: SkeletonProps) {
  return <div ref={ref} aria-hidden="true" {...props} {...stylex.props(styles.base, sx)} />
}

const pulse = stylex.keyframes({
  '0%, 100%': { opacity: 0.18 },
  '50%': { opacity: 0.42 },
})

const styles = stylex.create({
  base: {
    animationDuration: `calc(${motion.durationBase} * 10)`,
    animationIterationCount: 'infinite',
    animationName: {
      default: pulse,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationTimingFunction: motion.easeStandard,
    backgroundColor: colors.fgDisabled,
    borderRadius: radius.sm,
    minHeight: spacing.lg,
    opacity: 0.28,
    width: '100%',
  },
})
