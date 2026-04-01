import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Dialog as AriaDialog } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaDialog>;

export type DialogProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Dialog = ({ style, ...props }: DialogProps) => (
  <AriaDialog
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
