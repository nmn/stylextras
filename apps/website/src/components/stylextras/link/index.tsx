import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Link']>;

export type LinkProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Link = ({ style, ...props }: LinkProps) => (
  <aria.Link
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
