import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ColorSlider']>;

export type ColorSliderProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorSlider = ({ style, ...props }: ColorSliderProps) => (
  <aria.ColorSlider
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
