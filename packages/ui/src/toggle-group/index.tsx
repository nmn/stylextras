'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { focusgroupAttributes, focusgroupRef } from '../focusgroup'
import { spacing } from '../tokens/spacing.stylex'

export type ToggleGroupProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'role' | 'style'> & {
  orientation?: 'horizontal' | 'vertical'
  sx?: StyleXStyles
} & AccessibleAriaNameProps

export function ToggleGroup({ orientation = 'horizontal', ref, sx, ...props }: ToggleGroupProps) {
  const setRef = focusgroupRef(ref)
  return (
    <div
      ref={setRef}
      {...props}
      role="toolbar"
      aria-orientation={orientation}
      {...focusgroupAttributes(
        orientation === 'vertical' ? 'toolbar block wrap' : 'toolbar inline wrap',
      )}
      {...stylex.props(styles.group, orientation === 'vertical' && styles.vertical, sx)}
    />
  )
}

const styles = stylex.create({
  group: {
    alignItems: 'center',
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    maxWidth: '100%',
  },
  vertical: {
    alignItems: 'stretch',
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
})
