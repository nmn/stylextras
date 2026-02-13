import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['TagGroup']>;

export type TagGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const TagGroup = ({ style, ...props }: TagGroupProps) => (
  <aria.TagGroup
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
