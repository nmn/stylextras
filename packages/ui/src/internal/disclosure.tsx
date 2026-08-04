import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { disclosureMarker } from '../collapsible/markers.stylex';
import { colors } from '../tokens/color.stylex';
import { motion } from '../tokens/motion.stylex';
import { spacing } from '../tokens/spacing.stylex';
import { stroke } from '../tokens/stroke.stylex';
import { typography } from '../tokens/typography.stylex';

type SxProp = { sx?: StyleXStyles };

export type DisclosureIndicatorPosition = 'start' | 'end';
export type DisclosureTriggerProps = Omit<
  ComponentPropsWithRef<'summary'>,
  'className' | 'style'
> &
  SxProp & {
    indicator?: ReactNode | false;
    indicatorPosition?: DisclosureIndicatorPosition;
  };
export type DisclosureContentProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'style'
> &
  SxProp;
export type DisclosureIndicatorProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'className' | 'style'
> &
  SxProp;

export function DisclosureTrigger({
  children,
  indicator,
  indicatorPosition = 'end',
  ref,
  sx,
  ...props
}: DisclosureTriggerProps) {
  const renderedIndicator =
    indicator === undefined ? (
      <DisclosureIndicator />
    ) : indicator === false ||
      indicator === true ||
      indicator == null ? null : (
      <span aria-hidden="true" {...stylex.props(styles.customIndicator)}>
        {indicator}
      </span>
    );
  const hasIndicator = renderedIndicator != null;

  return (
    <summary
      ref={ref}
      {...props}
      {...stylex.props(
        styles.trigger,
        hasIndicator
          ? indicatorPositionStyles[indicatorPosition]
          : styles.triggerWithoutIndicator,
        sx,
      )}
    >
      {hasIndicator && indicatorPosition === 'start' ? renderedIndicator : null}
      <span {...stylex.props(styles.triggerLabel)}>{children}</span>
      {hasIndicator && indicatorPosition === 'end' ? renderedIndicator : null}
    </summary>
  );
}

export function DisclosureContent({
  ref,
  sx,
  ...props
}: DisclosureContentProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.content, sx)} />;
}

export function DisclosureIndicator({
  ref,
  sx,
  ...props
}: DisclosureIndicatorProps) {
  return (
    <span
      ref={ref}
      {...props}
      aria-hidden="true"
      {...stylex.props(styles.iconFrame, sx)}
    >
      <span {...stylex.props(styles.icon)} />
    </span>
  );
}

const styles = stylex.create({
  trigger: {
    padding: 0,
    gap: spacing.sm,
    listStyle: 'none',
    alignItems: 'center',
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    color: colors.fg,
    cursor: 'pointer',
    display: 'grid',
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
    lineHeight: typography.lineHeightBody,
    outlineColor: {
      default: colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: `calc(0px - ${stroke.focusRing})`,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: stroke.focusRing,
    overflowWrap: 'anywhere',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'background-color, outline-color',
    transitionTimingFunction: motion.easeStandard,
    minHeight: 'auto',
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
    marginInline: spacing.xxs,
    placeItems: 'center',
    display: 'grid',
    pointerEvents: 'none',
    scale: {
      default: '1',
      ':dir(rtl)': '-1 1',
    },
    height: spacing.md,
    width: spacing.md,
  },
  icon: {
    borderInlineEndColor: 'currentColor',
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: stroke.thin,
    color: colors.fgMuted,
    direction: 'ltr',
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
    borderBottomColor: 'currentColor',
    borderBottomStyle: 'solid',
    borderBottomWidth: stroke.thin,
    height: spacing.xs,
    width: spacing.xs,
  },
  content: {
    padding: 0,
    boxSizing: 'border-box',
    color: colors.fgSoft,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    overflowWrap: 'anywhere',
    minWidth: 0,
  },
});

const indicatorPositionStyles = stylex.create({
  start: {
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    textAlign: 'start',
  },
  end: {
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    textAlign: 'start',
  },
});
