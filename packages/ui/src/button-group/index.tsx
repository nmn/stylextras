'use client';

import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';
import type { AccessibleAriaNameProps } from '../accessibility';
import { focusgroupAttributes, focusgroupRef } from '../focusgroup';
import { colors } from '../tokens/color.stylex';
import { radius } from '../tokens/radius.stylex';
import { spacing } from '../tokens/spacing.stylex';
import { stroke } from '../tokens/stroke.stylex';

export type ButtonGroupProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'role' | 'style'
> & {
  orientation?: 'horizontal' | 'vertical';
  sx?: StyleXStyles;
  variant?: 'toolbar' | 'actions';
} & AccessibleAriaNameProps;

export function ButtonGroup({
  orientation = 'horizontal',
  ref,
  sx,
  variant = 'toolbar',
  ...props
}: ButtonGroupProps) {
  const isToolbar = variant === 'toolbar';
  const setRef = isToolbar ? focusgroupRef(ref) : ref;
  return (
    <div
      ref={setRef}
      {...props}
      role={isToolbar ? 'toolbar' : 'group'}
      aria-orientation={isToolbar ? orientation : undefined}
      {...(isToolbar
        ? focusgroupAttributes(
            orientation === 'vertical' ? 'toolbar block' : 'toolbar inline',
          )
        : {})}
      {...stylex.props(
        styles.group,
        variant === 'actions' && styles.actions,
        orientation === 'vertical' && styles.vertical,
        variant === 'actions' &&
          orientation === 'vertical' &&
          styles.actionsVertical,
        sx,
      )}
    />
  );
}

const styles = stylex.create({
  group: {
    alignItems: 'center',
    backgroundColor: colors.bgSubtle,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: spacing.xxxs,
    maxWidth: '100%',
    padding: spacing.xxxs,
  },
  vertical: {
    alignItems: 'stretch',
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  actions: {
    padding: 0,
    borderWidth: 0,
    gap: spacing.sm,
    backgroundColor: 'transparent',
    display: 'inline-grid',
    gridAutoColumns: '1fr',
    gridAutoFlow: 'column',
    justifySelf: 'end',
    maxWidth: '100%',
    width: 'fit-content',
  },
  actionsVertical: {
    gridAutoFlow: 'row',
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
});
