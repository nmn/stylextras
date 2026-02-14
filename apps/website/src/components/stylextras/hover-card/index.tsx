import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Popover as AriaPopover } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaPopover>;

export type HoverCardProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const HoverCard = ({ style, ...props }: HoverCardProps) => (
  <AriaPopover
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
