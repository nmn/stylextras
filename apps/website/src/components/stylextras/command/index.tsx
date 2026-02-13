import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Autocomplete']>;

export type CommandProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Command = ({ style, ...props }: CommandProps) => (
  <aria.Autocomplete
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
