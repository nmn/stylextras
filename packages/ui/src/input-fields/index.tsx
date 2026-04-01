import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Input as AriaInput } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaInput>;

export type InputProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Input = ({ style, ...props }: InputProps) => (
  <AriaInput
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
