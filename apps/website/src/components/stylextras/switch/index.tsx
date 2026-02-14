import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaSwitch>;

export type SwitchProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Switch = ({ style, ...props }: SwitchProps) => (
  <AriaSwitch
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
