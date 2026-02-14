import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Keyboard as AriaKeyboard } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaKeyboard>;

export type KbdProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Kbd = ({ style, ...props }: KbdProps) => (
  <AriaKeyboard
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
