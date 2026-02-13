import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Tree']>;

export type TreeProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Tree = ({ style, ...props }: TreeProps) => (
  <aria.Tree
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
