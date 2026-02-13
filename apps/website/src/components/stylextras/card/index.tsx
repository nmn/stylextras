import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Group']>;

export type CardProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Card = ({ style, ...props }: CardProps) => (
  <aria.Group
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
