import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';
import type { AccessibleAriaNameProps } from '../accessibility';
import { Button, type AccessibleButtonPropsWithout } from '../button';
import { colors } from '../tokens/color.stylex';
import { elevation } from '../tokens/elevation.stylex';
import { motion } from '../tokens/motion.stylex';
import { spacing } from '../tokens/spacing.stylex';
import { stroke } from '../tokens/stroke.stylex';

type SxProp = { sx?: StyleXStyles };
type SheetSectionProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'style'
> &
  SxProp;

export type SheetSide = 'start' | 'end';
export type SheetProps = Omit<
  ComponentPropsWithRef<'dialog'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'style'
> &
  AccessibleAriaNameProps &
  SxProp & { side?: SheetSide };
export type SheetTriggerProps = AccessibleButtonPropsWithout<
  'aria-controls' | 'aria-haspopup'
> & { target: string };
export type SheetCloseProps = AccessibleButtonPropsWithout<'aria-controls'> & {
  target: string;
};
export type SheetHeaderProps = SheetSectionProps;
export type SheetBodyProps = SheetSectionProps;
export type SheetFooterProps = SheetSectionProps;

const commandProps = (
  target: string,
  command: 'show-modal' | 'request-close',
) => ({ command, commandfor: target }) as Record<string, string>;

export function Sheet({ ref, side = 'end', sx, ...props }: SheetProps) {
  const closedByProps = { closedby: 'any' } as Record<string, string>;
  return (
    <dialog
      ref={ref}
      {...closedByProps}
      {...props}
      {...stylex.props(styles.sheet, sideStyles[side], sx)}
    />
  );
}

export function SheetTrigger({
  target,
  type = 'button',
  ...props
}: SheetTriggerProps) {
  return (
    <Button
      {...props}
      type={type}
      aria-controls={target}
      aria-haspopup="dialog"
      {...commandProps(target, 'show-modal')}
    />
  );
}

export function SheetClose({
  target,
  type = 'button',
  variant = 'outline',
  ...props
}: SheetCloseProps) {
  return (
    <Button
      {...props}
      type={type}
      aria-controls={target}
      variant={variant}
      {...commandProps(target, 'request-close')}
    />
  );
}

export function SheetHeader({ ref, sx, ...props }: SheetHeaderProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.header, sx)} />;
}

export function SheetBody({ ref, sx, ...props }: SheetBodyProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.body, sx)} />;
}

export function SheetFooter({ ref, sx, ...props }: SheetFooterProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.footer, sx)} />;
}

/* eslint-disable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
const styles = stylex.create({
  sheet: {
    backgroundColor: colors.popover,
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: elevation.lg,
    color: colors.popoverForeground,
    display: { default: 'none', ':open': 'grid' },
    gridTemplateRows: 'auto minmax(0, 1fr) auto',
    height: '100dvh',
    margin: 0,
    maxHeight: '100dvh',
    maxWidth: 'min(28rem, 100vw)',
    opacity: { default: 0, ':open': 1 },
    overflow: 'hidden',
    overflowWrap: 'anywhere',
    padding: 0,
    position: 'fixed',
    top: 0,
    transitionBehavior: 'allow-discrete',
    transitionDuration: {
      default: motion.durationModerate,
      '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
    },
    transitionProperty: 'display, opacity, overlay, transform',
    transitionTimingFunction: motion.easeEmphasized,
    width: 'min(28rem, 100vw)',
    '::backdrop': {
      backgroundColor: colors.overlay,
      opacity: 0,
      transitionBehavior: 'allow-discrete',
      transitionDuration: {
        default: motion.durationModerate,
        '@media (prefers-reduced-motion: reduce)': motion.durationInstant,
      },
      transitionProperty: 'display, opacity, overlay',
    },
    ':open::backdrop': {
      opacity: 1,
    },
  },
  header: {
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: `0 0 ${stroke.thin}`,
    padding: spacing.lg,
  },
  body: {
    minHeight: 0,
    overflow: 'auto',
    overscrollBehaviorY: 'contain',
    padding: spacing.lg,
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
});

const sideStyles = stylex.create({
  start: {
    insetInlineEnd: 'auto',
    insetInlineStart: 0,
    transform: {
      default: 'translateX(-1rem)',
      ':open': 'translateX(0)',
      ':dir(rtl):not(:open)': 'translateX(1rem)',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
  },
  end: {
    insetInlineEnd: 0,
    insetInlineStart: 'auto',
    transform: {
      default: 'translateX(1rem)',
      ':open': 'translateX(0)',
      ':dir(rtl):not(:open)': 'translateX(-1rem)',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
  },
});
/* eslint-enable @stylexjs/no-legacy-contextual-styles, @stylexjs/valid-styles */
