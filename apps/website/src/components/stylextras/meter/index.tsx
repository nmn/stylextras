import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Meter']>;

export type MeterProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Meter = ({ style, ...props }: MeterProps) => (
  <aria.Meter
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
