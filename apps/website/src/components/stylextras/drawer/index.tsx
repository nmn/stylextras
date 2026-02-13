import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Modal']>;

export type DrawerProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Drawer = ({ style, ...props }: DrawerProps) => (
  <aria.Modal
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
