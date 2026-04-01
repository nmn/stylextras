import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Tooltip as AriaTooltip } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaTooltip>;

export type TooltipProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Tooltip = ({ style, ...props }: TooltipProps) => (
  <AriaTooltip
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
