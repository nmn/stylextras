import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'

export type DirectionProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & {
  dir: 'auto' | 'ltr' | 'rtl'
  sx?: StyleXStyles
}

export function Direction({ dir, ref, sx, ...props }: DirectionProps) {
  return <div ref={ref} dir={dir} {...props} {...stylex.props(styles.root, sx)} />
}

const styles = stylex.create({
  root: {
    unicodeBidi: 'isolate',
  },
})
