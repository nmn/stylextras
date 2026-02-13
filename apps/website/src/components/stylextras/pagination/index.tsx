import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ListBoxLoadMoreItem']>;

export type PaginationProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Pagination = ({ style, ...props }: PaginationProps) => (
  <aria.ListBoxLoadMoreItem
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
