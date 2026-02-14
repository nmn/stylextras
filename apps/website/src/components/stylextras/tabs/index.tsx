import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Tabs as AriaTabs } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaTabs>;

export type TabsProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Tabs = ({ style, ...props }: TabsProps) => (
  <AriaTabs
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
