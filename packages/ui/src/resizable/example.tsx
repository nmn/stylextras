'use client'

import * as stylex from '@stylexjs/stylex'
import { DemoFrame, DemoStack } from '../example-theme/demo'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { Resizable, ResizableHandle, ResizablePanel } from './index'

export default function Example() {
  return (
    <DemoFrame
      title="Editor split"
      description="Drag a separator or use Arrow keys, Shift+Arrow, Home, and End."
    >
      <DemoStack>
        <Resizable data-testid="horizontal-resizable" defaultValue={38} sx={styles.root}>
          <ResizablePanel id="editor-navigation" sx={styles.panel}>
            Navigation and files
          </ResizablePanel>
          <ResizableHandle
            aria-label="Resize editor panels"
            aria-controls="editor-navigation editor-preview"
            getValueText={(value) => `Navigation panel ${value}%`}
          />
          <ResizablePanel id="editor-preview" sx={styles.panel}>
            Editor preview
          </ResizablePanel>
        </Resizable>

        <Resizable
          data-testid="rtl-resizable"
          dir="rtl"
          defaultValue={Number.NaN}
          min={80}
          max={20}
          sx={styles.root}
        >
          <ResizablePanel id="rtl-navigation" sx={styles.panel}>
            RTL navigation
          </ResizablePanel>
          <ResizableHandle
            aria-label="Resize RTL panels"
            aria-controls="rtl-navigation rtl-preview"
          />
          <ResizablePanel id="rtl-preview" sx={styles.panel}>
            RTL preview
          </ResizablePanel>
        </Resizable>

        <Resizable
          data-testid="vertical-resizable"
          defaultValue={Number.NaN}
          direction="vertical"
          min={Number.NEGATIVE_INFINITY}
          max={Number.POSITIVE_INFINITY}
          sx={[styles.root, styles.verticalRoot]}
        >
          <ResizablePanel id="stacked-editor" sx={styles.panel}>
            Stacked editor
          </ResizablePanel>
          <ResizableHandle
            aria-label="Resize stacked panels"
            aria-controls="stacked-editor stacked-preview"
            getValueText={(value) => `Top panel ${value} percent`}
          />
          <ResizablePanel id="stacked-preview" sx={styles.panel}>
            Stacked preview
          </ResizablePanel>
        </Resizable>
      </DemoStack>
    </DemoFrame>
  )
}

const styles = stylex.create({
  root: {
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: 1,
    height: '13rem',
    width: '100%',
  },
  verticalRoot: {
    height: '20rem',
  },
  panel: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    color: colors.fgMuted,
  },
})
