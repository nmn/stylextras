import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { FieldError as AriaFieldError } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaFieldError>;

export type FieldErrorsProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const FieldErrors = ({ style, ...props }: FieldErrorsProps) => (
  <AriaFieldError
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
