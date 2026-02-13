import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ProgressBar']>;

export type ProgressBarProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ProgressBar = ({ style, ...props }: ProgressBarProps) => (
  <aria.ProgressBar
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
