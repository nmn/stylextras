import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['DateField']>;

export type DateFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const DateField = ({ style, ...props }: DateFieldProps) => (
  <aria.DateField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
