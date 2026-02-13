import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Input']>;

export type InputProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Input = ({ style, ...props }: InputProps) => (
  <aria.Input
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
