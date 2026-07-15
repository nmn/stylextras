import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type BaseProps = ComponentPropsWithRef<'kbd'>

export type KbdSize = 'sm' | 'md'

export type KbdProps = Omit<BaseProps, 'className' | 'style'> & {
  sx?: StyleXStyles
  size?: KbdSize
}

/**
 * Renders a token-styled keyboard key annotation.
 *
 * Search aliases: kbd, keycap, keyboard hint, shortcut key.
 *
 * A11y notes:
 * - Acts as static inline content.
 * - Shortcut meaning and interaction context must be described by nearby text.
 */
export function Kbd({ ref, size = 'md', sx, ...props }: KbdProps) {
  return <kbd ref={ref} {...props} {...stylex.props(baseStyles.base, sizeStyles[size], sx)} />
}

const baseStyles = stylex.create({
  base: {
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    paddingInline: spacing.xs,
    alignItems: 'center',
    backgroundColor: colors.bgInset,
    color: colors.fgSoft,
    display: 'inline-flex',
    fontFamily: typography.fontMono,
    fontWeight: typography.weightMedium,
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    minWidth: spacing.lg,
  },
})

const sizeStyles = stylex.create({
  sm: {
    paddingBlock: spacing.xxxs,
    fontSize: typography.stepMinus2,
    lineHeight: typography.lineHeightSnug,
    minHeight: spacing.lg,
  },
  md: {
    paddingBlock: spacing.xxs,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightSnug,
    minHeight: spacing.xl,
  },
})
