import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ProgressBar as AriaProgressBar } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaProgressBar>;

export type ProgressBarProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ProgressBar = ({ style, ...props }: ProgressBarProps) => (
  <AriaProgressBar
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
