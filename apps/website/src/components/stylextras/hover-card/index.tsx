import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Popover']>;

export type HoverCardProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const HoverCard = ({ style, ...props }: HoverCardProps) => (
  <aria.Popover
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
