import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import {
  DisclosureContent,
  type DisclosureContentProps,
  DisclosureIndicator,
  type DisclosureIndicatorPosition,
  type DisclosureIndicatorProps,
  DisclosureTrigger,
  type DisclosureTriggerProps,
} from '../internal/disclosure'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { disclosureMarker } from './markers.stylex'

type SxProp = { sx?: StyleXStyles }

export type CollapsibleProps = Omit<ComponentPropsWithRef<'details'>, 'className' | 'style'> &
  SxProp
export type CollapsibleTriggerProps = DisclosureTriggerProps
export type CollapsibleContentProps = DisclosureContentProps
export type CollapsibleIndicatorPosition = DisclosureIndicatorPosition
export type CollapsibleIndicatorProps = DisclosureIndicatorProps

export function Collapsible({ ref, sx, ...props }: CollapsibleProps) {
  return <details ref={ref} {...props} {...stylex.props(disclosureMarker, styles.root, sx)} />
}

export const CollapsibleTrigger = DisclosureTrigger
export const CollapsibleContent = DisclosureContent
export const CollapsibleIndicator = DisclosureIndicator

const styles = stylex.create({
  root: {
    backgroundColor: colors.card,
    boxSizing: 'border-box',
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    overflow: 'hidden',
    minWidth: 0,
    paddingBlock: spacing.sm,
    paddingInline: spacing.lg,
    width: '100%',
  },
})
