import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { TimeField as AriaTimeField } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaTimeField>;

export type TimeFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const TimeField = ({ style, ...props }: TimeFieldProps) => (
  <AriaTimeField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
