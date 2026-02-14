import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Group as AriaGroup } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaGroup>;

export type InputGroupProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const InputGroup = ({ style, ...props }: InputGroupProps) => (
  <AriaGroup
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
