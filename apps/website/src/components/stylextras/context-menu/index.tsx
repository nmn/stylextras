import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Menu']>;

export type ContextMenuProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ContextMenu = ({ style, ...props }: ContextMenuProps) => (
  <aria.Menu
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
