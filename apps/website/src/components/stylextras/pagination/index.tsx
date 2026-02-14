import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ListBoxLoadMoreItem as AriaListBoxLoadMoreItem } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaListBoxLoadMoreItem>;

export type PaginationProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Pagination = ({ style, ...props }: PaginationProps) => (
  <AriaListBoxLoadMoreItem
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
