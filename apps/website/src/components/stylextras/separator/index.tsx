import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Separator as AriaSeparator } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaSeparator>;

export type SeparatorProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Separator = ({ style, ...props }: SeparatorProps) => (
  <AriaSeparator
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
