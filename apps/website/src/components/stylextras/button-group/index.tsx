import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Toolbar']>;

export type ButtonGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ButtonGroup = ({ style, ...props }: ButtonGroupProps) => (
  <aria.Toolbar
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
