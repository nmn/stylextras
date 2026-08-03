'use client'

import { useEffect, useState } from 'react'
import {
  type PreviewStyleSelection,
  type PreviewThemeSelection,
  defaultPreviewTheme,
  previewThemeSelection,
} from './preview-theme-config'

export function usePreviewTheme() {
  const [selection, setSelection] = useState<PreviewThemeSelection>(defaultPreviewTheme)
  const [styleName, setStyleName] = useState<PreviewStyleSelection>('docs')
  const [ready, setReady] = useState(false)

  useEffect(() => setReady(true), [])

  const changeSelection = (key: keyof PreviewThemeSelection, value: string) => {
    setSelection((current) => ({ ...current, [key]: value }))
    if (key !== 'appearance') setStyleName('custom')
  }

  const changeStyle = (nextStyle: PreviewStyleSelection) => {
    setStyleName(nextStyle)
    if (nextStyle === 'custom') return
    setSelection((current) => previewThemeSelection(nextStyle, current.appearance))
  }

  return { changeSelection, changeStyle, ready, selection, styleName }
}
