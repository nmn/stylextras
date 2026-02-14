import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ComboBox as AriaComboBox } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaComboBox>;

export type ComboBoxProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ComboBox = ({ style, ...props }: ComboBoxProps) => (
  <AriaComboBox
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
