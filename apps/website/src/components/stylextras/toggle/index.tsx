import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ToggleButton']>;

export type ToggleProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Toggle = ({ style, ...props }: ToggleProps) => (
  <aria.ToggleButton
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
