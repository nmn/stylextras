import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Disclosure']>;

export type DisclosureProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Disclosure = ({ style, ...props }: DisclosureProps) => (
  <aria.Disclosure
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
