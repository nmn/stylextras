import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { TextField as AriaTextField } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaTextField>;

export type TextFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const TextField = ({ style, ...props }: TextFieldProps) => (
  <AriaTextField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
