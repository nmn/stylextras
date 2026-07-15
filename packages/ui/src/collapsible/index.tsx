import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'
import { disclosureMarker } from './markers.stylex'

type SxProp = { sx?: StyleXStyles }

export type CollapsibleProps = Omit<ComponentPropsWithRef<'details'>, 'className' | 'style'> &
  SxProp
export type CollapsibleTriggerProps = Omit<
  ComponentPropsWithRef<'summary'>,
  'className' | 'style'
> &
  SxProp
export type CollapsibleContentProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> &
  SxProp

export function Collapsible({ ref, sx, ...props }: CollapsibleProps) {
  return <details ref={ref} {...props} {...stylex.props(disclosureMarker, styles.root, sx)} />
}

export function CollapsibleTrigger({ children, ref, sx, ...props }: CollapsibleTriggerProps) {
  return (
    <summary ref={ref} {...props} {...stylex.props(styles.trigger, sx)}>
      <span {...stylex.props(styles.triggerLabel)}>{children}</span>
      <CollapsibleIcon />
    </summary>
  )
}

export function CollapsibleContent({ ref, sx, ...props }: CollapsibleContentProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.content, sx)} />
}

function CollapsibleIcon() {
  return (
    <span aria-hidden="true" {...stylex.props(styles.iconFrame)}>
      <span {...stylex.props(styles.icon)} />
    </span>
  )
}

const styles = stylex.create({
  root: {
    boxSizing: 'border-box',
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    overflow: 'clip',
    minWidth: 0,
    width: '100%',
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: {
      default: colors.surface,
      ':hover': colors.accent,
    },
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focusRing} solid ${colors.focusRing}`,
    },
    color: colors.fg,
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'grid',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    gap: spacing.sm,
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    listStyle: 'none',
    minHeight: spacing.controlMd,
    overflowWrap: 'anywhere',
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    transitionDuration: motion.durationFast,
    transitionProperty: 'background-color, outline-color',
    transitionTimingFunction: motion.easeStandard,
    width: '100%',
  },
  triggerLabel: {
    minWidth: 0,
  },
  iconFrame: {
    display: 'grid',
    height: spacing.md,
    marginInline: spacing.xxs,
    placeItems: 'center',
    pointerEvents: 'none',
    scale: {
      default: '1',
      ':dir(rtl)': '-1 1',
    },
    width: spacing.md,
  },
  icon: {
    borderBottomColor: 'currentColor',
    borderBottomStyle: 'solid',
    borderBottomWidth: stroke.thin,
    borderInlineEndColor: 'currentColor',
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: stroke.thin,
    color: colors.fgMuted,
    direction: 'ltr',
    height: spacing.xs,
    rotate: {
      default: '-45deg',
      [stylex.when.ancestor(':open', disclosureMarker)]: '45deg',
    },
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'rotate',
    transitionTimingFunction: motion.easeStandard,
    width: spacing.xs,
  },
  content: {
    boxSizing: 'border-box',
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: `${stroke.thin} 0 0`,
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    overflowWrap: 'anywhere',
    padding: spacing.md,
  },
})
