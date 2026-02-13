import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['FieldError']>;

export type FieldErrorsProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const FieldErrors = ({ style, ...props }: FieldErrorsProps) => (
  <aria.FieldError
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
