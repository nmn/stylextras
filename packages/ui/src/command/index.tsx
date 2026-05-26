import { Suspense, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { Button, type ButtonProps } from "../button";
import { DialogProgrammatic, type DialogProgrammaticProps } from "../dialog";
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
import { typography } from "../tokens/typography.stylex";
type BaseProps = ComponentPropsWithRef<"dialog">;
export type CommandProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};
export type CommandContentProps = CommandProps;
export type CommandTriggerProps = Omit<
  ButtonProps,
  "className" | "content" | "style"
> & {
  content: LazyComponentLoader<CommandContentProps>;
  contentProps?: Omit<CommandContentProps, "ref">;
  fallback?: ReactNode;
};
export type CommandComponent = ReactComponent<CommandContentProps>;
export type CommandProgrammaticProps =
  DialogProgrammaticProps<CommandContentProps>;
/**
 * Renders a command menu surface using the native dialog element.
 *
 * Search aliases: command, command menu, command palette, quick actions.
 *
 * A11y notes:
 * - Relies on native <dialog> behavior for modality.
 * - Does not yet provide typeahead command navigation, result activedescendant management, or advanced focus restoration.
 */
export function CommandContent({
  children,
  ref,
  sx,
  ...props
}: CommandContentProps) {
  return (
    <dialog ref={ref} {...props} {...stylex.props(rootStyles.base, sx)}>
      <input
        placeholder="Search commands"
        type="search"
        {...stylex.props(inputStyles.base)}
      />
      <div {...stylex.props(listStyles.base)}>
        {children ?? (
          <>
            <button type="button" {...stylex.props(itemStyles.base)}>
              Open settings
            </button>
            <button type="button" {...stylex.props(itemStyles.base)}>
              Search docs
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
export function CommandTrigger({
  children,
  content,
  contentProps,
  fallback = null,
  onClick,
  onFocus,
  onPointerEnter,
  type = "button",
  ...props
}: CommandTriggerProps) {
  const [mounted, setMounted] = useState(false);
  const commandRef = useRef<HTMLDialogElement | null>(null);
  const shouldOpenRef = useRef(false);
  const { LazyContent, preload } = useLazyComponent(content);
  function openCommand() {
    shouldOpenRef.current = true;
    setMounted(true);
    const command = commandRef.current;
    if (command && !command.open) {
      command.showModal();
      shouldOpenRef.current = false;
    }
  }
  function setCommandRef(node: HTMLDialogElement | null) {
    commandRef.current = node;
    if (node && shouldOpenRef.current && !node.open) {
      node.showModal();
      shouldOpenRef.current = false;
    }
    return () => {
      if (commandRef.current === node) {
        commandRef.current = null;
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
            openCommand();
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
          <LazyContent {...contentProps} ref={setCommandRef} />
        </Suspense>
      ) : null}
    </>
  );
}
export function CommandProgrammatic(props: CommandProgrammaticProps) {
  return <DialogProgrammatic<CommandContentProps> {...props} />;
}
export const Command = CommandContent;
const rootStyles = stylex.create({
  base: {
    margin: "auto",
    padding: spacing.md,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    gap: spacing.xs,
    backgroundColor: colors.bgRaised,
    boxShadow: elevation.lg,
    color: colors.fg,
    display: "grid",
    width: "min(560px, calc(100vw - 32px))",
  },
});
const inputStyles = stylex.create({
  base: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    backgroundColor: colors.bg,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    minHeight: spacing.xxxl,
    width: "100%",
  },
});
const listStyles = stylex.create({
  base: {
    gap: spacing.xxxs,
    display: "grid",
  },
});
const itemStyles = stylex.create({
  base: {
    borderRadius: radius.sm,
    borderWidth: 0,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
    backgroundColor: "transparent",
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    textAlign: "left",
  },
});
