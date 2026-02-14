import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ColorSwatchPicker as AriaColorSwatchPicker } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaColorSwatchPicker>;

export type ColorSwatchPickerProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorSwatchPicker = ({ style, ...props }: ColorSwatchPickerProps) => (
  <AriaColorSwatchPicker
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
