import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Modal as AriaModal } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaModal>;

export type DrawerProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Drawer = ({ style, ...props }: DrawerProps) => (
  <AriaModal
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
