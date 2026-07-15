import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'

export type ScrollAreaProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & {
  sx?: StyleXStyles
}

export function ScrollArea({ ref, sx, tabIndex = 0, ...props }: ScrollAreaProps) {
  return <div ref={ref} tabIndex={tabIndex} {...props} {...stylex.props(styles.root, sx)} />
}

const styles = stylex.create({
  root: {
    overflow: 'auto',
    overscrollBehavior: 'contain',
    scrollbarColor: `${colors.borderStrong} transparent`,
    scrollbarWidth: 'thin',
    '::-webkit-scrollbar': {
      height: 10,
      width: 10,
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
