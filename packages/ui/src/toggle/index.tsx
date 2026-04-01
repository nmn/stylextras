import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ToggleButton as AriaToggleButton } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaToggleButton>;

export type ToggleProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Toggle = ({ style, ...props }: ToggleProps) => (
  <AriaToggleButton
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
