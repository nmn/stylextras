'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { focusgroupAttributes, focusgroupRef } from '../focusgroup'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { toggleGroupMarker } from './markers.stylex'

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
      {...stylex.props(
        toggleGroupMarker,
        styles.group,
        orientation === 'vertical' && styles.vertical,
        sx,
      )}
    />
  )
}

const styles = stylex.create({
  group: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.round,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: spacing.xxxs,
    maxWidth: '100%',
    overflow: 'hidden',
    padding: spacing.xxxs,
  },
  vertical: {
    alignItems: 'stretch',
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
})
