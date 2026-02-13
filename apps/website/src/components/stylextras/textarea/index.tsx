import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['TextArea']>;

export type TextAreaProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const TextArea = ({ style, ...props }: TextAreaProps) => (
  <aria.TextArea
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
