import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Group as AriaGroup } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaGroup>;

export type CardProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Card = ({ style, ...props }: CardProps) => (
  <AriaGroup
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
