import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ListBox']>;

export type ListBoxProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ListBox = ({ style, ...props }: ListBoxProps) => (
  <aria.ListBox
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
