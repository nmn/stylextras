import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ProgressBar']>;

export type SpinnerProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Spinner = ({ style, ...props }: SpinnerProps) => (
  <aria.ProgressBar
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
