import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { GridList as AriaGridList } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaGridList>;

export type GridProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Grid = ({ style, ...props }: GridProps) => (
  <AriaGridList
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
