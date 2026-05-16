import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import * as React from 'react'
import type { ComponentPropsWithRef } from 'react'
import { Button, type ButtonProps } from '../button'
import { type LazyComponentLoader, type ReactComponent, useLazyComponent } from '../lazy-component'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type BaseProps = ComponentPropsWithRef<'dialog'>

export type DialogSize = 'sm' | 'md' | 'lg'

export type DialogProps = Omit<BaseProps, 'className' | 'style'> & {
  sx?: StyleXStyles
  size?: DialogSize
}

export type DialogContentProps = DialogProps

export type DialogTriggerProps = Omit<ButtonProps, 'className' | 'content' | 'style'> & {
  content: LazyComponentLoader<DialogContentProps>
  contentProps?: Omit<DialogContentProps, 'ref'>
  fallback?: React.ReactNode
}

export type DialogComponent = ReactComponent<DialogContentProps>

export type DialogProgrammaticProps<
  Props extends ComponentPropsWithRef<'dialog'> = DialogContentProps,
> = {
  content: LazyComponentLoader<Props>
  contentProps?: Omit<Props, 'open' | 'ref'>
  defaultOpen?: boolean
  fallback?: React.ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

/**
 * Renders a modal or non-modal surface using the native dialog element.
 *
 * Search aliases: dialog, modal, modal dialog, popup dialog.
 *
 * A11y notes:
 * - Relies on native <dialog> behavior for focus and modality.
 * - Does not add custom focus restoration, layered dismissal, or inert polyfills.
 */
export function DialogContent({ ref, size = 'md', sx, ...props }: DialogContentProps) {
  return <dialog ref={ref} {...props} {...stylex.props(baseStyles.base, sizeStyles[size], sx)} />
}

export function DialogTrigger({
  children,
  content,
  contentProps,
  fallback = null,
  onClick,
  onFocus,
  onPointerEnter,
  type = 'button',
  ...props
}: DialogTriggerProps) {
  const [mounted, setMounted] = React.useState(false)
  const dialogRef = React.useRef<HTMLDialogElement | null>(null)
  const shouldOpenRef = React.useRef(false)
  const { LazyContent, preload } = useLazyComponent(content)

  const openDialog = React.useCallback(() => {
    shouldOpenRef.current = true
    setMounted(true)

    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      dialog.showModal()
      shouldOpenRef.current = false
    }
  }, [])

  const setDialogRef = React.useCallback((node: HTMLDialogElement | null) => {
    dialogRef.current = node

    if (node && shouldOpenRef.current && !node.open) {
      node.showModal()
      shouldOpenRef.current = false
    }

    return () => {
      if (dialogRef.current === node) {
        dialogRef.current = null
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
            openDialog()
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
          <LazyContent {...contentProps} ref={setDialogRef} />
        </React.Suspense>
      ) : null}
    </>
  )
}

export function DialogProgrammatic<
  Props extends ComponentPropsWithRef<'dialog'> = DialogContentProps,
>({
  content,
  contentProps,
  defaultOpen = false,
  fallback = null,
  onOpenChange,
  open,
}: DialogProgrammaticProps<Props>) {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isOpen = open ?? internalOpen
  const dialogRef = React.useRef<HTMLDialogElement | null>(null)
  const { LazyContent } = useLazyComponent(content)

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  const setDialogRef = React.useCallback((node: HTMLDialogElement | null) => {
    dialogRef.current = node

    if (node && !node.open) {
      node.showModal()
    }

    return () => {
      if (dialogRef.current === node) {
        dialogRef.current = null
      }
    }
  }, [])

  if (!isOpen) {
    return null
  }

  return (
    <React.Suspense fallback={fallback}>
      {React.createElement(LazyContent as React.ComponentType<Record<string, unknown>>, {
        ...(contentProps as Record<string, unknown>),
        onClose: (event: React.SyntheticEvent<HTMLDialogElement>) => {
          contentProps?.onClose?.(event)
          setOpen(false)
        },
        ref: setDialogRef,
      })}
    </React.Suspense>
  )
}

export const Dialog = DialogContent

const baseStyles = stylex.create({
  base: {
    margin: 'auto',
    padding: spacing.lg,
    borderStyle: 'solid',
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    boxShadow: elevation.lg,
  },
})

const sizeStyles = stylex.create({
  sm: {
    width: 'min(360px, calc(100vw - 32px))',
  },
  md: {
    width: 'min(480px, calc(100vw - 32px))',
  },
  lg: {
    width: 'min(640px, calc(100vw - 32px))',
  },
})
