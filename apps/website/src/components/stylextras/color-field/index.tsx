import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { ColorField as AriaColorField } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaColorField>;

export type ColorFieldProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const ColorField = ({ style, ...props }: ColorFieldProps) => (
  <AriaColorField
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
