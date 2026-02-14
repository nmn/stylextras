import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ColorSwatch as AriaColorSwatch } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaColorSwatch>;

export type ColorSwatchProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorSwatch = ({ style, ...props }: ColorSwatchProps) => (
  <AriaColorSwatch
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
