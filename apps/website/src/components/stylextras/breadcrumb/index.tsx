import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import * as aria from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<(typeof aria)['Breadcrumbs']>;

export type BreadcrumbProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Breadcrumb = ({ style, ...props }: BreadcrumbProps) => (
  <aria.Breadcrumbs
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
