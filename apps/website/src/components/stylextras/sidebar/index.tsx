import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Tree']>;

export type SidebarProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Sidebar = ({ style, ...props }: SidebarProps) => (
  <aria.Tree
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
