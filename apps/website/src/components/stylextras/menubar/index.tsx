import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Menu']>;

export type MenuBarProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const MenuBar = ({ style, ...props }: MenuBarProps) => (
  <aria.Menu
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
