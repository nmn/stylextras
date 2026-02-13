import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Table']>;

export type DataTableProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const DataTable = ({ style, ...props }: DataTableProps) => (
  <aria.Table
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
