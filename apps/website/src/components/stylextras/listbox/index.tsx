import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ListBox as AriaListBox } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaListBox>;

export type ListBoxProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ListBox = ({ style, ...props }: ListBoxProps) => (
  <AriaListBox
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
