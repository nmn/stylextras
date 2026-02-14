import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { RangeCalendar as AriaRangeCalendar } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaRangeCalendar>;

export type RangeCalendarProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const RangeCalendar = ({ style, ...props }: RangeCalendarProps) => (
  <AriaRangeCalendar
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
