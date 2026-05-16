import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentProps } from 'react'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { ButtonInGroupContext } from '../button/contex'

type BaseProps = ComponentProps<'div'>

export type ButtonGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  sx?: StyleXStyles
}

/**
 * Renders a layout wrapper for visually grouped buttons.
 *
 * Search aliases: button group, actions row, control group, button cluster.
 *
 * A11y notes:
 * - Provides grouping layout only.
 * - Does not add toolbar roving focus or composite keyboard behavior by itself.
 */
export function ButtonGroup({ sx, ...props }: ButtonGroupProps) {
  return (
    <div {...props} role="group" {...stylex.props(styles.base, sx)}>
      <ButtonInGroupContext value={true}>{props.children}</ButtonInGroupContext>
    </div>
  )
}

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0,
    flexWrap: 'nowrap',
    borderRadius: radius.md,
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgRaised,
    overflow: 'hidden',
    paddingInline: `calc(${stroke.thin} / 2)`,
  },
})
