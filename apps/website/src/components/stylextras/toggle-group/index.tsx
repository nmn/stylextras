import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ToggleButtonGroup as AriaToggleButtonGroup } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaToggleButtonGroup>;

export type ToggleGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ToggleGroup = ({ style, ...props }: ToggleGroupProps) => (
  <AriaToggleButtonGroup
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
