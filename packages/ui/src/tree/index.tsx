import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { focusgroupAttributes, focusgroupRef } from '../focusgroup'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type TreeProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'role' | 'style'> &
  SxProp
export type TreeGroupProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'role' | 'style'
> &
  SxProp
export type TreeBranchProps = Omit<ComponentPropsWithRef<'details'>, 'className' | 'style'> &
  SxProp
export type TreeBranchTriggerProps = Omit<
  ComponentPropsWithRef<'summary'>,
  'className' | 'role' | 'style'
> &
  SxProp
export type TreeBranchContentProps = TreeGroupProps
export type TreeItemProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'role' | 'style'
> &
  SxProp

/** Native disclosure tree composed from explicit, individually styled parts. */
export function Tree({ ref, sx, ...props }: TreeProps) {
  return (
    <div
      ref={focusgroupRef(ref)}
      role="tree"
      {...focusgroupAttributes('tree')}
      {...props}
      {...stylex.props(styles.root, sx)}
    />
  )
}

export function TreeGroup({ ref, sx, ...props }: TreeGroupProps) {
  return <div ref={ref} role="group" {...props} {...stylex.props(styles.group, sx)} />
}

export function TreeBranch({ ref, sx, ...props }: TreeBranchProps) {
  return <details ref={ref} {...props} {...stylex.props(styles.branch, sx)} />
}

export function TreeBranchTrigger({ ref, sx, ...props }: TreeBranchTriggerProps) {
  return (
    <summary
      ref={ref}
      role="treeitem"
      {...props}
      {...stylex.props(styles.branchTrigger, sx)}
    />
  )
}

export function TreeBranchContent({ ref, sx, ...props }: TreeBranchContentProps) {
  return (
    <div
      ref={ref}
      role="group"
      {...props}
      {...stylex.props(styles.branchContent, sx)}
    />
  )
}

export function TreeItem({ ref, sx, tabIndex = 0, ...props }: TreeItemProps) {
  return (
    <div
      ref={ref}
      role="treeitem"
      tabIndex={tabIndex}
      {...props}
      {...stylex.props(styles.item, sx)}
    />
  )
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
    display: 'grid',
    gap: spacing.xxxs,
    minWidth: 0,
  },
  branch: {
    display: 'grid',
    gap: spacing.xxxs,
    minWidth: 0,
  },
  branchTrigger: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
      ':focus-visible': colors.accent,
    },
    borderRadius: radius.sm,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRing} ${colors.focusRing}`,
    },
    color: colors.fg,
    cursor: 'pointer',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightSnug,
    listStylePosition: 'inside',
    minHeight: spacing.controlSm,
    outline: 'none',
    paddingBlock: spacing.xxs,
    paddingInline: spacing.sm,
    transitionDuration: motion.durationFast,
    transitionProperty: 'background-color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
    width: '100%',
  },
  branchContent: {
    display: 'grid',
    gap: spacing.xxxs,
    minWidth: 0,
    paddingInlineStart: spacing.lg,
  },
  item: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
      ':focus-visible': colors.accent,
    },
    borderRadius: radius.sm,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRing} ${colors.focusRing}`,
    },
    color: colors.fgSoft,
    display: 'flex',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightSnug,
    minHeight: spacing.controlSm,
    minWidth: 0,
    outline: 'none',
    paddingBlock: spacing.xxs,
    paddingInline: spacing.sm,
    transitionDuration: motion.durationFast,
    transitionProperty: 'background-color, box-shadow, color',
    transitionTimingFunction: motion.easeStandard,
    width: '100%',
  },
})
