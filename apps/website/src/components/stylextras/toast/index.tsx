import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { UNSTABLE_Toast as AriaToast } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaToast>;

export type ToastProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Toast = ({ style, ...props }: ToastProps) => (
  <AriaToast
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
