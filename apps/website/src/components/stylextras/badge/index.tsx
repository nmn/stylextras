import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Text']>;

export type BadgeProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Badge = ({ style, ...props }: BadgeProps) => (
  <aria.Text
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
