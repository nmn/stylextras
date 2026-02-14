import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Menu as AriaMenu } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaMenu>;

export type ContextMenuProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ContextMenu = ({ style, ...props }: ContextMenuProps) => (
  <AriaMenu
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
