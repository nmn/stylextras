import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithRef, ElementType } from 'react';
import { colors } from '../tokens/color.stylex';
import { elevation } from '../tokens/elevation.stylex';
import { radius } from '../tokens/radius.stylex';
import { spacing } from '../tokens/spacing.stylex';
import { stroke } from '../tokens/stroke.stylex';
import { typography } from '../tokens/typography.stylex';

type SxProp = { sx?: StyleXStyles };
type DivProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'style'
> &
  SxProp;

export type CardProps<T extends ElementType = 'div'> = Omit<
  ComponentPropsWithRef<T>,
  'className' | 'style'
> &
  SxProp & { as?: T };
export type CardHeaderProps = DivProps;
export type CardContentProps = DivProps;
export type CardFooterProps = DivProps;
export type CardActionProps = DivProps;
export type CardTitleProps<T extends ElementType = 'h3'> = Omit<
  ComponentPropsWithRef<T>,
  'className' | 'style'
> &
  SxProp & { as?: T };
export type CardDescriptionProps = Omit<
  ComponentPropsWithRef<'p'>,
  'className' | 'style'
> &
  SxProp;

export function Card<T extends ElementType = 'div'>({ as, sx, ...props }: CardProps<T>) {
  const Component = as ?? 'div';
  return <Component {...props} {...stylex.props(styles.card, sx)} />;
}

export function CardHeader({ ref, sx, ...props }: CardHeaderProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.header, sx)} />;
}

export function CardTitle<T extends ElementType = 'h3'>({ as, sx, ...props }: CardTitleProps<T>) {
  const Component = as ?? 'h3';
  return <Component {...props} {...stylex.props(styles.title, sx)} />;
}

export function CardDescription({ ref, sx, ...props }: CardDescriptionProps) {
  return <p ref={ref} {...props} {...stylex.props(styles.description, sx)} />;
}

export function CardAction({ ref, sx, ...props }: CardActionProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.action, sx)} />;
}

export function CardContent({ ref, sx, ...props }: CardContentProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.content, sx)} />;
}

export function CardFooter({ ref, sx, ...props }: CardFooterProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.footer, sx)} />;
}

const styles = stylex.create({
  card: {
    backgroundColor: colors.card,
    borderColor: {
      default: colors.border,
      '@media (forced-colors: active)': 'CanvasText',
    },
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: elevation.xs,
    color: colors.cardForeground,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
    minWidth: 0,
    overflowWrap: 'anywhere',
    paddingBlock: spacing.lg,
  },
  header: {
    alignItems: 'start',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    minWidth: 0,
    paddingInline: spacing.lg,
    position: 'relative',
  },
  title: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.step1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightTight,
    margin: 0,
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  description: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    margin: 0,
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  action: {
    insetInlineEnd: spacing.lg,
    maxWidth: '100%',
    position: 'absolute',
    top: 0,
  },
  content: {
    minWidth: 0,
    overflowWrap: 'anywhere',
    paddingInline: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingInline: spacing.lg,
  },
});
