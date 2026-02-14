import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Text as AriaText } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaText>;

export type AlertProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Alert = ({ style, ...props }: AlertProps) => (
  <AriaText
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
