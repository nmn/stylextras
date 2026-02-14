import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Slider as AriaSlider } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaSlider>;

export type SliderProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Slider = ({ style, ...props }: SliderProps) => (
  <AriaSlider
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
