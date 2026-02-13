import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['DateRangePicker']>;

export type RangeDatePickerProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const RangeDatePicker = ({ style, ...props }: RangeDatePickerProps) => (
  <aria.DateRangePicker
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
