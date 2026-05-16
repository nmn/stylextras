import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import * as React from 'react'
import type { ComponentPropsWithRef } from 'react'
import { Button, type ButtonProps } from '../button'
import { DialogProgrammatic, type DialogProgrammaticProps } from '../dialog'
import { type LazyComponentLoader, type ReactComponent, useLazyComponent } from '../lazy-component'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type BaseProps = ComponentPropsWithRef<'dialog'>

export type DrawerSide = 'left' | 'right'

export type DrawerProps = Omit<BaseProps, 'className' | 'style'> & {
  sx?: StyleXStyles
  side?: DrawerSide
}

export type DrawerContentProps = DrawerProps

export type DrawerTriggerProps = Omit<ButtonProps, 'className' | 'content' | 'style'> & {
  content: LazyComponentLoader<DrawerContentProps>
  contentProps?: Omit<DrawerContentProps, 'ref'>
  fallback?: React.ReactNode
}

export type DrawerComponent = ReactComponent<DrawerContentProps>

export type DrawerProgrammaticProps = DialogProgrammaticProps<DrawerContentProps>

/**
 * Renders a side-aligned panel using the native dialog element.
 *
 * Search aliases: drawer, sheet, side panel, offcanvas.
 *
 * A11y notes:
 * - Relies on native <dialog> behavior.
 * - Does not provide swipe gestures, stacked drawers, or custom focus restoration.
 */
export function DrawerContent({ ref, side = 'right', sx, ...props }: DrawerContentProps) {
  return <dialog ref={ref} {...props} {...stylex.props(baseStyles.base, sideStyles[side], sx)} />
}

export function DrawerTrigger({
  children,
  content,
  contentProps,
  fallback = null,
  onClick,
  onFocus,
  onPointerEnter,
  type = 'button',
  ...props
}: DrawerTriggerProps) {
  const [mounted, setMounted] = React.useState(false)
  const drawerRef = React.useRef<HTMLDialogElement | null>(null)
  const shouldOpenRef = React.useRef(false)
  const { LazyContent, preload } = useLazyComponent(content)

  const openDrawer = React.useCallback(() => {
    shouldOpenRef.current = true
    setMounted(true)

    const drawer = drawerRef.current
    if (drawer && !drawer.open) {
      drawer.showModal()
      shouldOpenRef.current = false
    }
  }, [])

  const setDrawerRef = React.useCallback((node: HTMLDialogElement | null) => {
    drawerRef.current = node

    if (node && shouldOpenRef.current && !node.open) {
      node.showModal()
      shouldOpenRef.current = false
    }

    return () => {
      if (drawerRef.current === node) {
        drawerRef.current = null
      }
    }
  }, [])

  return (
    <>
      <Button
        {...props}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) {
            openDrawer()
          }
        }}
        onFocus={(event) => {
          onFocus?.(event)
          void preload()
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event)
          void preload()
        }}
        type={type}
      >
        {children}
      </Button>
      {mounted ? (
        <React.Suspense fallback={fallback}>
          <LazyContent {...contentProps} ref={setDrawerRef} />
        </React.Suspense>
      ) : null}
    </>
  )
}

export function DrawerProgrammatic(props: DrawerProgrammaticProps) {
  return <DialogProgrammatic<DrawerContentProps> {...props} />
}

export const Drawer = DrawerContent

const baseStyles = stylex.create({
  base: {
    margin: 0,
    padding: spacing.lg,
    minHeight: '100vh',
    borderStyle: 'solid',
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    boxShadow: elevation.lg,
    position: 'fixed',
    top: 0,
    width: 'min(420px, 100vw)',
  },
})
const sideStyles = stylex.create({
  left: {
    left: 0,
    borderRightStyle: 'solid',
    borderRightWidth: stroke.thin,
    borderRightColor: colors.border,
  },
  right: {
    right: 0,
    borderLeftStyle: 'solid',
    borderLeftWidth: stroke.thin,
    borderLeftColor: colors.border,
  },
})
