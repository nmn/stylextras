import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { typography } from '../tokens/typography.stylex'

export type LabelProps = Omit<ComponentPropsWithRef<'label'>, 'className' | 'style'> & {
  sx?: StyleXStyles
}

export function Label({ ref, sx, ...props }: LabelProps) {
  return <label ref={ref} {...props} {...stylex.props(styles.base, sx)} />
}

const styles = stylex.create({
  base: {
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
    overflowWrap: 'anywhere',
  },
})
