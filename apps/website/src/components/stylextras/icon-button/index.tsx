import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaButton>;

export type IconButtonProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const IconButton = ({ style, ...props }: IconButtonProps) => (
  <AriaButton
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
