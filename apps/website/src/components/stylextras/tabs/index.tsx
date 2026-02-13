import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Tabs']>;

export type TabsProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Tabs = ({ style, ...props }: TabsProps) => (
  <aria.Tabs
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
