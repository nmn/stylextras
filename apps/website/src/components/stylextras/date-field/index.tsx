import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { DateField as AriaDateField } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaDateField>;

export type DateFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const DateField = ({ style, ...props }: DateFieldProps) => (
  <AriaDateField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
