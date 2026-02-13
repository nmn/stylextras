import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Switch']>;

export type SwitchProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Switch = ({ style, ...props }: SwitchProps) => (
  <aria.Switch
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
