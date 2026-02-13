import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Calendar']>;

export type CalendarProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Calendar = ({ style, ...props }: CalendarProps) => (
  <aria.Calendar
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
