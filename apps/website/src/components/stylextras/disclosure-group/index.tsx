import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { DisclosureGroup as AriaDisclosureGroup } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaDisclosureGroup>;

export type DisclosureGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const DisclosureGroup = ({ style, ...props }: DisclosureGroupProps) => (
  <AriaDisclosureGroup
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
