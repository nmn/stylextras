import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ColorSlider as AriaColorSlider } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaColorSlider>;

export type ColorSliderProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorSlider = ({ style, ...props }: ColorSliderProps) => (
  <AriaColorSlider
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
