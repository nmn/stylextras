import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Group']>;

export type FlezProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Flez = ({ style, ...props }: FlezProps) => (
  <aria.Group
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
