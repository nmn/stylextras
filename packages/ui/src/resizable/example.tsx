'use client'

import * as stylex from '@stylexjs/stylex'
import { DemoFrame } from '../example-theme/demo'
import { colors } from '../tokens/color.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { Resizable, ResizableHandle, ResizablePanel } from './index'

export default function Example() {
  return (
    <DemoFrame
      title="Editor split"
      description="Drag the separator or use Arrow keys, Home, and End."
    >
      <Resizable defaultValue={38} sx={styles.root}>
        <ResizablePanel id="editor-navigation" sx={styles.panel}>
          Navigation and files
        </ResizablePanel>
        <ResizableHandle
          label="Resize editor panels"
          aria-controls="editor-navigation editor-preview"
        />
        <ResizablePanel id="editor-preview" sx={styles.panel}>
          Editor preview
        </ResizablePanel>
      </Resizable>
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
  panel: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    color: colors.fgMuted,
  },
})
