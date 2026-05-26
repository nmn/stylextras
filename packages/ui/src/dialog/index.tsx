import { Suspense, createElement, useRef, useState } from "react";
import type { ComponentType, ReactNode, SyntheticEvent } from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { Button, type ButtonProps } from "../button";
import {
  type LazyComponentLoader,
  type ReactComponent,
  useLazyComponent,
} from "../lazy-component";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
type BaseProps = ComponentPropsWithRef<"dialog">;
export type DialogSize = "sm" | "md" | "lg";
export type DrawerSide = "left" | "right";
export type DialogProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  size?: DialogSize;
};
export type DialogContentProps = DialogProps;
export type DrawerContentProps = Omit<BaseProps, "className" | "style"> & {
  side?: DrawerSide;
  sx?: StyleXStyles;
};
export type DialogTriggerProps<
  Props extends ComponentPropsWithRef<"dialog"> = DialogContentProps,
> = Omit<ButtonProps, "className" | "content" | "style"> & {
  content: LazyComponentLoader<Props>;
  contentProps?: Omit<Props, "ref">;
  fallback?: ReactNode;
};
export type DialogComponent = ReactComponent<DialogContentProps>;
export type DrawerComponent = ReactComponent<DrawerContentProps>;
export type DialogProgrammaticProps<
  Props extends ComponentPropsWithRef<"dialog"> = DialogContentProps,
> = {
  content: LazyComponentLoader<Props>;
  contentProps?: Omit<Props, "open" | "ref">;
  defaultOpen?: boolean;
  fallback?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};
/**
 * Renders a modal or non-modal surface using the native dialog element.
 *
 * Search aliases: dialog, modal, modal dialog, popup dialog.
 *
 * A11y notes:
 * - Relies on native <dialog> behavior for focus and modality.
 * - Does not add custom focus restoration, layered dismissal, or inert polyfills.
 */
export function DialogContent({
  ref,
  size = "md",
  sx,
  ...props
}: DialogContentProps) {
  return (
    <dialog
      ref={ref}
      {...props}
      {...stylex.props(baseStyles.base, sizeStyles[size], sx)}
    />
  );
}
export function DrawerContent({
  ref,
  side = "right",
  sx,
  ...props
}: DrawerContentProps) {
  return (
    <dialog
      ref={ref}
      {...props}
      {...stylex.props(drawerStyles.base, drawerSideStyles[side], sx)}
    />
  );
}
export function DialogTrigger<
  Props extends ComponentPropsWithRef<"dialog"> = DialogContentProps,
>({
  children,
  content,
  contentProps,
  fallback = null,
  onClick,
  onFocus,
  onPointerEnter,
  type = "button",
  ...props
}: DialogTriggerProps<Props>) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const shouldOpenRef = useRef(false);
  const { LazyContent, preload } = useLazyComponent(content);
  function openDialog() {
    shouldOpenRef.current = true;
    setMounted(true);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
      shouldOpenRef.current = false;
    }
  }
  function setDialogRef(node: HTMLDialogElement | null) {
    dialogRef.current = node;
    if (node && shouldOpenRef.current && !node.open) {
      node.showModal();
      shouldOpenRef.current = false;
    }
    return () => {
      if (dialogRef.current === node) {
        dialogRef.current = null;
      }
    };
  }
  return (
    <>
      <Button
        {...props}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            openDialog();
          }
        }}
        onFocus={(event) => {
          onFocus?.(event);
          void preload();
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          void preload();
        }}
        type={type}
      >
        {children}
      </Button>
      {mounted ? (
        <Suspense fallback={fallback}>
          {createElement(
            LazyContent as ComponentType<Record<string, unknown>>,
            {
              ...(contentProps as Record<string, unknown>),
              ref: setDialogRef,
            },
          )}
        </Suspense>
      ) : null}
    </>
  );
}
export function DialogProgrammatic<
  Props extends ComponentPropsWithRef<"dialog"> = DialogContentProps,
>({
  content,
  contentProps,
  defaultOpen = false,
  fallback = null,
  onOpenChange,
  open,
}: DialogProgrammaticProps<Props>) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const { LazyContent } = useLazyComponent(content);
  function setOpen(nextOpen: boolean) {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  }
  function setDialogRef(node: HTMLDialogElement | null) {
    dialogRef.current = node;
    if (node && !node.open) {
      node.showModal();
    }
    return () => {
      if (dialogRef.current === node) {
        dialogRef.current = null;
      }
    };
  }
  if (!isOpen) {
    return null;
  }
  return (
    <Suspense fallback={fallback}>
      {createElement(LazyContent as ComponentType<Record<string, unknown>>, {
        ...(contentProps as Record<string, unknown>),
        onClose: (event: SyntheticEvent<HTMLDialogElement>) => {
          contentProps?.onClose?.(event);
          setOpen(false);
        },
        ref: setDialogRef,
      })}
    </Suspense>
  );
}
export const Dialog = DialogContent;
export const Drawer = DrawerContent;
const baseStyles = stylex.create({
  base: {
    margin: "auto",
    padding: spacing.lg,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    backgroundColor: colors.bgRaised,
    boxShadow: elevation.lg,
    color: colors.fg,
  },
});
const drawerStyles = stylex.create({
  base: {
    margin: 0,
    padding: spacing.lg,
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: 0,
    backgroundColor: colors.bgRaised,
    boxShadow: elevation.lg,
    color: colors.fg,
    position: "fixed",
    minHeight: "100vh",
    top: 0,
    width: "min(420px, 100vw)",
  },
});
const drawerSideStyles = stylex.create({
  left: {
    borderRightColor: colors.border,
    borderRightStyle: "solid",
    borderRightWidth: stroke.thin,
    left: 0,
  },
  right: {
    borderLeftColor: colors.border,
    borderLeftStyle: "solid",
    borderLeftWidth: stroke.thin,
    right: 0,
  },
});
const sizeStyles = stylex.create({
  sm: {
    width: "min(360px, calc(100vw - 32px))",
  },
  md: {
    width: "min(480px, calc(100vw - 32px))",
  },
  lg: {
    width: "min(640px, calc(100vw - 32px))",
  },
});
