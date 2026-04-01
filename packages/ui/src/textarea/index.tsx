import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { TextArea as AriaTextArea } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaTextArea>;

export type TextAreaProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const TextArea = ({ style, ...props }: TextAreaProps) => (
  <AriaTextArea
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
