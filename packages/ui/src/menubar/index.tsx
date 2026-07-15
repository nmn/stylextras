'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import { focusgroupRef } from '../focusgroup'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

export type MenubarProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'role' | 'style'> & {
  sx?: StyleXStyles
}

/** A focusgroup-enhanced menubar. Menus remain explicit DropdownMenu siblings. */
export function Menubar({ onPointerMove, ref, sx, ...props }: MenubarProps) {
  const setRef = focusgroupRef(ref)
  const focusgroup = { focusgroup: 'menubar' } as Record<string, string>
  return (
    <div
      ref={setRef}
      role="menubar"
      {...focusgroup}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (event.defaultPrevented || event.pointerType === 'touch') return
        const trigger = (event.target as Element).closest<HTMLButtonElement>(
          'button[aria-haspopup="menu"][popovertarget]',
        )
        if (!trigger || !event.currentTarget.contains(trigger)) return
        const openMenu = event.currentTarget.querySelector<HTMLElement>('[popover]:popover-open')
        if (!openMenu || trigger.popoverTargetElement === openMenu) return
        trigger.click()
      }}
      {...props}
      {...stylex.props(styles.base, sx)}
    />
  )
}

const styles = stylex.create({
  base: {
    alignItems: 'center',
    backgroundColor: colors.bgSubtle,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xxs,
    maxWidth: '100%',
    padding: spacing.xxs,
    width: 'fit-content',
  },
})
