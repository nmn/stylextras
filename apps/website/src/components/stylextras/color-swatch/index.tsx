import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ColorSwatch']>;

export type ColorSwatchProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorSwatch = ({ style, ...props }: ColorSwatchProps) => (
  <aria.ColorSwatch
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
