import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ColorPicker as AriaColorPicker } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaColorPicker>;

export type ColorPickerProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorPicker = ({ style, ...props }: ColorPickerProps) => (
  <AriaColorPicker
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
