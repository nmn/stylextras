import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';
import { colors } from '../tokens/color.stylex';
import { elevation } from '../tokens/elevation.stylex';
import { radius } from '../tokens/radius.stylex';
import { spacing } from '../tokens/spacing.stylex';
import { stroke } from '../tokens/stroke.stylex';
import { typography } from '../tokens/typography.stylex';

type SxProp = { sx?: StyleXStyles };

export type CardProps = Omit<
  ComponentPropsWithRef<'div'>,
  'className' | 'style'
> &
  SxProp;
export type CardHeaderProps = CardProps;
export type CardContentProps = CardProps;
export type CardFooterProps = CardProps;
export type CardActionProps = CardProps;
export type CardTitleProps = Omit<
  ComponentPropsWithRef<'h3'>,
  'className' | 'style'
> &
  SxProp;
export type CardDescriptionProps = Omit<
  ComponentPropsWithRef<'p'>,
  'className' | 'style'
> &
  SxProp;

export function Card({ ref, sx, ...props }: CardProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.card, sx)} />;
}

export function CardHeader({ ref, sx, ...props }: CardHeaderProps) {
  return <div ref={ref} {...props} {...stylex.props(styles.header, sx)} />;
}

export function CardTitle({ ref, sx, ...props }: CardTitleProps) {
  return <h3 ref={ref} {...props} {...stylex.props(styles.title, sx)} />;
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
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: elevation.xs,
    color: colors.cardForeground,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
    paddingBlock: spacing.lg,
  },
  header: {
    alignItems: 'start',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    paddingInline: spacing.lg,
    position: 'relative',
  },
  title: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.step1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightTight,
    margin: 0,
  },
  description: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    margin: 0,
  },
  action: {
    top: 0,
    insetInlineEnd: spacing.lg,
    position: 'absolute',
  },
  content: {
    paddingInline: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing.sm,
    paddingInline: spacing.lg,
  },
});
