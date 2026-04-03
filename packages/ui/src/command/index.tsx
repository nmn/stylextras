import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithRef<"dialog">;

export type CommandProps = Omit<BaseProps, "className" | "style"> & { sx?: StyleXStyles };

/**
 * Renders a command menu surface using the native dialog element.
 *
 * Search aliases: command, command menu, command palette, quick actions.
 *
 * A11y notes:
 * - Relies on native <dialog> behavior for modality.
 * - Does not yet provide typeahead command navigation, result activedescendant management, or advanced focus restoration.
 */
export function Command({ children, ref, sx, ...props }: CommandProps) {
  return (
    <dialog ref={ref} {...props} {...stylex.props(rootStyles.base, sx)}>
      <input placeholder="Search commands" type="search" {...stylex.props(inputStyles.base)} />
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

const rootStyles = stylex.create({
  base: {
    margin: "auto",
    display: "grid",
    gap: spacing.xs,
    width: "min(560px, calc(100vw - 32px))",
    padding: spacing.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    boxShadow: elevation.lg,
  },
});

const inputStyles = stylex.create({
  base: {
    width: "100%",
    minHeight: spacing["3xl"],
    paddingInline: spacing.md,
    paddingBlock: spacing.sm,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
  },
});

const listStyles = stylex.create({
  base: {
    display: "grid",
    gap: spacing["3xs"],
  },
});

const itemStyles = stylex.create({
  base: {
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    borderWidth: 0,
    borderRadius: radius.sm,
    backgroundColor: "transparent",
    color: colors.fg,
    textAlign: "left",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
  },
});
