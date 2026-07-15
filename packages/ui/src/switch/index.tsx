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

const styles = stylex.create({
  switch: {
    appearance: 'none',
    backgroundColor: {
      default: colors.borderStrong,
      ':checked': colors.primary,
    },
    backgroundImage: 'radial-gradient(circle, white 0 58%, transparent 62%)',
    backgroundPosition: {
      default: '0% 50%',
      ':checked': '100% 50%',
      // eslint-disable-next-line @stylexjs/valid-styles
      ':dir(rtl)': {
        default: '100% 50%',
        ':checked': '0% 50%',
      },
    },
    backgroundRepeat: 'no-repeat',
    backgroundSize: '50% 100%',
    borderColor: 'transparent',
    borderRadius: radius.round,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 ${stroke.focusRingOffset} ${colors.bg}, 0 0 0 calc(${stroke.focusRingOffset} + ${stroke.focusRing}) ${colors.focusRing}`,
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    margin: 0,
    opacity: { default: 1, ':disabled': 0.5 },
    outline: 'none',
    transitionDuration: motion.durationFast,
    transitionProperty: 'background-color, background-position, box-shadow',
    transitionTimingFunction: motion.easeStandard,
  },
});

const sizeStyles = stylex.create({
  sm: { height: spacing.md, width: spacing.xl },
  md: { height: spacing.lg, width: spacing.xxl },
});
