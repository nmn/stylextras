import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['GridList']>;

export type GridProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Grid = ({ style, ...props }: GridProps) => (
  <aria.GridList
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
