import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type TreeProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'role' | 'style'> & SxProp
export type TreeGroupProps = Omit<ComponentPropsWithRef<'ul'>, 'className' | 'style'> & SxProp
export type TreeBranchProps = Omit<ComponentPropsWithRef<'details'>, 'className' | 'style'> & SxProp
export type TreeBranchTriggerProps = Omit<ComponentPropsWithRef<'summary'>, 'className' | 'style'> &
  SxProp
export type TreeBranchContentProps = TreeGroupProps
export type TreeItemProps = Omit<ComponentPropsWithRef<'li'>, 'className' | 'style'> & SxProp

/** A nested native disclosure list. It deliberately does not claim ARIA tree semantics. */
export function Tree({ ref, sx, ...props }: TreeProps) {
  return <div ref={ref} role="group" {...props} {...stylex.props(styles.root, sx)} />
}

export function TreeGroup({ ref, sx, ...props }: TreeGroupProps) {
  return <ul ref={ref} role="list" {...props} {...stylex.props(styles.group, sx)} />
}

export function TreeBranch({ ref, sx, ...props }: TreeBranchProps) {
  return (
    <li {...stylex.props(styles.branchItem)}>
      <details ref={ref} {...props} {...stylex.props(styles.branch, sx)} />
    </li>
  )
}

export function TreeBranchTrigger({ ref, sx, ...props }: TreeBranchTriggerProps) {
  return <summary ref={ref} {...props} {...stylex.props(styles.branchTrigger, sx)} />
}

export function TreeBranchContent({ ref, sx, ...props }: TreeBranchContentProps) {
  return <ul ref={ref} role="list" {...props} {...stylex.props(styles.branchContent, sx)} />
}

export function TreeItem({ ref, sx, ...props }: TreeItemProps) {
  return <li ref={ref} {...props} {...stylex.props(styles.item, sx)} />
}

const styles = stylex.create({
  root: {
    display: 'grid',
    gap: spacing.xxxs,
    margin: 0,
    minWidth: 0,
    width: '100%',
  },
  group: {
    margin: 0,
    padding: 0,
    gap: spacing.xxxs,
    listStyle: 'none',
    display: 'grid',
    minWidth: 0,
  },
  branchItem: {
    minWidth: 0,
  },
  branch: {
    display: 'grid',
    gap: spacing.xxxs,
    minWidth: 0,
  },
  branchTrigger: {
    borderRadius: radius.sm,
    paddingBlock: spacing.xxs,
    paddingInline: spacing.sm,
    backgroundColor: {
      default: 'transparent',
      ':focus-visible': colors.accent,
      ':hover': colors.accent,
    },
    color: colors.fg,
    cursor: 'pointer',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
    outlineColor: {
      default: 'transparent',
      ':focus-visible': colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: stroke.focusRingOffset,
    outlineStyle: 'solid',
    outlineWidth: {
      default: 0,
      ':focus-visible': stroke.focusRing,
    },
    overflowWrap: 'anywhere',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, color',
    transitionTimingFunction: motion.easeStandard,
    minHeight: {
      default: spacing.controlSm,
      '@media (any-pointer: coarse)': spacing.targetCoarse,
    },
    width: '100%',
  },
  branchContent: {
    margin: 0,
    gap: spacing.xxxs,
    listStyle: 'none',
    display: 'grid',
    paddingInlineStart: spacing.lg,
    minWidth: 0,
  },
  item: {
    borderRadius: radius.sm,
    paddingBlock: spacing.xxs,
    paddingInline: spacing.sm,
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
      ':focus-visible': colors.accent,
    },
    color: colors.fgSoft,
    display: 'flex',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightSnug,
    overflowWrap: 'anywhere',
    minHeight: spacing.controlSm,
    minWidth: 0,
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, color',
    transitionTimingFunction: motion.easeStandard,
    width: '100%',
  },
})
