import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Table as AriaTable } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaTable>;

export type TableProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Table = ({ style, ...props }: TableProps) => (
  <AriaTable
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
