import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import * as React from 'react'
import type { ComponentPropsWithRef } from 'react'
import { Button, type ButtonProps } from '../button'
import { DialogProgrammatic, type DialogProgrammaticProps } from '../dialog'
import { type LazyComponentLoader, type ReactComponent, useLazyComponent } from '../lazy-component'
import { colors } from '../tokens/color.stylex'
import { elevation } from '../tokens/elevation.stylex'
import { radius } from '../tokens/radius.stylex'
import { spacing } from '../tokens/spacing.stylex'
import { stroke } from '../tokens/stroke.stylex'

type BaseProps = ComponentPropsWithRef<'dialog'>

export type AlertDialogProps = Omit<BaseProps, 'className' | 'style'> & {
  sx?: StyleXStyles
}

export type AlertDialogContentProps = AlertDialogProps

export type AlertDialogTriggerProps = Omit<ButtonProps, 'className' | 'content' | 'style'> & {
  content: LazyComponentLoader<AlertDialogContentProps>
  contentProps?: Omit<AlertDialogContentProps, 'ref'>
  fallback?: React.ReactNode
}

export type AlertDialogComponent = ReactComponent<AlertDialogContentProps>

export type AlertDialogProgrammaticProps = DialogProgrammaticProps<AlertDialogContentProps>

/**
 * Renders an alert-focused modal surface using the native dialog element.
 *
 * Search aliases: alert dialog, confirm dialog, destructive dialog, modal alert.
 *
 * A11y notes:
 * - Relies on native <dialog> behavior for focus and modality.
 * - Does not add a custom focus trap, trigger restore, or stacked dialog management layer.
 */
export function AlertDialogContent({ ref, sx, ...props }: AlertDialogContentProps) {
  return <dialog ref={ref} role="alertdialog" {...props} {...stylex.props(styles.base, sx)} />
}

export function AlertDialogTrigger({
  children,
  content,
  contentProps,
  fallback = null,
  onClick,
  onFocus,
  onPointerEnter,
  type = 'button',
  ...props
}: AlertDialogTriggerProps) {
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

export function AlertDialogProgrammatic(props: AlertDialogProgrammaticProps) {
  return <DialogProgrammatic<AlertDialogContentProps> {...props} />
}

export const AlertDialog = AlertDialogContent

const styles = stylex.create({
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
