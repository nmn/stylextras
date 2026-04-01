import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { DropZone as AriaDropZone } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaDropZone>;

export type FileDropZoneProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const FileDropZone = ({ style, ...props }: FileDropZoneProps) => (
  <AriaDropZone
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
