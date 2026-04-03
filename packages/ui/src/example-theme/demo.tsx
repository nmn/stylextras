"use client";

import * as React from "react";
import * as stylex from "@stylexjs/stylex";
import { colorThemes, type ColorThemeName } from "../color-themes";
import { elevationThemes, type ElevationThemeName } from "../elevation-themes";
import { radiusThemes, type RadiusThemeName } from "../radius-themes";
import { spacingThemes, type SpacingThemeName } from "../spacing-themes";
import { strokeThemes, type StrokeThemeName } from "../stroke-themes";
import {
  typographyThemes,
  type TypographyThemeName,
} from "../typography-themes";
import { colors } from "../tokens/color.stylex";
import { elevation } from "../tokens/elevation.stylex";
import { radius } from "../tokens/radius.stylex";
import { spacing } from "../tokens/spacing.stylex";
import { stroke } from "../tokens/stroke.stylex";
import { typography } from "../tokens/typography.stylex";

type ThemeFieldProps<T extends string> = {
  label: string;
  onChange: (value: T) => void;
  options: readonly T[];
  value: T;
};

type DemoFrameProps = {
  children: React.ReactNode;
  description?: React.ReactNode;
  showThemes?: boolean;
  title: React.ReactNode;
};

type DemoChildrenProps = {
  children: React.ReactNode;
};

const colorThemeOptions = Object.keys(colorThemes) as ColorThemeName[];
const spacingThemeOptions = Object.keys(spacingThemes) as SpacingThemeName[];
const radiusThemeOptions = Object.keys(radiusThemes) as RadiusThemeName[];
const strokeThemeOptions = Object.keys(strokeThemes) as StrokeThemeName[];
const elevationThemeOptions = Object.keys(
  elevationThemes,
) as ElevationThemeName[];
const typographyThemeOptions = Object.keys(
  typographyThemes,
) as TypographyThemeName[];

const styles = stylex.create({
  shell: {
    display: "grid",
    gap: spacing.md,
    width: "100%",
    padding: spacing.lg,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.bgSubtle,
    color: colors.fg,
    boxShadow: elevation.sm,
  },
  header: {
    display: "grid",
    gap: spacing.xs,
  },
  title: {
    fontFamily: typography.fontDisplay,
    fontSize: typography.step2,
    fontWeight: typography.weightBold,
    letterSpacing: typography.trackingTight,
    lineHeight: typography.lineHeightSnug,
  },
  description: {
    maxWidth: "72ch",
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
    lineHeight: typography.lineHeightBody,
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: spacing.sm,
    padding: spacing.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.bg,
  },
  field: {
    display: "grid",
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    fontWeight: typography.weightMedium,
  },
  select: {
    minHeight: spacing["3xl"],
    paddingInline: spacing.sm,
    paddingBlock: spacing.xs,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bgRaised,
    color: colors.fg,
    fontFamily: typography.fontSans,
    fontSize: typography.step0,
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.sm,
  },
  stack: {
    display: "grid",
    gap: spacing.sm,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: spacing.sm,
  },
  panel: {
    display: "grid",
    gap: spacing.sm,
    padding: spacing.md,
    borderStyle: "solid",
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.bg,
  },
  muted: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus1,
    lineHeight: typography.lineHeightBody,
  },
  eyebrow: {
    color: colors.fgMuted,
    fontFamily: typography.fontSans,
    fontSize: typography.stepMinus2,
    fontWeight: typography.weightSemibold,
    letterSpacing: typography.trackingWide,
    textTransform: "uppercase",
  },
});

export function DemoFrame({
  children,
  description,
  showThemes = true,
  title,
}: DemoFrameProps) {
  const [colorTheme, setColorTheme] = React.useState<ColorThemeName>("base");
  const [spacingTheme, setSpacingTheme] =
    React.useState<SpacingThemeName>("base");
  const [radiusTheme, setRadiusTheme] = React.useState<RadiusThemeName>("base");
  const [strokeTheme, setStrokeTheme] = React.useState<StrokeThemeName>("base");
  const [elevationTheme, setElevationTheme] =
    React.useState<ElevationThemeName>("base");
  const [typeTheme, setTypeTheme] = React.useState<TypographyThemeName>("ui");

  return (
    <div
      {...stylex.props(
        styles.shell,
        ...colorThemes[colorTheme],
        ...spacingThemes[spacingTheme],
        ...radiusThemes[radiusTheme],
        ...strokeThemes[strokeTheme],
        ...elevationThemes[elevationTheme],
        ...typographyThemes[typeTheme],
      )}
    >
      <div {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.title)}>{title}</div>
        {description ? (
          <div {...stylex.props(styles.description)}>{description}</div>
        ) : null}
      </div>

      {showThemes ? (
        <div {...stylex.props(styles.controls)}>
          <ThemeField
            label="Color"
            value={colorTheme}
            onChange={setColorTheme}
            options={colorThemeOptions}
          />
          <ThemeField
            label="Spacing"
            value={spacingTheme}
            onChange={setSpacingTheme}
            options={spacingThemeOptions}
          />
          <ThemeField
            label="Radius"
            value={radiusTheme}
            onChange={setRadiusTheme}
            options={radiusThemeOptions}
          />
          <ThemeField
            label="Stroke"
            value={strokeTheme}
            onChange={setStrokeTheme}
            options={strokeThemeOptions}
          />
          <ThemeField
            label="Shadow"
            value={elevationTheme}
            onChange={setElevationTheme}
            options={elevationThemeOptions}
          />
          <ThemeField
            label="Typography"
            value={typeTheme}
            onChange={setTypeTheme}
            options={typographyThemeOptions}
          />
        </div>
      ) : null}

      {children}
    </div>
  );
}

function ThemeField<T extends string>({
  label,
  onChange,
  options,
  value,
}: ThemeFieldProps<T>) {
  return (
    <label {...stylex.props(styles.field)}>
      <span {...stylex.props(styles.fieldLabel)}>{label}</span>
      <select
        value={value}
        onChange={(event) =>
          // @ts-expect-error - value is not a property of HTMLSelectElement
          onChange((event.currentTarget as HTMLSelectElement).value as T)
        }
        {...stylex.props(styles.select)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DemoRow({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.row)}>{children}</div>;
}

export function DemoStack({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.stack)}>{children}</div>;
}

export function DemoGrid({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.grid)}>{children}</div>;
}

export function DemoPanel({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.panel)}>{children}</div>;
}

export function DemoMuted({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.muted)}>{children}</div>;
}

export function DemoEyebrow({ children }: DemoChildrenProps) {
  return <div {...stylex.props(styles.eyebrow)}>{children}</div>;
}
