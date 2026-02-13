import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['SearchField']>;

export type SearchFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const SearchField = ({ style, ...props }: SearchFieldProps) => (
  <aria.SearchField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
