import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['TimeField']>;

export type TimeFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const TimeField = ({ style, ...props }: TimeFieldProps) => (
  <aria.TimeField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
