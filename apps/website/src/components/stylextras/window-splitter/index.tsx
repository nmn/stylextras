import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Separator as AriaSeparator } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaSeparator>;

export type WindowSplitterProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const WindowSplitter = ({ style, ...props }: WindowSplitterProps) => (
  <AriaSeparator
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
