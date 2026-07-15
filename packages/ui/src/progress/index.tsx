import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'

export type ProgressProps = Omit<ComponentPropsWithRef<'progress'>, 'className' | 'style'> & {
  sx?: StyleXStyles
}

export function Progress({ max = 100, ref, sx, ...props }: ProgressProps) {
  return <progress ref={ref} max={max} {...props} {...stylex.props(styles.root, sx)} />
}

/* eslint-disable @stylexjs/valid-styles */
const styles = stylex.create({
  root: {
    appearance: 'none',
    backgroundColor: colors.secondary,
    borderColor: 'transparent',
    borderStyle: 'none',
    borderWidth: 0,
    borderRadius: radius.round,
    height: spacing.xs,
    overflow: 'hidden',
    width: '100%',
    '::-webkit-progress-bar': {
      backgroundColor: colors.secondary,
      borderRadius: radius.round,
    },
    '::-webkit-progress-value': {
      backgroundColor: colors.primary,
      borderRadius: radius.round,
      transitionDuration: motion.durationModerate,
      transitionProperty: 'width',
      transitionTimingFunction: motion.easeStandard,
    },
    '::-moz-progress-bar': {
      backgroundColor: colors.primary,
      borderRadius: radius.round,
      transitionDuration: motion.durationModerate,
      transitionProperty: 'width',
      transitionTimingFunction: motion.easeStandard,
    },
  },
})
/* eslint-enable @stylexjs/valid-styles */
