import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef, ReactNode } from 'react'
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
  SxProp & {
    indicator?: ReactNode | false
    indicatorPosition?: CollapsibleIndicatorPosition
  }
export type CollapsibleContentProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> &
  SxProp
export type CollapsibleIndicatorPosition = 'start' | 'end'
export type CollapsibleIndicatorProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'className' | 'style'
> &
  SxProp

export function Collapsible({ ref, sx, ...props }: CollapsibleProps) {
  return <details ref={ref} {...props} {...stylex.props(disclosureMarker, styles.root, sx)} />
}

export function CollapsibleTrigger({
  children,
  indicator,
  indicatorPosition = 'end',
  ref,
  sx,
  ...props
}: CollapsibleTriggerProps) {
  const renderedIndicator =
    indicator === undefined ? (
      <CollapsibleIndicator />
    ) : indicator === false || indicator === true || indicator == null ? null : (
      <span aria-hidden="true" {...stylex.props(styles.customIndicator)}>
        {indicator}
      </span>
    )
  const hasIndicator = renderedIndicator != null

  return (
    <summary
      ref={ref}
      {...props}
      {...stylex.props(
        styles.trigger,
        hasIndicator ? indicatorPositionStyles[indicatorPosition] : styles.triggerWithoutIndicator,
        sx,
      )}
    >
      {hasIndicator && indicatorPosition === 'start' ? renderedIndicator : null}
      <span {...stylex.props(styles.triggerLabel)}>{children}</span>
      {hasIndicator && indicatorPosition === 'end' ? renderedIndicator : null}
    </summary>
  )
}

export function CollapsibleContent({ ref, sx, ...props }: CollapsibleContentProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.content, sx)} />
}

export function CollapsibleIndicator({ ref, sx, ...props }: CollapsibleIndicatorProps) {
  return (
    <span ref={ref} {...props} aria-hidden="true" {...stylex.props(styles.iconFrame, sx)}>
      <span {...stylex.props(styles.icon)} />
    </span>
  )
}

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
  trigger: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': 'transparent',
    },
    outlineColor: {
      default: colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: `calc(0px - ${stroke.focusRing})`,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: stroke.focusRing,
    color: colors.fg,
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'grid',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    gap: spacing.sm,
    lineHeight: typography.lineHeightBody,
    listStyle: 'none',
    minHeight: {
      default: 'auto',
      '@media (pointer: coarse)': 'auto',
    },
    overflowWrap: 'anywhere',
    padding: 0,
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, outline-color',
    transitionTimingFunction: motion.easeStandard,
    width: '100%',
  },
  triggerWithoutIndicator: {
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
  triggerLabel: {
    minWidth: 0,
  },
  customIndicator: {
    alignItems: 'center',
    display: 'inline-flex',
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
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderStyle: 'solid',
    borderWidth: 0,
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    minWidth: 0,
    overflowWrap: 'anywhere',
    padding: 0,
  },
})

const indicatorPositionStyles = stylex.create({
  start: {
    gridTemplateColumns: 'auto minmax(0, 1fr)',
  },
  end: {
    gridTemplateColumns: 'minmax(0, 1fr) auto',
  },
})
