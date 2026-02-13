import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Button']>;

export type ButtonProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Button = ({ style, ...props }: ButtonProps) => (
  <aria.Button
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
