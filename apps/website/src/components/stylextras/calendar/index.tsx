import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Calendar as AriaCalendar } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaCalendar>;

export type CalendarProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Calendar = ({ style, ...props }: CalendarProps) => (
  <AriaCalendar
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
