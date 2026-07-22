import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

export type SeparatorProps = Omit<
  ComponentPropsWithRef<'hr'>,
  'aria-hidden' | 'aria-orientation' | 'className' | 'style'
> & {
  decorative?: boolean
  emphasis?: 'subtle' | 'strong'
  orientation?: 'horizontal' | 'vertical'
  sx?: StyleXStyles
}

export function Separator({
  decorative = true,
  emphasis = 'subtle',
  orientation = 'horizontal',
  ref,
  sx,
  ...props
}: SeparatorProps) {
  return (
    <hr
      ref={ref}
      {...props}
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : orientation}
      {...stylex.props(styles.base, orientationStyles[orientation], emphasisStyles[emphasis], sx)}
    />
  )
}

const styles = stylex.create({
  base: {
    borderColor: 'transparent',
    borderStyle: 'none',
    borderWidth: 0,
    display: 'block',
    flexShrink: 0,
  },
})

const orientationStyles = stylex.create({
  horizontal: { height: stroke.thin, marginBlock: spacing.md, width: '100%' },
  vertical: { alignSelf: 'stretch', marginInline: spacing.md, width: stroke.thin },
})

const emphasisStyles = stylex.create({
  subtle: {
    backgroundColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
  strong: {
    backgroundColor: {
      default: colors.borderStrong,
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
})
