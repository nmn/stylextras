'use client'

import * as stylex from '@stylexjs/stylex'
import { blurThemes } from '@stylextras/ui/blur-themes'
import { colorThemes } from '@stylextras/ui/color-themes'
import { elevationThemes } from '@stylextras/ui/elevation-themes'
import { motionThemes } from '@stylextras/ui/motion-themes'
import { radiusThemes } from '@stylextras/ui/radius-themes'
import { spacingThemes } from '@stylextras/ui/spacing-themes'
import { strokeThemes } from '@stylextras/ui/stroke-themes'
import { colors } from '@stylextras/ui/tokens/color.stylex'
import { elevation } from '@stylextras/ui/tokens/elevation.stylex'
import { radius } from '@stylextras/ui/tokens/radius.stylex'
import { spacing } from '@stylextras/ui/tokens/spacing.stylex'
import { stroke } from '@stylextras/ui/tokens/stroke.stylex'
import { typography } from '@stylextras/ui/tokens/typography.stylex'
import { typographyThemes } from '@stylextras/ui/typography-themes'
import { type ReactNode, useEffect, useState } from 'react'
import { PreviewThemeControls } from './PreviewThemeControls'
import {
  type PreviewStyleSelection,
  type PreviewThemeSelection,
  defaultPreviewTheme,
  previewStylePresets,
} from './preview-theme-config'

export function ComponentPreview({
  children,
  name,
}: {
  children: ReactNode
  name: string
}) {
  const [selection, setSelection] = useState<PreviewThemeSelection>(defaultPreviewTheme)
  const [styleName, setStyleName] = useState<PreviewStyleSelection>('vega')
  const [ready, setReady] = useState(false)

  useEffect(() => setReady(true), [])

  const changeSelection = (key: keyof PreviewThemeSelection, value: string) => {
    setSelection((current) => ({ ...current, [key]: value }))
    if (key !== 'appearance' && key !== 'color') setStyleName('custom')
  }

  const changeStyle = (nextStyle: PreviewStyleSelection) => {
    setStyleName(nextStyle)
    if (nextStyle === 'custom') return
    setSelection((current) => ({
      ...current,
      ...previewStylePresets[nextStyle],
    }))
  }

  return (
    <section
      aria-label={`${name} live demo`}
      data-component-demo={name}
      data-preview-appearance={selection.appearance}
      data-preview-color={selection.color}
      data-preview-ready={ready ? 'true' : 'false'}
      data-preview-style={styleName}
      {...stylex.props(
        colorThemes[selection.color],
        spacingThemes[selection.spacing],
        radiusThemes[selection.radius],
        strokeThemes[selection.stroke],
        typographyThemes[selection.typography],
        elevationThemes[selection.elevation],
        blurThemes[selection.blur],
        motionThemes[selection.motion],
        styles.root,
        selection.appearance === 'light' ? styles.light : styles.dark,
      )}
    >
      <header {...stylex.props(styles.header)}>
        <span {...stylex.props(styles.eyebrow)}>Live demo</span>
        <h2 {...stylex.props(styles.title)}>{name}</h2>
      </header>
      <PreviewThemeControls
        onSelectionChange={changeSelection}
        onStyleChange={changeStyle}
        selection={selection}
        styleName={styleName}
      />
      <div data-component-demo-canvas="" {...stylex.props(styles.canvas)}>
        {children}
      </div>
    </section>
  )
}

const styles = stylex.create({
  root: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    boxShadow: elevation.sm,
    color: colors.fg,
    display: 'grid',
    fontFamily: typography.fontSans,
    marginBlock: spacing.lg,
    minWidth: 0,
    overflow: 'clip',
    width: '100%',
  },
  light: {
    colorScheme: 'light',
  },
  dark: {
    colorScheme: 'dark',
  },
  header: {
    backgroundColor: colors.bgSubtle,
    display: 'grid',
    gap: spacing.xxxs,
    padding: spacing.md,
  },
  eyebrow: {
    color: colors.fgMuted,
    fontFamily: typography.fontMono,
    fontSize: typography.stepMinus2,
    fontWeight: typography.weightSemibold,
    letterSpacing: typography.trackingWide,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.fg,
    fontFamily: typography.fontDisplay,
    fontSize: typography.step1,
    fontWeight: typography.weightSemibold,
    lineHeight: typography.lineHeightSnug,
    margin: 0,
  },
  canvas: {
    backgroundColor: colors.bg,
    minWidth: 0,
    overflow: 'clip',
    padding: {
      default: spacing.md,
      '@media (min-width: 640px)': spacing.lg,
    },
  },
})
