import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Disclosure as AriaDisclosure } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaDisclosure>;

export type DisclosureProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Disclosure = ({ style, ...props }: DisclosureProps) => (
  <AriaDisclosure
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
