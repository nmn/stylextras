import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ColorWheel']>;

export type ColorWheelProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorWheel = ({ style, ...props }: ColorWheelProps) => (
  <aria.ColorWheel
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
