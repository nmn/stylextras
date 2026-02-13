import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['DropZone']>;

export type FileDropZoneProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const FileDropZone = ({ style, ...props }: FileDropZoneProps) => (
  <aria.DropZone
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
