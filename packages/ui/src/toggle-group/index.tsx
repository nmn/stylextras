import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { focusgroupAttributes, focusgroupRef } from '../focusgroup'
import { spacing } from '../tokens/spacing.stylex'

export type ToggleGroupProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'role' | 'style'> & {
  sx?: StyleXStyles
}

export function ToggleGroup({ ref, sx, ...props }: ToggleGroupProps) {
  const setRef = focusgroupRef(ref)
  return (
    <div
      ref={setRef}
      role="group"
      {...focusgroupAttributes('toolbar wrap')}
      {...props}
      {...stylex.props(styles.group, sx)}
    />
  )
}

const styles = stylex.create({
  group: {
    alignItems: 'center',
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
})
