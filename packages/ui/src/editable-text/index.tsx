"use client";

import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type {
  ClipboardEvent,
  ComponentPropsWithoutRef,
  FormEvent,
  ReactNode,
} from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

export type EditableTextElement = "div" | "span";

export type EditableTextProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "className" | "style" | "children"
> & {
  as?: EditableTextElement;
  children?: ReactNode;
  defaultValue?: string;
  multiline?: boolean;
  onValueChange?: (value: string) => void;
  sx?: StyleXStyles;
};

/**
 * Renders a content-editable text primitive.
 *
 * Search aliases: editable text, inline edit, content editable, editable label.
 *
 * A11y notes:
 * - Contenteditable support is inconsistent across assistive technologies.
 * - It does not add a managed editing mode, validation, or announcement layer.
 */
export function EditableText({
  as = "span",
  children,
  defaultValue,
  multiline = false,
  onPaste,
  onValueChange,
  sx,
  ...props
}: EditableTextProps) {
  function handleInput(event: FormEvent<HTMLElement>) {
    onValueChange?.(event.currentTarget.textContent ?? "");
  }

  function handlePaste(event: ClipboardEvent<HTMLElement>) {
    onPaste?.(event as unknown as ClipboardEvent<HTMLDivElement>);
    if (!multiline) {
      event.preventDefault();
      const text = event.clipboardData
        .getData("text/plain")
        .replace(/s+/g, " ");
      document.execCommand("insertText", false, text);
    }
  }

  const content = children ?? defaultValue ?? "Editable text";
  const role = multiline ? undefined : "textbox";

  if (as === "div" || multiline) {
    return (
      <div
        {...props}
        contentEditable
        role={role}
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        {...stylex.props(
          baseStyles.base,
          multiline && modeStyles.multiline,
          sx,
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <span
      {...props}
      contentEditable
      role={role}
      suppressContentEditableWarning
      onInput={handleInput}
      onPaste={handlePaste}
      {...stylex.props(baseStyles.base, modeStyles.inline, sx)}
    >
      {content}
    </span>
  );
}

const baseStyles = stylex.create({
  base: {
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: "dashed",
    borderWidth: stroke.thin,
    outline: "none",
    paddingBlock: spacing.xxs,
    paddingInline: spacing.xs,
    color: colors.fg,
    display: "inline-block",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
    minWidth: spacing.xxxxl,
  },
});

const modeStyles = stylex.create({
  inline: {
    whiteSpace: "pre-wrap",
  },
  multiline: {
    display: "block",
    whiteSpace: "pre-wrap",
    minHeight: spacing.xxxxl,
  },
});
