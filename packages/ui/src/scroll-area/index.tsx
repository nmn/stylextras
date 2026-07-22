import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { stroke } from '../tokens/stroke.stylex'

type ScrollAreaBaseProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'style' | 'tabIndex'
> & {
  sx?: StyleXStyles
}

export type ScrollAreaProps =
  | (ScrollAreaBaseProps & {
      'aria-label'?: string
      'aria-labelledby'?: string
      tabIndex?: -1
    })
  | (ScrollAreaBaseProps & AccessibleAriaNameProps & { tabIndex: 0 })

export function ScrollArea({ ref, sx, tabIndex, ...props }: ScrollAreaProps) {
  return <div ref={ref} tabIndex={tabIndex} {...props} {...stylex.props(styles.root, sx)} />
}

const styles = stylex.create({
  root: {
    overflow: 'auto',
    overscrollBehavior: 'contain',
    outlineColor: {
      default: colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: stroke.focusRing,
    scrollbarColor: {
      default: `${colors.borderStrong} transparent`,
      '@media (forced-colors: active)': 'auto',
    },
    scrollbarGutter: 'stable',
    scrollbarWidth: 'auto',
    '::-webkit-scrollbar': {
      height: {
        default: 14,
        '@media (pointer: coarse)': 16,
      },
      width: {
        default: 14,
        '@media (pointer: coarse)': 16,
      },
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: colors.borderStrong,
      backgroundClip: 'padding-box',
      borderColor: 'transparent',
      borderRadius: radius.round,
      borderStyle: 'solid',
      borderWidth: 3,
    },
  },
})
