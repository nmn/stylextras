import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { TagGroup as AriaTagGroup } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaTagGroup>;

export type TagGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const TagGroup = ({ style, ...props }: TagGroupProps) => (
  <AriaTagGroup
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
