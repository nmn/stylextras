import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Tooltip']>;

export type TooltipProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Tooltip = ({ style, ...props }: TooltipProps) => (
  <aria.Tooltip
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
