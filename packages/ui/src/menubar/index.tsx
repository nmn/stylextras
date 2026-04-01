import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Menu as AriaMenu } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaMenu>;

export type MenuBarProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const MenuBar = ({ style, ...props }: MenuBarProps) => (
  <AriaMenu
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
