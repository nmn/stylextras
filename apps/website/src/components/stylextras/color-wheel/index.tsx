import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ColorWheel as AriaColorWheel } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaColorWheel>;

export type ColorWheelProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorWheel = ({ style, ...props }: ColorWheelProps) => (
  <AriaColorWheel
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
