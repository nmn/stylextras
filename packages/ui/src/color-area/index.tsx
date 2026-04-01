import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ColorArea as AriaColorArea } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaColorArea>;

export type ColorAreaProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorArea = ({ style, ...props }: ColorAreaProps) => (
  <AriaColorArea
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
