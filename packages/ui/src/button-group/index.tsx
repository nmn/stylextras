import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { ButtonInGroupContext } from "../button/contex";
import { focusgroupProps } from "../focusgroup";
import { spacing } from "../tokens/spacing.stylex";

type BaseProps = ComponentProps<"div">;

export type ButtonGroupProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
};

export type ButtonGroupActionsProps = Omit<
  BaseProps,
  "children" | "className" | "style"
> & {
  leading?: ReactNode;
  primary: ReactNode;
  secondary: ReactNode;
  sx?: StyleXStyles;
};

/**
 * Renders a layout wrapper for visually grouped buttons.
 *
 * Search aliases: button group, actions row, control group, button cluster.
 *
 * A11y notes:
 * - Uses group semantics.
 * - Arrow-key focus movement is provided by focusgroup with a lazy polyfill.
 */
export function ButtonGroup({ sx, ...props }: ButtonGroupProps) {
  return (
    <div
      {...props}
      role="group"
      {...focusgroupProps<HTMLDivElement>("toolbar")}
      {...stylex.props(styles.base, sx)}
    >
      <ButtonInGroupContext value={true}>{props.children}</ButtonInGroupContext>
    </div>
  );
}

/**
 * Renders a gapped action row for dialog footers and confirmation rows.
 *
 * Search aliases: button actions, dialog actions, action row, footer actions.
 *
 * A11y notes:
 * - Uses group semantics.
 * - Keeps the supplied button JSX intact so each button owns its label and type.
 */
export function ButtonGroupActions({
  leading,
  primary,
  secondary,
  sx,
  ...props
}: ButtonGroupActionsProps) {
  return (
    <div
      {...props}
      role="group"
      {...stylex.props(
        styles.actions,
        Boolean(leading) && styles.actionsWithLeading,
        sx,
      )}
    >
      {leading ? (
        <span {...stylex.props(styles.leadingSlot)}>{leading}</span>
      ) : null}
      <span {...stylex.props(styles.actionSlot)}>{secondary}</span>
      <span {...stylex.props(styles.actionSlot)}>{primary}</span>
    </div>
  );
}

const styles = stylex.create({
  actionSlot: {
    display: "grid",
    minWidth: "min(10rem, 100%)",
  },
  actions: {
    gap: spacing.sm,
    alignItems: "center",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    justifyContent: "end",
    marginInlineStart: "auto",
    maxWidth: "100%",
    width: "min(22rem, 100%)",
  },
  actionsWithLeading: {
    gridTemplateColumns: "auto minmax(0, 1fr) minmax(0, 1fr)",
    width: "100%",
  },
  base: {
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    overflow: "hidden",
    paddingInline: `calc(${stroke.thin} / 2)`,
    alignItems: "center",
    backgroundColor: colors.bgRaised,
    columnGap: 0,
    display: "inline-flex",
    flexWrap: "nowrap",
    rowGap: 0,
  },
  leadingSlot: {
    display: "grid",
    marginInlineEnd: "auto",
  },
});
