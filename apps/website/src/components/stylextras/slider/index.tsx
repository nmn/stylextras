import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Slider']>;

export type SliderProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Slider = ({ style, ...props }: SliderProps) => (
  <aria.Slider
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
