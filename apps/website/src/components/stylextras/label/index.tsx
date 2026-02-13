import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Label']>;

export type LabelProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Label = ({ style, ...props }: LabelProps) => (
  <aria.Label
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
