/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as stylex from '@stylexjs/stylex';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  type AlertVariant,
} from '@stylextras/ui/alert';
import { Info, TriangleAlert, CircleX, CircleCheck } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { calloutMarker } from './mdx.stylex';
import { vars } from '@/theming/vars.stylex';
import { spacing } from '@stylextras/ui/tokens/spacing.stylex';

const DEFAULT_ICONS = {
  info: Info,
  warning: TriangleAlert,
  error: CircleX,
  success: CircleCheck,
} as const;

export type CalloutType =
  'info' | 'warn' | 'warning' | 'error' | 'success' | 'danger' | 'tip';

function resolveType(
  type: CalloutType,
): 'info' | 'warning' | 'error' | 'success' {
  if (type === 'warn' || type === 'danger') return 'warning';
  if (type === 'tip') return 'info';
  return type;
}

export interface CalloutProps extends CalloutContainerProps {
  children: ReactNode;
}

export function Callout({ children, title, ...props }: CalloutProps) {
  return (
    <CalloutContainer title={title} {...props}>
      {title && <AlertTitle as="p">{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </CalloutContainer>
  );
}

export interface CalloutContainerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'title'
> {
  /**
   * @defaultValue info
   */
  type?: CalloutType;
  /**
   * Force an icon
   */
  icon?: ReactNode;
  title?: ReactNode;
  children: ReactNode;
}

export function CalloutContainer({
  type: inputType = 'info',
  icon,
  children,
  title,
  ...props
}: CalloutContainerProps) {
  const type = resolveType(inputType);
  const variant: AlertVariant = type === 'error' ? 'danger' : type;
  const DefaultIcon = DEFAULT_ICONS[type];

  return (
    <Alert
      role="note"
      variant={variant}
      sx={[styles.container, calloutMarker]}
      {...props}
    >
      <div
        role="none"
        {...stylex.props(indicatorStyles.base, indicatorStyles[type])}
      />
      {icon ?? (
        <DefaultIcon
          {...stylex.props(
            iconStyles.base,
            title !== undefined && iconStyles.withTitle,
            iconStyles[type],
          )}
        />
      )}
      <div {...stylex.props(styles.content)}>{children}</div>
    </Alert>
  );
}

const iconStyles = stylex.create({
  base: {
    flexShrink: 0,
    width: 20,
    height: 'calc(16px * 1.65)',
    marginInlineEnd: -2,
    color: vars['--color-fd-card'],
    fill: vars['--color-fd-card'],
  },
  withTitle: {
    height: 'calc(14px * 1.5)',
  },
  info: { fill: vars['--color-fd-info'] },
  warning: { fill: vars['--color-fd-warning'] },
  error: { fill: vars['--color-fd-error'] },
  success: { fill: vars['--color-fd-success'] },
});

const indicatorStyles = stylex.create({
  base: {
    flexShrink: 0,
    width: 2,
    backgroundColor: 'color-mix(in srgb, currentColor 50%, transparent)',
    borderRadius: 2,
  },
  info: { color: vars['--color-fd-info'] },
  warning: { color: vars['--color-fd-warning'] },
  error: { color: vars['--color-fd-error'] },
  success: { color: vars['--color-fd-success'] },
});

const styles = stylex.create({
  container: {
    display: 'flex',
    paddingInlineStart: spacing.xxs,
    marginBlock: 16,
  },

  content: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    rowGap: 8,
    columnGap: 8,
    minWidth: 0,
  },
});
