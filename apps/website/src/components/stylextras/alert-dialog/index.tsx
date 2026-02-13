import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Dialog']>;

export type AlertDialogProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const AlertDialog = ({ style, ...props }: AlertDialogProps) => (
  <aria.Dialog
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
