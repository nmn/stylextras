import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { SearchField as AriaSearchField } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaSearchField>;

export type SearchFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const SearchField = ({ style, ...props }: SearchFieldProps) => (
  <AriaSearchField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
