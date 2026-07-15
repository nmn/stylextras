import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import { typography } from '../tokens/typography.stylex'
import { Typography } from '../typography'

type DemoFrameProps = {
  children: ReactNode
  description?: ReactNode
  showThemes?: boolean
  title: ReactNode
}

type DemoChildrenProps = {
  children: ReactNode
}

export function DemoFrame({ children, description, title }: DemoFrameProps) {
  return (
    <div {...stylex.props(styles.shell)}>
      <div {...stylex.props(styles.header)}>
        <Typography as="h2" scale="title">
          {title}
        </Typography>

        {description ? (
          <Typography as="p" scale="label" tone="muted">
            {description}
          </Typography>
        ) : null}
      </div>

      {children}
    </div>
  )
}

export function DemoRow({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.row)}>{children}</div>
}

export function DemoStack({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.stack)}>{children}</div>
}

export function DemoGrid({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.grid)}>{children}</div>
}

export function DemoPanel({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.panel)}>{children}</div>
}

export function DemoMuted({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.muted)}>{children}</div>
}

export function DemoEyebrow({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.eyebrow)}>{children}</div>
}

const styles = stylex.create({
  shell: {
    padding: spacing.lg,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    gap: spacing.md,
    marginBlock: spacing.lg,
    alignItems: 'stretch',
    backgroundColor: colors.bgSubtle,
    boxSizing: 'border-box',
    boxShadow: elevation.sm,
    color: colors.fg,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  header: {
    gap: spacing.xs,
    display: 'grid',
  },
  row: {
    gap: spacing.sm,
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  stack: {
    gap: spacing.sm,
    display: 'grid',
  },
  grid: {
    gap: spacing.sm,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  },
  panel: {
    padding: spacing.md,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    gap: spacing.sm,
    backgroundColor: colors.card,
    display: 'grid',
  },
  muted: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightBody,
  },
  eyebrow: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus2,
    fontWeight: typography.weightSemibold,
    letterSpacing: typography.trackingWide,
    textTransform: 'uppercase',
  },
})
