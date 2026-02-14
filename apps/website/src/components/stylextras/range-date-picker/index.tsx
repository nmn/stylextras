import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { DateRangePicker as AriaDateRangePicker } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaDateRangePicker>;

export type RangeDatePickerProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const RangeDatePicker = ({ style, ...props }: RangeDatePickerProps) => (
  <AriaDateRangePicker
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
