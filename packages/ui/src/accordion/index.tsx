import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { disclosureMarker } from '../collapsible/markers.stylex'
import { colors } from '../tokens/color.stylex'
import { motion } from '../tokens/motion.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'

type SxProp = { sx?: StyleXStyles }

export type AccordionProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & SxProp
export type AccordionItemProps = Omit<ComponentPropsWithRef<'details'>, 'className' | 'style'> &
  SxProp & {
    /** Items sharing a name are mutually exclusive through native details behavior. */
    name: string
  }
export type AccordionTriggerProps = Omit<ComponentPropsWithRef<'summary'>, 'className' | 'style'> &
  SxProp
export type AccordionContentProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> &
  SxProp

export function Accordion({ ref, sx, ...props }: AccordionProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.root, sx)} />
}

export function AccordionItem({ ref, sx, ...props }: AccordionItemProps) {
  return <details ref={ref} {...props} {...stylex.props(disclosureMarker, styles.item, sx)} />
}

export function AccordionTrigger({ children, ref, sx, ...props }: AccordionTriggerProps) {
  return (
    <summary ref={ref} {...props} {...stylex.props(styles.trigger, sx)}>
      <span {...stylex.props(styles.triggerLabel)}>{children}</span>
      <AccordionIcon />
    </summary>
  )
}

export function AccordionContent({ ref, sx, ...props }: AccordionContentProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.content, sx)} />
}

function AccordionIcon() {
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
    borderStyle: 'solid',
    borderWidth: `${stroke.thin} 0 0`,
    minWidth: 0,
    width: '100%',
  },
  item: {
    boxSizing: 'border-box',
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: `0 0 ${stroke.thin}`,
    minWidth: 0,
    overflow: 'clip',
    width: '100%',
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
    },
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focusRing} solid ${colors.focusRing}`,
    },
    boxSizing: 'border-box',
    color: colors.fg,
    cursor: 'pointer',
    display: 'grid',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    gap: spacing.sm,
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    listStyle: 'none',
    minHeight: spacing.controlLg,
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
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    overflowWrap: 'anywhere',
    padding: `0 ${spacing.md} ${spacing.md}`,
  },
})
