"use client";

import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { focusgroupProps, focusgroupStartProps } from "../focusgroup";
import { colors } from "../tokens/color.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type BaseProps = ComponentPropsWithoutRef<"div">;

type TabItem = string | { id: string; label: ReactNode; content: ReactNode };

export type TabsProps = Omit<BaseProps, "className" | "style"> & {
  sx?: StyleXStyles;
  tabs?: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const defaultTabs = [
  { id: "overview", label: "Overview", content: "Overview content" },
  { id: "activity", label: "Activity", content: "Activity content" },
  { id: "settings", label: "Settings", content: "Settings content" },
];

/**
 * Renders a simplified tabs primitive.
 *
 * Search aliases: tabs, tablist, tab panel, section tabs.
 *
 * A11y notes:
 * - Uses tab, tablist, and tabpanel roles.
 * - Arrow-key focus movement is provided by focusgroup with a lazy polyfill.
 */
export function Tabs({
  defaultValue,
  onValueChange,
  sx,
  tabs = defaultTabs,
  value,
  ...props
}: TabsProps) {
  const normalizedTabs = tabs.map((tab) =>
    typeof tab === "string" ? { id: tab, label: tab, content: tab } : tab,
  );
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? normalizedTabs[0]?.id ?? "",
  );
  const currentValue = value ?? internalValue;
  const currentTab =
    normalizedTabs.find((tab) => tab.id === currentValue) ?? normalizedTabs[0];

  function handleSelect(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  return (
    <div {...props} {...stylex.props(rootStyles.base, sx)}>
      <div
        role="tablist"
        {...focusgroupProps<HTMLDivElement>("tablist")}
        {...stylex.props(listStyles.base)}
      >
        {normalizedTabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={currentValue === tab.id}
            onClick={() => handleSelect(tab.id)}
            {...focusgroupStartProps(currentValue === tab.id)}
            {...stylex.props(
              tabButtonStyles.base,
              currentValue === tab.id
                ? tabStateStyles.active
                : tabStateStyles.inactive,
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" {...stylex.props(panelStyles.base)}>
        {currentTab?.content}
      </div>
    </div>
  );
}

const rootStyles = stylex.create({
  base: { gap: spacing.md, display: "grid", width: "100%" },
});
const listStyles = stylex.create({
  base: {
    gap: spacing.xs,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    borderBottomWidth: stroke.thin,
  },
});
const tabButtonStyles = stylex.create({
  base: {
    borderColor: "transparent",
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: 0,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
    backgroundColor: "transparent",
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    fontWeight: typography.weightMedium,
  },
});
const tabStateStyles = stylex.create({
  active: { backgroundColor: colors.bgSubtle, color: colors.fg },
  inactive: { backgroundColor: "transparent", color: colors.fgMuted },
});
const panelStyles = stylex.create({
  base: {
    padding: spacing.md,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
  },
});
