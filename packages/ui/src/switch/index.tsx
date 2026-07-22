import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';
import { colors } from '../tokens/color.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { spacing } from '../tokens/spacing.stylex';
import { stroke } from '../tokens/stroke.stylex';

export type SwitchProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'role' | 'style' | 'type'
> & {
  controlSize?: 'sm' | 'md';
  sx?: StyleXStyles;
};

export function Switch({ controlSize = 'md', ref, sx, ...props }: SwitchProps) {
  return (
    <input
      ref={ref}
      type="checkbox"
      role="switch"
      {...props}
      {...stylex.props(styles.switch, sizeStyles[controlSize], sx)}
    />
  );
}

/* eslint-disable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles -- Native input state styles its own pseudo-elements without JavaScript. */
const styles = stylex.create({
  switch: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    borderWidth: 0,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'grid',
    height: {
      default: spacing.targetMin,
      '@media (pointer: coarse)': spacing.targetCoarse,
    },
    margin: 0,
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: {
      default: colors.focusRing,
      '@media (forced-colors: active)': 'Highlight',
    },
    outlineOffset: 0,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: stroke.focusRing,
    placeItems: 'center',
    position: 'relative',
    transitionDuration: {
      default: motion.durationFast,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'opacity, outline-color',
    transitionTimingFunction: motion.easeStandard,
    width: spacing.targetCoarse,
    '::before': {
      backgroundColor: {
        default: colors.borderStrong,
        '@media (forced-colors: active)': 'CanvasText',
      },
      borderRadius: radius.round,
      content: '""',
      gridColumnStart: '1',
      gridRowStart: '1',
    },
    '::after': {
      backgroundColor: {
        default: colors.bgOverlay,
        '@media (forced-colors: active)': 'Canvas',
      },
      borderColor: {
        default: 'transparent',
        '@media (forced-colors: active)': 'CanvasText',
      },
      borderRadius: radius.round,
      borderStyle: 'solid',
      borderWidth: stroke.thin,
      boxSizing: 'border-box',
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      transitionDuration: {
        default: motion.durationFast,
        '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
      },
      transitionProperty: 'inset-inline-start',
      transitionTimingFunction: motion.easeStandard,
    },
    ':checked::before': {
      backgroundColor: {
        default: colors.primary,
        '@media (forced-colors: active)': 'Highlight',
      },
    },
    ':user-invalid::before': {
      backgroundColor: {
        default: colors.danger,
        '@media (forced-colors: active)': 'CanvasText',
      },
    },
    '[aria-invalid="true"]::before': {
      backgroundColor: {
        default: colors.danger,
        '@media (forced-colors: active)': 'CanvasText',
      },
    },
  },
});

const sizeStyles = stylex.create({
  sm: {
    '::after': {
      height: spacing.md,
      insetInlineStart: `calc(50% - ${spacing.md})`,
      width: spacing.md,
    },
    '::before': { height: spacing.md, width: spacing.xl },
    ':checked::after': { insetInlineStart: '50%' },
  },
  md: {
    '::after': {
      height: spacing.lg,
      insetInlineStart: `calc(50% - ${spacing.lg})`,
      width: spacing.lg,
    },
    '::before': { height: spacing.lg, width: spacing.xxl },
    ':checked::after': { insetInlineStart: '50%' },
  },
});
/* eslint-enable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
