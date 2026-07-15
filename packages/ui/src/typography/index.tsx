import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef, ElementType } from 'react'
import { colors } from '../tokens/color.stylex'
import { typography } from '../tokens/typography.stylex'

export type TypographyTone =
  | 'default'
  | 'soft'
  | 'muted'
  | 'brand'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export type TypographyScale = 'label' | 'body' | 'title' | 'display'

export type TypographyProps<T extends ElementType = 'p'> = Omit<
  ComponentPropsWithRef<T>,
  'className' | 'style'
> & {
  as?: T
  mono?: boolean
  scale?: TypographyScale
  sx?: StyleXStyles
  tone?: TypographyTone
}

export function Typography<T extends ElementType = 'p'>({
  as,
  mono = false,
  scale = 'body',
  sx,
  tone = 'default',
  ...props
}: TypographyProps<T>) {
  const Component = as ?? 'p'
  return (
    <Component
      {...props}
      {...stylex.props(
        styles.base,
        scaleStyles[scale],
        toneStyles[tone],
        mono && styles.mono,
        sx,
      )}
    />
  )
}

const styles = stylex.create({
  base: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontWeight: typography.weightRegular,
    letterSpacing: typography.trackingNormal,
    lineHeight: typography.lineHeightBody,
    margin: 0,
  },
  mono: { fontFamily: typography.fontMono },
})

const toneStyles = stylex.create({
  default: { color: colors.fg },
  soft: { color: colors.fgSoft },
  muted: { color: colors.fgMuted },
  brand: { color: colors.brand },
  info: { color: colors.info },
  success: { color: colors.success },
  warning: { color: colors.warning },
  danger: { color: colors.danger },
})

const scaleStyles = stylex.create({
  label: {
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
    letterSpacing: typography.trackingWide,
    lineHeight: typography.lineHeightSnug,
  },
  body: {
    fontSize: typography.step0,
  },
  title: {
    fontSize: typography.step1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightTight,
  },
  display: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.step4,
    fontWeight: typography.weightBold,
    letterSpacing: typography.trackingTight,
    lineHeight: typography.lineHeightTight,
  },
})
