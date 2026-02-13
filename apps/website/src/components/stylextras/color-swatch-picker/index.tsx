import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ColorSwatchPicker']>;

export type ColorSwatchPickerProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorSwatchPicker = ({ style, ...props }: ColorSwatchPickerProps) => (
  <aria.ColorSwatchPicker
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
