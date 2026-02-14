import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Menu as AriaMenu } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaMenu>;

export type DropdownMenuProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const DropdownMenu = ({ style, ...props }: DropdownMenuProps) => (
  <AriaMenu
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
