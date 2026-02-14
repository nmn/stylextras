import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Autocomplete as AriaAutocomplete } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaAutocomplete>;

export type CommandProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Command = ({ style, ...props }: CommandProps) => (
  <AriaAutocomplete
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
