'use client'

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentPropsWithRef } from 'react'
import type { AccessibleAriaNameProps } from '../accessibility'
import { focusgroupAttributes, focusgroupRef } from '../focusgroup'
import { colors } from '../tokens/color.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

export type MenubarProps = Omit<
  ComponentPropsWithRef<'div'>,
  'aria-label' | 'aria-labelledby' | 'className' | 'role' | 'style'
> &
  AccessibleAriaNameProps & { sx?: StyleXStyles }

/** A focusgroup-enhanced menubar. Menus remain explicit DropdownMenu siblings. */
export function Menubar({ onPointerMove, ref, sx, ...props }: MenubarProps) {
  const setRef = focusgroupRef(ref)
  return (
    <div
      ref={setRef}
      {...props}
      role="menubar"
      aria-orientation="horizontal"
      {...focusgroupAttributes('menubar inline wrap')}
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
    overflowX: 'auto',
    overscrollBehaviorX: 'contain',
    padding: spacing.xxs,
    width: 'fit-content',
  },
})
