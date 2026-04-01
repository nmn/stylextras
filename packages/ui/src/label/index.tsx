import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Label as AriaLabel } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaLabel>;

export type LabelProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Label = ({ style, ...props }: LabelProps) => (
  <AriaLabel
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
