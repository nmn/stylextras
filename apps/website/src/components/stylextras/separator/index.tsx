import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Separator']>;

export type SeparatorProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Separator = ({ style, ...props }: SeparatorProps) => (
  <aria.Separator
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
