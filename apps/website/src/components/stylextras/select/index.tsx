import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Select']>;

export type SelectProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Select = ({ style, ...props }: SelectProps) => (
  <aria.Select
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
