import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Keyboard']>;

export type KbdProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Kbd = ({ style, ...props }: KbdProps) => (
  <aria.Keyboard
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
