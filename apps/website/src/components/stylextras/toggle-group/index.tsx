import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['ToggleButtonGroup']>;

export type ToggleGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ToggleGroup = ({ style, ...props }: ToggleGroupProps) => (
  <aria.ToggleButtonGroup
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
