import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Text as AriaText } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaText>;

export type SkeletonProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Skeleton = ({ style, ...props }: SkeletonProps) => (
  <AriaText
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
