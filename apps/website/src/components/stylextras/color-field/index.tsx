import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ColorField']>;

export type ColorFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorField = ({ style, ...props }: ColorFieldProps) => (
  <aria.ColorField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
