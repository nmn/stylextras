import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['DisclosureGroup']>;

export type DisclosureGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const DisclosureGroup = ({ style, ...props }: DisclosureGroupProps) => (
  <aria.DisclosureGroup
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
