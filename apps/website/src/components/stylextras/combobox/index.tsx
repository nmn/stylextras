import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ComboBox']>;

export type ComboBoxProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ComboBox = ({ style, ...props }: ComboBoxProps) => (
  <aria.ComboBox
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
