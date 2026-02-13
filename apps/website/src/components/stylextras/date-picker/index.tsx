import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['DatePicker']>;

export type DatePickerProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const DatePicker = ({ style, ...props }: DatePickerProps) => (
  <aria.DatePicker
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
