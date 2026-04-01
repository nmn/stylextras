import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Form as AriaForm } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaForm>;

export type FormProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Form = ({ style, ...props }: FormProps) => (
  <AriaForm
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
