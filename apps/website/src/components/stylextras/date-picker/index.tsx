import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { DatePicker as AriaDatePicker } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaDatePicker>;

export type DatePickerProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const DatePicker = ({ style, ...props }: DatePickerProps) => (
  <AriaDatePicker
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
