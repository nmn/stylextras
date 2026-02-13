import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['UNSTABLE_Toast']>;

export type ToastProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Toast = ({ style, ...props }: ToastProps) => (
  <aria.UNSTABLE_Toast
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
