import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Checkbox']>;

export type CheckboxProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Checkbox = ({ style, ...props }: CheckboxProps) => (
  <aria.Checkbox
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
