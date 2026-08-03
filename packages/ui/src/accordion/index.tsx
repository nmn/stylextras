import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { disclosureMarker } from '../collapsible/markers.stylex'
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

type SxProp = { sx?: StyleXStyles }

export type AccordionProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp
export type AccordionItemProps = Omit<ComponentPropsWithRef<'details'>, 'className' | 'style'> &
  SxProp & {
    /** Items sharing a name are mutually exclusive through native details behavior. */
    name?: string
  }
export type AccordionTriggerProps = DisclosureTriggerProps
export type AccordionContentProps = DisclosureContentProps
export type AccordionIndicatorPosition = DisclosureIndicatorPosition
export type AccordionIndicatorProps = DisclosureIndicatorProps

export function Accordion({ ref, sx, ...props }: AccordionProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.root, sx)} />
}

export function AccordionItem({ ref, sx, ...props }: AccordionItemProps) {
  return <details ref={ref} {...props} {...stylex.props(disclosureMarker, styles.item, sx)} />
}

export const AccordionTrigger = DisclosureTrigger
export const AccordionContent = DisclosureContent
export const AccordionIndicator = DisclosureIndicator

const styles = stylex.create({
  root: {
    backgroundColor: colors.card,
    boxSizing: 'border-box',
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderStyle: 'solid',
    borderRadius: radius.xl,
    borderWidth: stroke.thin,
    minWidth: 0,
    overflow: 'hidden',
    width: '100%',
  },
  item: {
    boxSizing: 'border-box',
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderStyle: 'solid',
    borderWidth: {
      default: `0 0 ${stroke.thin}`,
      ':last-child': 0,
    },
    minWidth: 0,
    overflow: 'visible',
    paddingBlock: spacing.sm,
    paddingInline: spacing.lg,
    width: '100%',
  },
})
