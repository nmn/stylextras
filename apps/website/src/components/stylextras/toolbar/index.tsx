import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Toolbar']>;

export type ToolbarProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Toolbar = ({ style, ...props }: ToolbarProps) => (
  <aria.Toolbar
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
