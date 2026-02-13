import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Form']>;

export type FormProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Form = ({ style, ...props }: FormProps) => (
  <aria.Form
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
