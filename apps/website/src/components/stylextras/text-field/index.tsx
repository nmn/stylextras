import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['TextField']>;

export type TextFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const TextField = ({ style, ...props }: TextFieldProps) => (
  <aria.TextField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
