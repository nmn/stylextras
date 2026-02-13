import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ColorArea']>;

export type ColorAreaProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorArea = ({ style, ...props }: ColorAreaProps) => (
  <aria.ColorArea
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
