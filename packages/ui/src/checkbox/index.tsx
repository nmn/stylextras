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
    backgroundColor: {
      default: colors.control,
      ':checked': colors.primary,
      ':indeterminate': colors.primary,
    },
    borderColor: {
      default: colors.borderStrong,
      ':checked': colors.primary,
      ':indeterminate': colors.primary,
    },
    borderRadius: radius.xs,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRingOffset} ${colors.bg}, 0 0 0 calc(${stroke.focusRingOffset} + ${stroke.focusRing}) ${colors.focusRing}`,
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    color: colors.primaryForeground,
    display: 'grid',
    flexShrink: 0,
    margin: 0,
    opacity: { default: 1, ':disabled': 0.5 },
    outline: 'none',
    placeItems: 'center',
    transitionDuration: motion.durationFast,
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
    '::before': {
      backgroundColor: 'currentColor',
      clipPath: 'polygon(14% 44%, 0 59%, 40% 100%, 100% 18%, 84% 4%, 38% 70%)',
      content: '""',
      height: '60%',
      opacity: 0,
      width: '60%',
    },
    ':checked::before': {
      opacity: 1,
    },
    ':indeterminate::before': {
      clipPath: 'inset(42% 12%)',
      opacity: 1,
    },
  },
})

const sizeStyles = stylex.create({
  sm: { height: spacing.md, width: spacing.md },
  md: { height: spacing.lg, width: spacing.lg },
})
