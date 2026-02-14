import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Link as AriaLink } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaLink>;

export type LinkProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Link = ({ style, ...props }: LinkProps) => (
  <AriaLink
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
