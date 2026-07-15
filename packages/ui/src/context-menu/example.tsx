import * as stylex from '@stylexjs/stylex'
import { DemoFrame } from '../example-theme/demo'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from './index'

const menuId = 'canvas-context-menu'

export default function Example() {
  return (
    <DemoFrame title="Context menu" description="Right-click or long-press the target region.">
      <ContextMenuTrigger target={menuId} sx={styles.target}>
        Open the context menu anywhere in this area
      </ContextMenuTrigger>
      <ContextMenu id={menuId}>
        <ContextMenuLabel>Canvas</ContextMenuLabel>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenu>
    </DemoFrame>
  )
}

const styles = stylex.create({
  target: {
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'dashed',
    borderWidth: stroke.thin,
    padding: spacing.xxl,
  },
})
'use client'
