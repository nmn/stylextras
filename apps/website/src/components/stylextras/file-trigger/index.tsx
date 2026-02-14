import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { FileTrigger as AriaFileTrigger } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaFileTrigger>;

export type FileTriggerProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const FileTrigger = ({ style, ...props }: FileTriggerProps) => (
  <AriaFileTrigger
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
