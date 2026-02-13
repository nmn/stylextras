import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['RangeCalendar']>;

export type RangeCalendarProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const RangeCalendar = ({ style, ...props }: RangeCalendarProps) => (
  <aria.RangeCalendar
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
