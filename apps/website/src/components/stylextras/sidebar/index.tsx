import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Tree as AriaTree } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaTree>;

export type SidebarProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Sidebar = ({ style, ...props }: SidebarProps) => (
  <AriaTree
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
