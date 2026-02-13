import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['NumberField']>;

export type NumberFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const NumberField = ({ style, ...props }: NumberFieldProps) => (
  <aria.NumberField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
