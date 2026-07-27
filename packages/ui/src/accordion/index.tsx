import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { disclosureMarker } from '../collapsible/markers.stylex'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type AccordionProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp
export type AccordionItemProps = Omit<ComponentPropsWithRef<'details'>, 'className' | 'style'> &
  SxProp & {
    /** Items sharing a name are mutually exclusive through native details behavior. */
    name?: string
  }
export type AccordionTriggerProps = Omit<ComponentPropsWithRef<'summary'>, 'className' | 'style'> &
  SxProp & {
    indicator?: ReactNode | false
    indicatorPosition?: AccordionIndicatorPosition
  }
export type AccordionContentProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> &
  SxProp
export type AccordionIndicatorPosition = 'start' | 'end'
export type AccordionIndicatorProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'className' | 'style'
> &
  SxProp

export function Accordion({ ref, sx, ...props }: AccordionProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.root, sx)} />
}

export function AccordionItem({ ref, sx, ...props }: AccordionItemProps) {
  return <details ref={ref} {...props} {...stylex.props(disclosureMarker, styles.item, sx)} />
}

export function AccordionTrigger({
  children,
  indicator,
  indicatorPosition = 'end',
  ref,
  sx,
  ...props
}: AccordionTriggerProps) {
  const renderedIndicator =
    indicator === undefined ? (
      <AccordionIndicator />
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

export function AccordionContent({ ref, sx, ...props }: AccordionContentProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.content, sx)} />
}

export function AccordionIndicator({ ref, sx, ...props }: AccordionIndicatorProps) {
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
    boxSizing: 'border-box',
    color: colors.fg,
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
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    overflowWrap: 'anywhere',
    minWidth: 0,
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
