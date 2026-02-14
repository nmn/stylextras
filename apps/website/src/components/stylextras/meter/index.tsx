import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Meter as AriaMeter } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaMeter>;

export type MeterProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Meter = ({ style, ...props }: MeterProps) => (
  <AriaMeter
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
