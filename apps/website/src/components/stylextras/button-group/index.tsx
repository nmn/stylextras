import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Toolbar as AriaToolbar } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaToolbar>;

export type ButtonGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ButtonGroup = ({ style, ...props }: ButtonGroupProps) => (
  <AriaToolbar
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
