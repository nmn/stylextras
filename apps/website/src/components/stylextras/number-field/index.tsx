import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { NumberField as AriaNumberField } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaNumberField>;

export type NumberFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const NumberField = ({ style, ...props }: NumberFieldProps) => (
  <AriaNumberField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
