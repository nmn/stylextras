'use client';

import * as stylex from '@stylexjs/stylex';
import { colors } from '@stylextras/ui/tokens/color.stylex';
import { elevation } from '@stylextras/ui/tokens/elevation.stylex';
import { radius } from '@stylextras/ui/tokens/radius.stylex';
import { spacing } from '@stylextras/ui/tokens/spacing.stylex';
import { stroke } from '@stylextras/ui/tokens/stroke.stylex';
import { typography } from '@stylextras/ui/tokens/typography.stylex';
import type { ReactNode } from 'react';
import { ScrollableCodeBlock } from '../mdx/ScrollableCodeBlock';

export function ComponentPreview({
  children,
  code,
  highlightedCode,
  name,
}: {
  children: ReactNode;
  code?: string;
  highlightedCode?: ReactNode;
  name: string;
}) {
  return (
    <>
      <section aria-label={`${name} live demo`} {...stylex.props(styles.root)}>
        <header {...stylex.props(styles.header)}>
          <span {...stylex.props(styles.eyebrow)}>Live demo</span>
          <h2 {...stylex.props(styles.title)}>{name}</h2>
        </header>
        <div {...stylex.props(styles.canvas)}>
          {children}
        </div>
      </section>
      {code ? (
        <ScrollableCodeBlock
          content={code}
          highlightedContent={highlightedCode}
          maxHeight={520}
          title={`${name} example.tsx`}
        />
      ) : null}
    </>
  );
}

const styles = stylex.create({
  root: {
    display: 'grid',
    width: '100%',
    minWidth: 0,
    marginBlock: spacing.lg,
    overflow: 'clip',
    fontFamily: typography.fontSans,
    color: colors.fg,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderRadius: radius.lg,
    boxShadow: elevation.sm,
  },
  header: {
    display: 'grid',
    gap: spacing.xxxs,
    padding: spacing.md,
    backgroundColor: colors.bgSubtle,
  },
  eyebrow: {
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    fontWeight: typography.weightSemibold,
    color: colors.fgMuted,
    textTransform: 'uppercase',
    letterSpacing: typography.trackingWide,
  },
  title: {
    margin: 0,
    fontFamily: typography.fontDisplay,
    fontSize: typography.step1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightSnug,
    color: colors.fg,
  },
  canvas: {
    minWidth: 0,
    padding: {
      default: spacing.md,
      '@media (min-width: 640px)': spacing.lg,
    },
    overflow: 'clip',
    backgroundColor: colors.bg,
  },
});
