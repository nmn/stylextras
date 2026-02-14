import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';
import { Breadcrumbs as AriaBreadcrumbs } from 'react-aria-components';

type BaseProps = ComponentPropsWithoutRef<typeof AriaBreadcrumbs>;

export type BreadcrumbProps = Omit<BaseProps, 'className' | 'style'> & {
  style?: StyleXStyles;
};

export const Breadcrumb = ({ style, ...props }: BreadcrumbProps) => (
  <AriaBreadcrumbs
    {...(props as BaseProps)}
    {...stylex.props(style)}
  />
);
