import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Checkbox as AriaCheckbox } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaCheckbox>;

export type CheckboxProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Checkbox = ({ style, ...props }: CheckboxProps) => (
  <AriaCheckbox
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
