import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Tree as AriaTree } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaTree>;

export type TreeProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Tree = ({ style, ...props }: TreeProps) => (
  <AriaTree
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
